from .userRouter import router as userinforouter
from .chatRouter import router as chatrouter
from .cloudflareRouter import router as cloudflarerouter
from fastapi import APIRouter

router = APIRouter()
router.include_router(userinforouter)
router.include_router(chatrouter)
router.include_router(cloudflarerouter)
