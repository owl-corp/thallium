import logging

from fastapi import APIRouter
from sqlalchemy import select

from src.dto import Voucher
from src.orm import Voucher as DBVoucher
from src.settings import DBSession, PrintfulClient

router = APIRouter(tags=["debug"], prefix="/debug")
log = logging.getLogger(__name__)


@router.get("/templates")
async def get_templates(client: PrintfulClient) -> dict:
    """Return all templates in printful."""
    resp = await client.get("/product-templates")
    return resp.json()


@router.get("/variants/{variant_id}")
async def get_variant(client: PrintfulClient, variant_id: int) -> dict:
    """Return all templates in printful."""
    resp = await client.get(f"/products/variant/{variant_id}")
    return resp.json()


@router.get("/oauth-scopes-v1")
async def get_oauth_scopes(client: PrintfulClient) -> dict:
    """Return all templates in printful."""
    resp = await client.get("/oauth/scopes")
    return resp.json()


@router.get("/oauth-scopes-v2")
async def get_v2_oauth_scopes(client: PrintfulClient) -> dict:
    """Return all templates in printful."""
    resp = await client.get("/v2/oauth-scopes")
    return resp.json()


@router.get("/vouchers")
async def get_vouchers(db: DBSession, *, only_active: bool = True) -> list[Voucher]:
    """Return all templates in printful."""
    stmt = select(DBVoucher)
    if only_active:
        stmt = stmt.where(DBVoucher.active)
    res = await db.execute(stmt)
    return res.scalars().all()
