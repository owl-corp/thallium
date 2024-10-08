from fastapi import APIRouter

from src.routes.admin import router as admin_router
from src.routes.debug import router as debug_router
from src.routes.login import router as login_router
from src.routes.orders import router as order_router
from src.routes.templates import router as template_router
from src.routes.vouchers import router as voucher_router
from src.settings import CONFIG

top_level_router = APIRouter()
top_level_router.include_router(admin_router)
top_level_router.include_router(login_router)
top_level_router.include_router(order_router)
top_level_router.include_router(template_router)
top_level_router.include_router(voucher_router)
if CONFIG.debug:
    top_level_router.include_router(debug_router)
