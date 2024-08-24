import logging

from fastapi import APIRouter, Depends, Request

from src.auth import TokenAuth
from src.dto import Voucher

router = APIRouter(prefix="/vouchers", tags=["Voucher users"])
authenticated_router = APIRouter(dependencies=[Depends(TokenAuth(allow_vouchers=True))])
unauthenticated_router = APIRouter()

log = logging.getLogger(__name__)


@authenticated_router.get("/me")
async def get_current_voucher(request: Request) -> Voucher:
    """Get the voucher for the currently authenticated voucher id."""
    return request.state.voucher


router.include_router(authenticated_router)
router.include_router(unauthenticated_router)
