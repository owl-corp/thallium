from fastapi import APIRouter

from src.routes.debug import router as debug_router
from src.settings import CONFIG

top_level_router = APIRouter()
if CONFIG.debug:
    top_level_router.include_router(debug_router)
