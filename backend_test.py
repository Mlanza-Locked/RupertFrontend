import requests
import sys
import time
from datetime import datetime
import json

class RupertAPITester:
    def __init__(self, base_url="https://first-pass-ai.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.session = requests.Session()

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"   Response: {response.text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")

            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response": response.text[:200] if response.text else ""
            })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_waitlist_count(self):
        """Test getting waitlist count"""
        success, response = self.run_test("Get Waitlist Count", "GET", "waitlist/count", 200)
        if success and 'count' in response:
            print(f"   Current waitlist count: {response['count']}")
        return success, response

    def test_waitlist_signup(self, email):
        """Test waitlist signup"""
        success, response = self.run_test(
            "Waitlist Signup",
            "POST",
            "waitlist",
            200,
            data={"email": email}
        )
        return success, response

    def test_duplicate_signup(self, email):
        """Test duplicate email signup (should return 409)"""
        success, response = self.run_test(
            "Duplicate Email Signup",
            "POST", 
            "waitlist",
            409,
            data={"email": email}
        )
        return success, response

    def test_feedback_submission(self, email, feedback):
        """Test feedback submission"""
        success, response = self.run_test(
            "Submit Feedback",
            "POST",
            "waitlist/feedback",
            200,
            data={"email": email, "feedback": feedback}
        )
        return success, response

    def test_invalid_email(self):
        """Test invalid email format"""
        success, response = self.run_test(
            "Invalid Email Format",
            "POST",
            "waitlist", 
            422,  # FastAPI validation error
            data={"email": "invalid-email"}
        )
        return success, response

    def test_public_analytics_endpoints(self):
        """Test public analytics tracking endpoints"""
        print("\n📊 Testing Public Analytics Endpoints...")
        
        # Test visit tracking
        success, _ = self.run_test(
            "Track Page Visit",
            "POST",
            "analytics/visit",
            200,
            data={"page": "landing"}
        )
        
        # Test click tracking
        success, _ = self.run_test(
            "Track CTA Click",
            "POST", 
            "analytics/click",
            200,
            data={"element": "hero-cta"}
        )
        
        # Test section time tracking
        success, _ = self.run_test(
            "Track Section Time",
            "POST",
            "analytics/section-time", 
            200,
            data={
                "session_id": "test_session_123",
                "sections": {"hero": 15.5, "features": 8.2}
            }
        )

    def test_admin_login_success(self):
        """Test successful admin login"""
        print("\n🔐 Testing Admin Login (Success)...")
        
        success, response = self.run_test(
            "Admin Login - Valid Credentials",
            "POST",
            "auth/login",
            200,
            data={
                "username": "RupertAdminJolt",
                "password": "Rupert_2026"
            }
        )
        
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token received: {self.token[:20]}...")
            return True
        return False

    def test_admin_login_failure(self):
        """Test admin login with wrong credentials"""
        print("\n🚫 Testing Admin Login (Failure)...")
        
        success, _ = self.run_test(
            "Admin Login - Invalid Password",
            "POST",
            "auth/login", 
            401,
            data={
                "username": "RupertAdminJolt",
                "password": "wrong_password"
            }
        )

    def test_rate_limiting(self):
        """Test rate limiting after 3 failed attempts"""
        print("\n⏱️ Testing Rate Limiting...")
        
        # Make 3 failed attempts
        for i in range(3):
            success, _ = self.run_test(
                f"Failed Login Attempt {i+1}",
                "POST",
                "auth/login",
                401,
                data={
                    "username": "RupertAdminJolt", 
                    "password": "wrong_password"
                }
            )
        
        # 4th attempt should be rate limited
        success, _ = self.run_test(
            "Rate Limited Login Attempt",
            "POST",
            "auth/login",
            429,
            data={
                "username": "RupertAdminJolt",
                "password": "wrong_password"
            }
        )

    def test_auth_me(self):
        """Test /auth/me endpoint"""
        print("\n👤 Testing Auth Me Endpoint...")
        
        if not self.token:
            print("❌ No token available for auth/me test")
            return False
            
        success, response = self.run_test(
            "Get Current Admin",
            "GET",
            "auth/me",
            200,
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
        if success and response.get('username') == 'RupertAdminJolt':
            print("   ✅ Correct username returned")
            return True
        return False

    def test_protected_admin_endpoints(self):
        """Test protected admin dashboard endpoints"""
        print("\n🛡️ Testing Protected Admin Endpoints...")
        
        if not self.token:
            print("❌ No token available for protected endpoint tests")
            return False
            
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Test analytics endpoint
        success, response = self.run_test(
            "Get Admin Analytics",
            "GET",
            "admin/analytics",
            200,
            headers=headers
        )
        
        if success:
            required_fields = ['total_visits', 'total_clicks', 'total_signups', 'conversion_rate']
            for field in required_fields:
                if field in response:
                    print(f"   ✅ {field}: {response[field]}")
                else:
                    print(f"   ❌ Missing field: {field}")
        
        # Test signups endpoint
        success, _ = self.run_test(
            "Get Admin Signups",
            "GET",
            "admin/signups",
            200,
            headers=headers
        )
        
        # Test feedback endpoint
        success, _ = self.run_test(
            "Get Admin Feedback",
            "GET", 
            "admin/feedback",
            200,
            headers=headers
        )
        
        # Test CSV export endpoint
        success, _ = self.run_test(
            "Export CSV",
            "GET",
            "admin/export-csv",
            200,
            headers=headers
        )

    def test_unauthorized_access(self):
        """Test that protected endpoints require authentication"""
        print("\n🚨 Testing Unauthorized Access...")
        
        protected_endpoints = [
            "admin/analytics",
            "admin/signups", 
            "admin/feedback",
            "admin/export-csv",
            "auth/me"
        ]
        
        for endpoint in protected_endpoints:
            success, _ = self.run_test(
                f"Unauthorized Access - {endpoint}",
                "GET",
                endpoint,
                401
            )

    def test_logout(self):
        """Test admin logout"""
        print("\n🚪 Testing Admin Logout...")
        
        success, _ = self.run_test(
            "Admin Logout",
            "POST",
            "auth/logout",
            200
        )

def main():
    print("🚀 Starting Rupert Joel Admin Dashboard API Tests")
    print("=" * 50)
    
    # Setup
    tester = RupertAPITester()
    test_email = f"newtester{datetime.now().strftime('%H%M%S')}@rupert.com"
    
    # Test sequence
    print(f"\n📧 Using test email: {test_email}")
    
    # 1. Test root endpoint
    tester.test_root_endpoint()
    
    # 2. Test public analytics endpoints
    tester.test_public_analytics_endpoints()
    
    # 3. Test waitlist functionality
    success, count_before = tester.test_waitlist_count()
    initial_count = count_before.get('count', 0) if success else 0
    
    signup_success, signup_response = tester.test_waitlist_signup(test_email)
    
    if signup_success:
        success, count_after = tester.test_waitlist_count()
        new_count = count_after.get('count', 0) if success else 0
        if new_count == initial_count + 1:
            print(f"✅ Count increased correctly: {initial_count} → {new_count}")
        else:
            print(f"⚠️  Count mismatch: expected {initial_count + 1}, got {new_count}")
    
    tester.test_duplicate_signup(test_email)
    
    if signup_success:
        tester.test_feedback_submission(
            test_email, 
            "I spend too much time removing silence from my podcast episodes!"
        )
    
    tester.test_invalid_email()
    
    # 4. Test unauthorized access to protected endpoints
    tester.test_unauthorized_access()
    
    # 5. Test admin authentication failures
    tester.test_admin_login_failure()
    
    # 6. Test rate limiting (this will make 4 failed attempts)
    tester.test_rate_limiting()
    
    # Wait a bit before successful login to avoid rate limit
    print("\n⏳ Waiting 2 seconds before successful login...")
    time.sleep(2)
    
    # 7. Test successful admin login
    if not tester.test_admin_login_success():
        print("❌ Admin login failed, stopping protected endpoint tests")
        return 1
    
    # 8. Test auth/me
    tester.test_auth_me()
    
    # 9. Test protected admin endpoints
    tester.test_protected_admin_endpoints()
    
    # 10. Test logout
    tester.test_logout()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        print("\nFailed tests:")
        for result in tester.test_results:
            if not result['success']:
                error_msg = result.get('error', f'Status {result["actual_status"]}')
                print(f"  - {result['name']}: {error_msg}")
        return 1

if __name__ == "__main__":
    sys.exit(main())