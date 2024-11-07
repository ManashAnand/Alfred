from fastapi import APIRouter, HTTPException, Depends, Form, File, UploadFile
from pydantic import ValidationError
from ..models.user_social import UserSocialData
from ..client.supabase import supabase_client
from ..core.security import verify_bearer_token
import uuid
from ..helpers.userHelper import upload_resume,check_user_exist,add_tags_for_user
import json
import uuid
from fastapi import Query

router = APIRouter(prefix='/api')


@router.post('/user-social-data')
async def get_user_data(
    firstName: str = Form(...),
    lastName: str = Form(...),
    myself: str = Form(...),
    leetcode: str = Form(None),
    github: str = Form(None),
    codeforces: str = Form(None),
    atcoder: str = Form(None),
    codechef: str = Form(None),
    kaggle: str = Form(None),
    medium: str = Form(None),
    blogs: str = Form(None),
    portfolio: str = Form(None),
    twitter: str = Form(None),
    resume: UploadFile = File(None),
    tags: str = Form(None),
    user_info: dict = Depends(verify_bearer_token)
):
    try:
        user_id = user_info.get('sub')
        resume_url = None
        tags_list = json.loads(tags) if tags else []
        
        userExistingData,check_if_user_exist = await check_user_exist(user_id)
        print(check_if_user_exist)
        # return
        if check_if_user_exist:
            resume_url = ""
            if resume is not None:
                print(resume.filename)
                file_extension = resume.filename.split('.')[-1].lower()  
                file_name = f"{uuid.uuid4()}.{file_extension}"
                file_path = f"{user_id}/{file_name}"
                file_content = await resume.read()
                

                supabase_client.storage.from_('resumes').upload(
                    file_path,
                    file_content,
                    {
                    "content-type": "application/pdf"  
                    }
                )
                resume_url = supabase_client.storage.from_('resumes').get_public_url(file_path)
            
            user_data = {
                "firstName": firstName or userExistingData['firstName'],
                "lastName": lastName or userExistingData['lastName'],
                "myself": myself or userExistingData['myself'],
                "leetcode": leetcode or userExistingData['leetcode'],
                "github": github or userExistingData['github'],
                "codeforces": codeforces or userExistingData['codeforces'],
                "atcoder": atcoder or userExistingData['atcoder'],
                "codechef": codechef or userExistingData['codechef'],
                "kaggle": kaggle or userExistingData['kaggle'],
                "medium": medium or userExistingData['medium'],
                "blogs": blogs or userExistingData['blogs'],
                "portfolio": portfolio or userExistingData['portfolio'],
                "twitter": twitter or userExistingData['twitter'],
                "resume": resume_url or userExistingData['resume'],
                # "Tag": Tag or userExistingData['Tag'],
                "user_id": user_id,
            }
            if tags is not None:
                tags = await add_tags_for_user(user_id,tags_list)
            # cloudflare_data = {
            #     "user_id": user_id,
            #     "CLOUDFLARE_ACCOUNT_ID":CLOUDFLARE_ACCOUNT_ID,
            #     "CLOUDFLARE_AUTH_TOKEN":CLOUDFLARE_AUTH_TOKEN
            # }
            res = supabase_client.table("userinfo").update(user_data).eq("user_id", user_id).execute()
        
            # res = supabase_client.table("cloudflare").update(cloudflare_data).eq("user_id", user_id).execute()
            return {"status": "success", "data": res.data[0]}

                
        # Handle the resume upload if file is provided
        if resume:
            print(resume.filename)
            file_extension = resume.filename.split('.')[-1].lower()  
            file_name = f"{uuid.uuid4()}.{file_extension}"
            file_path = f"{user_id}/{file_name}"
            file_content = await resume.read()
            

            supabase_client.storage.from_('resumes').upload(
                file_path,
                file_content,
                {
                  "content-type": "application/pdf"  
                 }
            )
            resume_url = supabase_client.storage.from_('resumes').get_public_url(file_path)

        print(resume_url)
        # Combine all data into a dictionary for insertion
        user_data = {
            "firstName": firstName,
            "lastName": lastName,
            "myself": myself,
            "leetcode": leetcode,
            "github": github,
            "codeforces": codeforces,
            "atcoder": atcoder,
            "codechef": codechef,
            "kaggle": kaggle,
            "medium": medium,
            "blogs": blogs,
            "portfolio": portfolio,
            "twitter": twitter,
            "resume": resume_url,
            "user_id": user_id,
        }
        
        tags = await add_tags_for_user(user_id,tags_list)
        res = supabase_client.table("userinfo").insert(user_data).execute()
        
        return {"status": "success", "data": res.data[0]}
    except ValidationError as e:
        print("Validation error:", str(e))
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        print("Unexpected error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/get-resume')
async def getResume(user_info: dict = Depends(verify_bearer_token)):
    user_id = user_info.get('sub')
    resume_url = None
    try:
        response = supabase_client.table("userinfo") \
            .select("resume") \
            .eq("user_id", user_id) \
            .execute()
        
        if response.data and len(response.data) > 0:
            return {"resume_url": response.data[0]["resume"]}
        return {"resume_url": None}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    

@router.get('/lastestUser')
def getLatestUser(user_info: dict = Depends(verify_bearer_token),totalUser: str = Query()):
    try:
        response = supabase_client.table("userinfo") \
            .select("*") \
            .order('created_at', desc=True) \
            .limit(totalUser) \
            .execute()
            
        return {"success": True, "data": response.data}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    