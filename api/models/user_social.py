from pydantic import BaseModel
from fastapi import Form, UploadFile, File
from datetime import datetime
from typing import Optional

class UserSocialData(BaseModel):
    firstName: str = Form(...)
    lastName: str = Form(...)
    myself: str = Form(...)
    leetcode: str | None = Form(None)
    github: str | None = Form(None)
    codeforces: str | None = Form(None)
    atcoder: str | None = Form(None)
    codechef: str | None = Form(None)
    kaggle: str | None = Form(None)
    medium: str | None = Form(None)
    blogs: str | None = Form(None)
    portfolio: str | None = Form(None)
    twitter: str | None = Form(None)

class UserSocialDataForm(BaseModel):
    data: UserSocialData
    resume: UploadFile | None

class CloudflareModel(BaseModel):
    CLOUDFLARE_ACCOUNT_ID: str
    CLOUDFLARE_AUTH_TOKEN: str

class FeedInput(BaseModel):
    currentFeed: str
    
class MessageModel(BaseModel):
    message: str

class UserInfoModel(BaseModel):
    id: int
    created_at: datetime
    user_id: str
    firstName: str
    lastName: str
    myself: str
    leetcode: Optional[str] = ""
    github: Optional[str] = ""
    codeforces: Optional[str] = ""
    atcoder: Optional[str] = ""
    codechef: Optional[str] = ""
    kaggle: Optional[str] = ""
    medium: Optional[str] = ""
    blogs: Optional[str] = ""
    portfolio: Optional[str] = ""
    twitter: Optional[str] = ""
    resume: Optional[str] = ""

    class Config:
        from_attributes = True  # Allows model to work with ORMs