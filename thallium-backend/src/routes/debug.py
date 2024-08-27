import logging
from datetime import UTC, datetime

import argon2
from fastapi import APIRouter, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from src.auth import build_jwt
from src.dto import UserPermission, Voucher
from src.orm import User as DBUser, Voucher as DBVoucher
from src.settings import DBSession, PrintfulClient

router = APIRouter(tags=["debug"], prefix="/debug")
log = logging.getLogger(__name__)
ph = argon2.PasswordHasher()


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


@router.get("/user-jwt/{user_id}")
async def get_user_jwt(user_id: str) -> str:
    """Return the user_id's JWT."""
    return build_jwt(user_id, "user")


@router.post("/user")
async def create_user(  # noqa: PLR0913
    db: DBSession,
    username: str,
    password: str,
    *,
    require_password_change: bool = True,
    password_reset_code: str | None = None,
    active: bool = True,
    permissions: int = ~UserPermission(0),
) -> dict:
    """Create a user with the given username & pass."""
    db_user = DBUser(
        username=username,
        password_hash=ph.hash(password),
        permissions=permissions,
        require_password_change=require_password_change,
        password_reset_code=password_reset_code,
        active=active,
        password_set_at=datetime.now(UTC),
    )
    db.add(db_user)

    try:
        await db.flush()
    except IntegrityError as e:
        raise HTTPException(400, detail=str(e)) from e

    stmt = select(DBUser).where(DBUser.username == username)
    db_user = await db.scalar(stmt)
    return {key: val for key, val in db_user.__dict__.items() if not key.startswith("_")}
