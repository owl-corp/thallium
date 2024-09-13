import asyncio
from datetime import UTC, datetime

import argon2
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.dto import UserPermission
from src.orm import User, Voucher
from src.settings import Connections

ph = argon2.PasswordHasher()


async def create_vouchers(session: AsyncSession) -> None:
    """Create some test vouchers in the db."""
    entries = [
        {"voucher_code": "k1p", "balance": "13.37", "active": False},
        {"voucher_code": "k1p", "balance": "13.37", "active": False},
        {"voucher_code": "k1p", "balance": "13.37"},
    ]
    stmt = insert(Voucher).values(entries).on_conflict_do_nothing()
    await session.execute(stmt)


async def create_users(session: AsyncSession) -> None:
    """Create some test vouchers in the db."""
    entries = [
        {
            "username": "cj",
            "password_hash": ph.hash("12345"),
            "permissions": UserPermission.VIEW_TEMPLATES | UserPermission.VIEW_VOUCHERS,
            "password_set_at": datetime.now(UTC),
            "require_password_change": False,
        },
        {
            "username": "joe",
            "password_hash": ph.hash("hunter2"),
            "permissions": UserPermission.MANAGE_USERS,
            "password_set_at": datetime.now(UTC),
            "require_password_change": False,
        },
        {
            "username": "bella",
            "password_hash": ph.hash("france_forever"),
            "permissions": UserPermission.ISSUE_VOUCHERS | UserPermission.REVOKE_VOUCHERS,
            "password_set_at": datetime.now(UTC),
            "require_password_change": False,
        },
        {
            "username": "jc",
            "password_hash": ph.hash("tor"),
            "permissions": UserPermission.UPDATE_TEMPLATES,
            "password_set_at": datetime.now(UTC),
            "require_password_change": False,
        },
    ]
    stmt = insert(User).values(entries).on_conflict_do_nothing()
    await session.execute(stmt)


async def main() -> None:
    """Seed the database with some test data."""
    async with Connections.DB_SESSION_MAKER() as session, session.begin():
        await create_vouchers(session)
        await create_users(session)


if __name__ == "__main__":
    asyncio.run(main())
