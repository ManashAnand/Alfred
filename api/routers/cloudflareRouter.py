from fastapi import APIRouter, HTTPException, Depends, Form, File
from ..client.supabase import supabase_client
from ..core.security import verify_bearer_token
from fastapi import Query
from ..models.user_social import CloudflareModel 



router = APIRouter(prefix='/api')


@router.post('/cloudflare')
async def add_cloudflare_data(cloudflare_input:CloudflareModel,user_id: str = Query(),user_info: dict = Depends(verify_bearer_token)):
   try:
        # Create the data dictionary correctly
        cloudflare_data = {
            "user_id": user_id,
            "CLOUDFLARE_ACCOUNT_ID": cloudflare_input.CLOUDFLARE_ACCOUNT_ID,
            "CLOUDFLARE_AUTH_TOKEN": cloudflare_input.CLOUDFLARE_AUTH_TOKEN
        }
        
        res = await supabase_client.table('cloudflare').upsert(
            cloudflare_data,
            on_conflict='user_id'  # specify the unique column for conflict resolution
        ).execute()
        
        return {"success": True, "data": res.data}
   except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))