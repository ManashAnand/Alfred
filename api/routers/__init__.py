from .userRouter import router as userinforouter
from .chatRouter import router as chatrouter
from fastapi import APIRouter

router = APIRouter()
router.include_router(userinforouter)
router.include_router(chatrouter)
