from fastapi import APIRouter, HTTPException, Depends, Form, File, UploadFile
from ..client.supabase import supabase_client
from ..core.security import verify_bearer_token
from ..models.user_social import MessageModel
from ..helpers.userHelper import get_user_data,ask_from_cloudflare
from fastapi import Query


router = APIRouter(prefix="/api", tags=["chat"])

@router.post('/ask')
async def ask_chatbot(msg_input: MessageModel,user_id_of_dev: str = Query(..., description="User ID of the developer to query about")
    ,user_info: dict = Depends(verify_bearer_token)):
    try:
        """get a params /ask?user_id=xyz
            xyz jiske bare mein janna hai 
            here user_id = user_info.get(sub) jisko janna hai
            cloudflare  credentials user_id_sender ka use karenge 
            per get_user_data xyz ka 
            
        """
        user_id_of_asker = user_info.get('sub')
        user_data = await get_user_data(user_id_of_dev)
        print(f"Raw input: {msg_input}")  
        response = await ask_from_cloudflare(user_id_of_asker,user_data,msg_input.message)
        return {"message": response}
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug any errors
        raise HTTPException(status_code=500, detail=str(e))