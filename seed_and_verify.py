
import requests
import json
from datetime import date

BASE_URL = "http://localhost:4000"

def login(username, password):
    url = f"{BASE_URL}/api/auth/login"
    payload = {"email": username, "password": password}
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json()['token']
    else:
        print(f"Login failed: {response.text}")
        return None

def create_time_record(token, category, duration, title):
    url = f"{BASE_URL}/api/time-records"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "title": title,
        "duration": duration,
        "category": category,
        "recordDate": str(date.today()),
        "color": "#000000",
        "startTime": 0
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code != 200:
        print(f"Failed to create record for {category}: {response.text}")
    else:
        print(f"Created record: {category} - {duration}m")

def check_time_allocation(token):
    today = str(date.today())
    url = f"{BASE_URL}/api/analytics/time-allocation?startDate={today}&endDate={today}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("\n--- Analytics Data ---")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print(f"Failed to get analytics: {response.text}")

token = login("demo_qv2@test.com", "password123")
if token:
    print("Logged in successfully.")
    create_time_record(token, "深度工作", 120, "Deep Work Session")
    create_time_record(token, "健康", 60, "Morning Run") 
    create_time_record(token, "行政", 30, "Emails")
    create_time_record(token, "Testing", 15, "Misc") # Test dynamic rendering for a 4th category
    
    check_time_allocation(token)
