from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_signup_and_list():
    import uuid

    unique_email = f"signup_{uuid.uuid4().hex}@example.com"

    payload = {
        "user": {
            "email": unique_email,
            "name": "Test User",
            "age": 30,
            "gender": "non-binary",
            "bio": "Hello world",
        },
        "transactions": [
            {
                "date": "2025-01-01",
                "description": "Coffee",
                "amount": 3.5,
            }
        ],
    }

    resp = client.post("/signup", json=payload)
    assert resp.status_code == 200
    profile_id = resp.json()["id"]

    list_resp = client.get("/user-profiles")
    assert list_resp.status_code == 200
    profiles = list_resp.json()
    assert any(p["id"] == profile_id for p in profiles)

    # Sign up another user to ensure matches
    payload2 = {
        "user": {"email": f"{uuid.uuid4().hex}@example.com"},
        "transactions": [],
    }
    resp2 = client.post("/signup", json=payload2)
    assert resp2.status_code == 200

    matches_resp = client.get(f"/matches?profile_id={profile_id}")
    assert matches_resp.status_code == 200
    matches = matches_resp.json()
    assert len(matches) >= 1 