from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
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


# Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Waitlist endpoints
@api_router.post("/waitlist", response_model=WaitlistResponse)
async def join_waitlist(signup: WaitlistSignup):
    # Check if email already exists
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

    return WaitlistResponse(
        id=doc["id"],
        email=doc["email"],
        signed_up_at=doc["signed_up_at"],
        message=f"You're #{count} on the waitlist!"
    )


@api_router.get("/waitlist/count", response_model=WaitlistCountResponse)
async def get_waitlist_count():
    count = await db.waitlist.count_documents({})
    return WaitlistCountResponse(count=count)


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


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
