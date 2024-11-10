import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, HTTPException, status, FastAPI , Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt  # PyJWT
from .core.security import verify_bearer_token
from dotenv import load_dotenv
# from .routers.userRouter import router as UserRouter
# from .routers.chatRouter import router as ChatRouter
from .routers import router
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

app = FastAPI()
# app.include_router(UserRouter)
# app.include_router(ChatRouter)
app.include_router(router)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def root():
    return {"message": "Welcome to Socio!"}


@app.get("/protected-route")
def protected_route(user_info: dict = Depends(verify_bearer_token)):
    
    return {"message": "Welcome, authenticated user!", "user_info": user_info}


@app.get("/unprotected-route")
def unprotected_route():
    return {"message": "Welcome, un-authenticated user!"}


@app.get("/api/get_user_id")
def hello_fast_api(user_info: dict = Depends(verify_bearer_token)):
    print(user_info["sub"])
    return {"user_id": user_info["sub"]}