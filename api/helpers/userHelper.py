from ..client.supabase import supabase_client
from fastapi import APIRouter, HTTPException, Depends, Form, File, UploadFile
import uuid
from ..models.user_social import UserInfoModel
import os
from typing import List
import requests
from fastapi.responses import StreamingResponse

async def check_user_exist(user_id):
    response = supabase_client.table("userinfo").select("*").eq("user_id", user_id).single().execute()
    
    print(response)
    if response.data:
        return response.data, True
    return False



async def upload_resume(resume, user_id):
    if resume:
        # Get file extension and create a unique file name
        file_extension = resume.filename.split('.')[-1].lower()
        file_name = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"{user_id}/{file_name}"
        
        # Read file content as binary
        file_content = await resume.read()
        
        try:
            # Upload the file to 'resumes' bucket
            response = supabase_client.storage.from_('resumes').upload(
                file_path,
                file_content,
                {"upsert": True}  # Upsert ensures it overwrites if the file exists
            )

            # Check if upload was successful
            if response.get("error"):
                print("Upload error:", response["error"]["message"])
                return None

            # Get the public URL
            resume_url = supabase_client.storage.from_('resumes').get_public_url(file_path)
            return resume_url
        
        except Exception as e:
            print(f"An error occurred during upload: {e}")
            return None


async def get_user_data(user_id: str):
    try:
        response = supabase_client.table("userinfo").select("*").eq("user_id", user_id).single().execute()
        
        if response.data:
            return response.data
        else:
            raise HTTPException(
                status_code=404, 
                detail=f"No user found with id: {user_id}"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    

async def ask_from_cloudflare(user_whole_info: UserInfoModel,input_from_user:str):
    try:
        print("User Info Received:", user_whole_info)
        res =  supabase_client.table("cloudflare") .select("*").eq("user_id", user_whole_info["user_id"]).single().execute()
        print(res)
        print(res.data[0]["CLOUDFLARE_ACCOUNT_ID"])
        
        
        CLOUDFLARE_ACCOUNT_ID = res.data[0]["CLOUDFLARE_ACCOUNT_ID"]
        CLOUDFLARE_AUTH_TOKEN = res.data[0]["CLOUDFLARE_AUTH_TOKEN"]
        
        if (
            not CLOUDFLARE_ACCOUNT_ID
            or not CLOUDFLARE_AUTH_TOKEN
        ):
            CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
            CLOUDFLARE_AUTH_TOKEN = os.getenv("CLOUDFLARE_AUTH_TOKEN")
            
        CLOUDFLARE_MODEL_FOR_CHAT = os.getenv("CLOUDFLARE_MODEL_FOR_CHAT")

        if (
            not CLOUDFLARE_ACCOUNT_ID
            or not CLOUDFLARE_AUTH_TOKEN
            or not CLOUDFLARE_MODEL_FOR_CHAT
        ):
            raise HTTPException(
                status_code=500, detail="Missing Cloudflare configuration"
            )

        url = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/run/{CLOUDFLARE_MODEL_FOR_CHAT}"
        headers = {
            "Authorization": f"Bearer {CLOUDFLARE_AUTH_TOKEN}",
            "Content-Type": "application/json",
        }

        social_links = []
        
        if user_whole_info['github']:
            social_links.append(f"- **GitHub**: [{user_whole_info['github']}]({user_whole_info['github']})")
        if user_whole_info['twitter']:
            social_links.append(f"- **Twitter**: [{user_whole_info['twitter']}]({user_whole_info['twitter']})")
        if user_whole_info['medium']:
            social_links.append(f"- **Medium**: [{user_whole_info['medium']}]({user_whole_info['medium']})")
        if user_whole_info['portfolio']:
            social_links.append(f"- **Portfolio**: [{user_whole_info['portfolio']}]({user_whole_info['portfolio']})")
        if user_whole_info['leetcode']:
            social_links.append(f"- **LeetCode**: [{user_whole_info['leetcode']}]({user_whole_info['leetcode']})")
        if user_whole_info['codeforces']:
            social_links.append(f"- **CodeForces**: [{user_whole_info['codeforces']}]({user_whole_info['codeforces']})")
        if user_whole_info['atcoder']:
            social_links.append(f"- **AtCoder**: [{user_whole_info['atcoder']}]({user_whole_info['atcoder']})")
        if user_whole_info['codechef']:
            social_links.append(f"- **CodeChef**: [{user_whole_info['codechef']}]({user_whole_info['codechef']})")
        if user_whole_info['kaggle']:
            social_links.append(f"- **Kaggle**: [{user_whole_info['kaggle']}]({user_whole_info['kaggle']})")
        if user_whole_info['blogs']:
            social_links.append(f"- **Blogs**: [{user_whole_info['blogs']}]({user_whole_info['blogs']})")

        social_links_text = "\n".join(social_links) if social_links else "No social links provided"
        
        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": f"""You are the assistant of {user_whole_info['firstName']} {user_whole_info['lastName']}, {user_whole_info['myself']}

                    ** Some information about me is {user_whole_info['myself']}

                    He is eager to explore opportunities in exciting projects, whether as a full-time employee, an intern, or a freelancer. You can discover more about his work and connect with him through his online profiles:
                    {social_links_text}
                    Also this profile is created at {user_whole_info['created_at']} and change this to normal timezone
                    """
                },
                {"role": "user", "content": input_from_user},
            ]
        }
        
        
        response = requests.post(url, headers=headers, json=payload, stream=False)
        if response.data:
            print(f"Failed request: - {response.reason}")
            print(f"Response content: {response.text}")
            raise HTTPException(status_code=200, detail=response.text)
        
        
        if not response.data:
            print("Invalid api key")
            print(f"Failed request: - {response.reason}")
            print(f"Response content: {response.text}")
            raise HTTPException(status_code=401, detail=response.text)

        print(response.json()['result']['response']  )
        return response.json()['result']['response']  
    except Exception as e:
        print(f"General exception: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    
    
async def add_tags_for_user(user_id: str, tags_list: List[dict]):
    tag_ids = []
    
    # First, delete any existing tags for the user
    delete_response = supabase_client.table('user_tags').delete().eq('user_id', user_id).execute()
    
    # Now, add each tag from tags_list
    for tag in tags_list:
        tag_value = tag.get('value')
        tag_label = tag.get('label')

        if tag_value and tag_label:
            # Check if the tag already exists
            existing_tag = supabase_client.table('tags').select('tag_id').eq('tag_name', tag_value).single().execute()

            if existing_tag.data:
                # If the tag exists, get its tag_id
                tag_id = existing_tag.data['tag_id']
            else:
                # If it doesn't exist, insert it into the tags table
                response = supabase_client.table('tags').insert({'tag_name': tag_value, 'label': tag_label}).execute()
                if  response.data:
                    tag_id = response.data[0]['tag_id']
                else:
                    print(f"Error inserting tag {tag_label}: {response} - {response.data}")
                    continue  # Skip this tag on error

            # Insert the user-tag relationship into the user_tags table
            user_tag_response = supabase_client.table('user_tags').insert({'user_id': user_id, 'tag_id': tag_id}).execute()
            if user_tag_response.data:
                print(f"Error adding tag for user: {user_tag_response} - {user_tag_response.data}")

            tag_ids.append(tag_id)

    return tag_ids  # Optionally return the IDs of the tags added or associated
