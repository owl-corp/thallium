import asyncio

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.dto import UserPermission
from src.orm import User, Voucher
from src.settings import Connections


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
        {"permissions": UserPermission.VIEW_PRODUCTS | UserPermission.VIEW_VOUCHERS},
        {"permissions": UserPermission.MANAGE_USERS},
        {"permissions": UserPermission.ISSUE_VOUCHERS | UserPermission.REVOKE_VOUCHERS},
        {"permissions": UserPermission.UPDATE_TEMPLATES},
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
