from main import app
import uvicorn
from fastapi.testclient import TestClient

def test_health_endpoint():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

if __name__ == "__main__":
    test_health_endpoint()
    print("All tests passed!")