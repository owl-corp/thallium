import logging

from fastapi import APIRouter, HTTPException
from sqlalchemy import and_, select

from src.auth import build_jwt
from src.dto import VoucherClaim, VoucherLogin
from src.orm import Voucher as DBVoucher
from src.settings import DBSession

router = APIRouter(tags=["Login"])
log = logging.getLogger(__name__)


@router.post("/voucher-login")
async def handle_voucher_login(login_payload: VoucherLogin, db: DBSession) -> VoucherClaim:
    """Return a signed JWT if the given voucher is present in the database."""
    stmt = select(DBVoucher).where(
        and_(
            DBVoucher.voucher_code == login_payload.voucher_code,
            DBVoucher.active,
        )
    )
    voucher = await db.scalar(stmt)
    if not voucher:
        raise HTTPException(422, "Voucher not found")

    return VoucherClaim(
        voucher_code=login_payload.voucher_code,
        jwt=build_jwt(str(voucher.id), "voucher"),
    )
