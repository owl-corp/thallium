from fastapi import APIRouter

from src.routes.debug import router as debug_router
from src.routes.login import router as login_router
from src.routes.vouchers import router as voucher_router
from src.settings import CONFIG

top_level_router = APIRouter()
top_level_router.include_router(login_router)
top_level_router.include_router(voucher_router)
if CONFIG.debug:
    top_level_router.include_router(debug_router)
