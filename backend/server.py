from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"

# ── Helpers ──

def get_jwt_secret():
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, username: str) -> str:
    payload = {
        "sub": user_id, "username": username,
        "exp": datetime.now(timezone.utc) + timedelta(hours=2),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_admin(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        admin = await db.admins.find_one({"id": payload["sub"]}, {"_id": 0})
        if not admin:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ── Models ──

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class WaitlistSignup(BaseModel):
    email: EmailStr

class WaitlistFeedback(BaseModel):
    email: EmailStr
    feedback: str

class WaitlistResponse(BaseModel):
    id: str
    email: str
    signed_up_at: str
    message: str

class WaitlistCountResponse(BaseModel):
    count: int

class FeedbackResponse(BaseModel):
    message: str

class AdminLogin(BaseModel):
    username: str
    password: str

class VisitEvent(BaseModel):
    page: str = "landing"

class ClickEvent(BaseModel):
    element: str

class SectionTimeEvent(BaseModel):
    session_id: str
    sections: dict  # {"hero": 12.5, "features": 8.3, ...}


# ── Routes: Status ──

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for c in checks:
        if isinstance(c['timestamp'], str):
            c['timestamp'] = datetime.fromisoformat(c['timestamp'])
    return checks


# ── Routes: Waitlist ──

@api_router.post("/waitlist", response_model=WaitlistResponse)
async def join_waitlist(signup: WaitlistSignup):
    existing = await db.waitlist.find_one({"email": signup.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=409, detail="This email is already on the waitlist!")
    doc = {
        "id": str(uuid.uuid4()),
        "email": signup.email,
        "signed_up_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.waitlist.insert_one(doc)
    count = await db.waitlist.count_documents({})
    return WaitlistResponse(id=doc["id"], email=doc["email"], signed_up_at=doc["signed_up_at"], message=f"You're #{count} on the waitlist!")

@api_router.get("/waitlist/count", response_model=WaitlistCountResponse)
async def get_waitlist_count():
    return WaitlistCountResponse(count=await db.waitlist.count_documents({}))

@api_router.post("/waitlist/feedback", response_model=FeedbackResponse)
async def submit_feedback(feedback: WaitlistFeedback):
    doc = {
        "id": str(uuid.uuid4()),
        "email": feedback.email,
        "feedback": feedback.feedback,
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.waitlist_feedback.insert_one(doc)
    return FeedbackResponse(message="Thanks for sharing! We'll use this to make Rupert even better.")


# ── Routes: Analytics (public, no auth) ──

@api_router.post("/analytics/visit")
async def track_visit(event: VisitEvent, request: Request):
    doc = {
        "type": "visit",
        "page": event.page,
        "ip": request.client.host if request.client else "unknown",
        "user_agent": request.headers.get("user-agent", ""),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.analytics.insert_one(doc)
    return {"ok": True}

@api_router.post("/analytics/click")
async def track_click(event: ClickEvent, request: Request):
    doc = {
        "type": "click",
        "element": event.element,
        "ip": request.client.host if request.client else "unknown",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.analytics.insert_one(doc)
    return {"ok": True}

@api_router.post("/analytics/section-time")
async def track_section_time(event: SectionTimeEvent):
    doc = {
        "type": "section_time",
        "session_id": event.session_id,
        "sections": event.sections,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.analytics.insert_one(doc)
    return {"ok": True}


# ── Routes: Admin Auth ──

@api_router.post("/auth/login")
async def admin_login(creds: AdminLogin, request: Request, response: Response):
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{creds.username}"

    # Rate limit: 3 attempts per 10 minutes
    ten_min_ago = (datetime.now(timezone.utc) - timedelta(minutes=10)).isoformat()
    recent_attempts = await db.login_attempts.count_documents({
        "identifier": identifier,
        "timestamp": {"$gte": ten_min_ago},
    })
    if recent_attempts >= 3:
        raise HTTPException(status_code=429, detail="Too many login attempts. Try again in 10 minutes.")

    admin = await db.admins.find_one({"username": creds.username}, {"_id": 0})
    if not admin or not verify_password(creds.password, admin["password_hash"]):
        await db.login_attempts.insert_one({
            "identifier": identifier,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Clear attempts on success
    await db.login_attempts.delete_many({"identifier": identifier})

    token = create_access_token(admin["id"], admin["username"])
    response.set_cookie(
        key="access_token", value=token, httponly=True,
        secure=False, samesite="lax", max_age=7200, path="/",
    )
    return {"username": admin["username"], "token": token}

@api_router.post("/auth/logout")
async def admin_logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}

@api_router.get("/auth/me")
async def admin_me(admin=Depends(get_current_admin)):
    return {"username": admin["username"]}


# ── Routes: Admin Dashboard (protected) ──

@api_router.get("/admin/signups")
async def get_signups(admin=Depends(get_current_admin)):
    signups = await db.waitlist.find({}, {"_id": 0}).sort("signed_up_at", -1).to_list(5000)
    return signups

@api_router.get("/admin/feedback")
async def get_feedback(admin=Depends(get_current_admin)):
    feedback = await db.waitlist_feedback.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(5000)
    return feedback

@api_router.get("/admin/analytics")
async def get_analytics(admin=Depends(get_current_admin)):
    total_visits = await db.analytics.count_documents({"type": "visit"})
    total_clicks = await db.analytics.count_documents({"type": "click"})
    total_signups = await db.waitlist.count_documents({})

    # Click breakdown
    click_pipeline = [
        {"$match": {"type": "click"}},
        {"$group": {"_id": "$element", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    click_breakdown = await db.analytics.aggregate(click_pipeline).to_list(100)

    # Section time averages
    section_pipeline = [
        {"$match": {"type": "section_time"}},
        {"$project": {"sections": {"$objectToArray": "$sections"}}},
        {"$unwind": "$sections"},
        {"$group": {"_id": "$sections.k", "avg_time": {"$avg": "$sections.v"}, "total_sessions": {"$sum": 1}}},
        {"$sort": {"avg_time": -1}},
    ]
    section_times = await db.analytics.aggregate(section_pipeline).to_list(100)

    # Daily visits for last 14 days
    fourteen_days_ago = (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()
    daily_pipeline = [
        {"$match": {"type": "visit", "timestamp": {"$gte": fourteen_days_ago}}},
        {"$project": {"day": {"$substr": ["$timestamp", 0, 10]}}},
        {"$group": {"_id": "$day", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    daily_visits = await db.analytics.aggregate(daily_pipeline).to_list(100)

    # Daily signups
    signup_pipeline = [
        {"$project": {"day": {"$substr": ["$signed_up_at", 0, 10]}}},
        {"$group": {"_id": "$day", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    daily_signups = await db.waitlist.aggregate(signup_pipeline).to_list(100)

    return {
        "total_visits": total_visits,
        "total_clicks": total_clicks,
        "total_signups": total_signups,
        "conversion_rate": round((total_signups / total_visits * 100), 1) if total_visits > 0 else 0,
        "click_breakdown": [{"element": c["_id"], "count": c["count"]} for c in click_breakdown],
        "section_times": [{"section": s["_id"], "avg_seconds": round(s["avg_time"], 1), "sessions": s["total_sessions"]} for s in section_times],
        "daily_visits": [{"date": d["_id"], "count": d["count"]} for d in daily_visits],
        "daily_signups": [{"date": d["_id"], "count": d["count"]} for d in daily_signups],
    }

@api_router.get("/admin/export-csv")
async def export_csv(admin=Depends(get_current_admin)):
    signups = await db.waitlist.find({}, {"_id": 0, "email": 1, "signed_up_at": 1}).to_list(50000)
    csv_lines = ["email,signed_up_at"]
    for s in signups:
        csv_lines.append(f"{s['email']},{s['signed_up_at']}")
    return Response(
        content="\n".join(csv_lines),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=rupertjolt_waitlist.csv"},
    )


# ── App setup ──

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    # Seed admin
    admin_username = os.environ.get("ADMIN_USERNAME", "admin")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.admins.find_one({"username": admin_username}, {"_id": 0})
    if not existing:
        await db.admins.insert_one({
            "id": str(uuid.uuid4()),
            "username": admin_username,
            "password_hash": hash_password(admin_password),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {admin_username}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.admins.update_one(
            {"username": admin_username},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info(f"Admin password updated: {admin_username}")

    # Indexes
    await db.admins.create_index("username", unique=True)
    await db.waitlist.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.analytics.create_index("type")
    await db.analytics.create_index("timestamp")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
