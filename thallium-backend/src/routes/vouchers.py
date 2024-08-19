import logging

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select

from src.auth import TokenAuth
from src.dto import Voucher
from src.orm import Voucher as DBVoucher
from src.settings import DBSession

router = APIRouter(
    prefix="/vouchers",
    tags=["Voucher users"],
    dependencies=[Depends(TokenAuth(allow_vouchers=True))],
)
log = logging.getLogger(__name__)


@router.get("/me")
async def get_vouchers(request: Request, db: DBSession) -> Voucher | None:
    """Get the voucher for the currently authenticated voucher id."""
    stmt = select(DBVoucher).where(DBVoucher.id == request.state.voucher_id)
    res = await db.execute(stmt)
    return res.scalars().one_or_none()
