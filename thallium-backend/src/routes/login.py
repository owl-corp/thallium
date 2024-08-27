import logging

import argon2
from fastapi import APIRouter, HTTPException
from sqlalchemy import and_, select

from src.auth import build_jwt
from src.dto import PasswordReset, UserClaim, UserLogin, VoucherClaim, VoucherLogin
from src.orm import User as DBUser, Voucher as DBVoucher
from src.settings import DBSession

router = APIRouter(tags=["Login"])
log = logging.getLogger(__name__)
ph = argon2.PasswordHasher()


class UserNotFoundError(Exception):
    """Raised when the user could not be found when fetching."""


async def fetch_user(db: DBSession, *, username: str | None = None, pw_reset_code: str | None = None) -> DBUser:
    """Fetch an active user from the DB by username, raises UserNotFoundError if not found."""
    if not username and not pw_reset_code:
        raise ValueError

    stmt = select(DBUser).where(DBUser.active)
    if username:
        stmt = stmt.where(DBUser.username == username)
    if pw_reset_code:
        stmt = stmt.where(DBUser.password_reset_code == pw_reset_code)

    db_user = await db.scalar(stmt)
    if not db_user:
        raise UserNotFoundError
    return db_user


async def verify_pass(db: DBSession, login_payload: UserLogin) -> DBUser:
    """
    Verify the password is correct for the given user.

    Raises argon2.exceptions.VerificationError if could not verify.
    """
    db_user = await fetch_user(db, username=login_payload.username)
    ph.verify(db_user.password_hash, login_payload.password)

    if ph.check_needs_rehash(db_user.password_hash):
        db_user.password_hash = ph.hash(login_payload.password)
        await db.flush()
    return db_user


@router.post(
    "/reset-password",
    status_code=204,
)
async def reset_user_password(db: DBSession, reset_payload: PasswordReset) -> None:
    """Set the user's password to the supplied password."""
    generic_failure_error = HTTPException(401, "Invalid password reset code given.")

    try:
        db_user = await fetch_user(db, pw_reset_code=reset_payload.password_reset_code)
    except UserNotFoundError as e:
        raise generic_failure_error from e

    if db_user.password_reset_code != reset_payload.password_reset_code:
        raise generic_failure_error

    db_user.password_hash = ph.hash(reset_payload.new_password)
    db_user.password_set_at = datetime.now(UTC)
    db_user.require_password_change = False
    db_user.password_reset_code = None


@router.post("/user-login")
async def handle_user_login(login_payload: UserLogin, db: DBSession) -> UserClaim:
    """Return a signed JWT if given a valid username & password combo."""
    try:
        db_user = await verify_pass(db, login_payload)
    except (UserNotFoundError, argon2.exceptions.VerificationError) as e:
        raise HTTPException(401, "Invalid username or password given.") from e

    jwt = build_jwt(db_user.id, "user")
    return UserClaim(
        username=login_payload.username,
        permissions=db_user.permissions,
        require_password_change=db_user.require_password_change,
        jwt=jwt,
    )


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
        jwt=build_jwt(voucher.id, "voucher"),
    )
