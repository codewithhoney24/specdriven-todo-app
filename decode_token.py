import jwt
import requests
import json

# Decode JWT token to inspect its contents
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLXRlc3R1c2VyLWE3NDQ4NjNkODNhZWZjMzUiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImV4cCI6MTc2OTc1MDI5OH0.6O5fFzH3qo8Q7Y7y9Z0J8r3vF4z6Q1v5p9R2z8v7Y8E"  # Replace with actual token from previous test

try:
    # Split the token to get the payload part
    parts = token.split('.')
    if len(parts) == 3:
        # Decode the payload (second part)
        import base64
        payload_b64 = parts[1]
        # Add padding if necessary
        payload_b64 += '=' * (4 - len(payload_b64) % 4)
        payload_bytes = base64.urlsafe_b64decode(payload_b64)
        payload_str = payload_bytes.decode('utf-8')
        payload = json.loads(payload_str)
        
        print("Decoded JWT Payload:")
        print(json.dumps(payload, indent=2))
        
        # Verify the token using the known secret
        SECRET_KEY = "0jiHoY8Kwev11Q6JkwJLYjMlZymCREJR"  # From backend .env file
        
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            print("\nVerified token contents:")
            print(json.dumps(decoded_token, indent=2))
        except jwt.InvalidSignatureError:
            print("\nToken signature verification failed - using wrong secret key")
        except jwt.ExpiredSignatureError:
            print("\nToken has expired")
        except Exception as e:
            print(f"\nToken verification error: {e}")
    else:
        print("Invalid token format")
except Exception as e:
    print(f"Error decoding token: {e}")