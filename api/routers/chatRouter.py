from fastapi import APIRouter, HTTPException, Depends, Form, File, UploadFile
from ..client.supabase import supabase_client
from ..core.security import verify_bearer_token
from ..models.user_social import MessageModel
from ..helpers.userHelper import get_user_data,ask_from_cloudflare


router = APIRouter(prefix="/api", tags=["chat"])

@router.post('/ask')
async def ask_chatbot(msg_input: MessageModel,user_info: dict = Depends(verify_bearer_token)):
    try:
        
        user_id = user_info.get('sub')
        user_data = await get_user_data(user_id)
        print(f"Raw input: {msg_input}")  
        response = await ask_from_cloudflare(user_data,msg_input.message)
        return {"message": response}
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug any errors
        raise HTTPException(status_code=500, detail=str(e))