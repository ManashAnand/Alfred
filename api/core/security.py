import os
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt  
import base64
from dotenv import load_dotenv

load_dotenv()

SUPABASE_JWT_SECRET = os.getenv('NEXT_PUBLIC_SUPABASE_JWT_SECRET')
# SUPABASE_JWT_SECRET = base64.b64decode(SUPABASE_JWT_SECRET)

security = HTTPBearer()


# logging.info(f"JWT Secret: {SUPABASE_JWT_SECRET}")
def verify_bearer_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"],
            options={"verify_aud": False})
        print(f"Payload: {payload}")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )