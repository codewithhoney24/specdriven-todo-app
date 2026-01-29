from main import app
import uvicorn
import threading
import time
import requests

def run_server():
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")

if __name__ == "__main__":
    # Start server in a separate thread
    server_thread = threading.Thread(target=run_server)
    server_thread.daemon = True
    server_thread.start()
    
    # Wait a bit for server to start
    time.sleep(2)
    
    print("Server started, testing API...")
    
    # Test the API
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Health check: {response.status_code} - {response.text}")
        
        # Test task API with the token
        headers = {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLXRlc3QtOTczZGZlNDYzZWM4NTc4NSIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImV4cCI6MTc2OTk3MTYxN30.T3Ctt7vumgqKEfjyQ1FNXBOhoHCitm6Bz2Vsy6TOLzo"
        }
        response = requests.get("http://localhost:8000/api/mock-test-973dfe463ec85785/tasks", headers=headers)
        print(f"Tasks API: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error testing API: {e}")
    
    # Keep the main thread alive to see server output
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down...")