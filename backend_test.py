import requests
import sys
from datetime import datetime
import json

class RupertAPITester:
    def __init__(self, base_url="https://first-pass-ai.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

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

def main():
    print("🚀 Starting Rupert Joel API Tests")
    print("=" * 50)
    
    # Setup
    tester = RupertAPITester()
    test_email = f"newtester{datetime.now().strftime('%H%M%S')}@rupert.com"
    
    # Test sequence
    print(f"\n📧 Using test email: {test_email}")
    
    # 1. Test root endpoint
    tester.test_root_endpoint()
    
    # 2. Test waitlist count (before signup)
    success, count_before = tester.test_waitlist_count()
    initial_count = count_before.get('count', 0) if success else 0
    
    # 3. Test waitlist signup
    signup_success, signup_response = tester.test_waitlist_signup(test_email)
    
    # 4. Test waitlist count (after signup)
    if signup_success:
        success, count_after = tester.test_waitlist_count()
        new_count = count_after.get('count', 0) if success else 0
        if new_count == initial_count + 1:
            print(f"✅ Count increased correctly: {initial_count} → {new_count}")
        else:
            print(f"⚠️  Count mismatch: expected {initial_count + 1}, got {new_count}")
    
    # 5. Test duplicate signup (should fail with 409)
    tester.test_duplicate_signup(test_email)
    
    # 6. Test feedback submission
    if signup_success:
        tester.test_feedback_submission(
            test_email, 
            "I spend too much time removing silence from my podcast episodes!"
        )
    
    # 7. Test invalid email format
    tester.test_invalid_email()
    
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