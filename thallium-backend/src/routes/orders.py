import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select

from src.auth import TokenAuth
from src.dto import Order, OrderCosts, OrderCreate, Voucher
from src.orm import Voucher as DBVoucher
from src.settings import DBSession, PrintfulClient

router = APIRouter(prefix="/orders", tags=["Orders"], dependencies=[Depends(TokenAuth(allow_vouchers=True))])

log = logging.getLogger(__name__)


@router.post("/")
async def create_order(request: Request, db: DBSession, client: PrintfulClient, order: OrderCreate) -> Order | None:
    """
    Create the order in printful and deduct the order cost from the voucher.

    If the voucher does not have enough funds, the order is cancelled.
    """
    voucher: Voucher = request.state.voucher
    stmt = select(DBVoucher).where(DBVoucher.id == voucher.id).with_for_update()
    db_voucher = await db.scalar(stmt)

    resp = await client.post(
        "/orders/estimate-costs",
        json=order.as_printful_payload(voucher),
        params={"confirm": False},
    )
    resp.raise_for_status()
    cost = OrderCosts.model_validate(resp.json()["result"]["costs"])
    if cost.total > db_voucher.balance:
        raise HTTPException(
            status_code=400,
            detail=f"Order totals {cost.total}, only {db_voucher.balance} remaining on voucher.",
        )

    resp = await client.post("/orders", json=order.as_printful_payload(voucher), params={"confirm": False})
    resp.raise_for_status()
    submitted_order = Order.model_validate(resp.json()["result"])

    db_voucher.balance = db_voucher.balance - submitted_order.costs.total
    return submitted_order
