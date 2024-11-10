from fastapi import APIRouter, HTTPException, Depends,Request
from ..core.security import verify_bearer_token
from ..models.user_social import MessageModel,FeedInput
from ..helpers.userHelper import get_user_data,ask_from_cloudflare
from fastapi import Query
from ..client.supabase import supabase_client

router = APIRouter(prefix="/api", tags=["chat"])

@router.post('/ask')
async def ask_chatbot(
    request: Request,msg_input: MessageModel,user_id_of_dev: str = Query(..., description="User ID of the developer to query about")
    ,user_info: dict = Depends(verify_bearer_token)):
    
    limiter = request.app.state.limiter
    @limiter.limit("5/minute")
    
    async def rate_limited_ask(request):
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
    return await rate_limited_ask(request)


# add_user_feed

@router.post('/add_user_feed')
async def ask_chatbot(
    feed_data: FeedInput,user_id_of_dev: str = Query(..., description="User ID of the developer to query about")
    ,user_info: dict = Depends(verify_bearer_token)):
    try:
        # response = supabase_client.table("")
        print(user_info['sub'])
        print(user_id_of_dev)
        if str(user_id_of_dev).strip() == str(user_info['sub']).strip():
           
        
            response = supabase_client.table("userinfo").select("currentfeed").eq("user_id", user_id_of_dev).execute()
            current_data = response.data[0] if response.data else {"currentfeed": ""}
            
            new_feed = current_data["currentfeed"] + "\n" + feed_data.currentFeed if current_data["currentfeed"] else feed_data.currentFeed
            
            res = supabase_client.table("userinfo").update({"currentfeed": new_feed}).eq("user_id", user_id_of_dev).execute()

            if res.data:
                return {
                "status": "success",
                "owner":True,
                "message": "Feed added successfully",
                "user_id": user_id_of_dev,
                }
                
        return {
            "status": "success",
            "owner":False,
            "message": "Feed added successfully",
            "user_id": user_id_of_dev,
              }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add feed: {str(e)}"
        )