import asyncio

from src.orm import Voucher
from src.settings import Connections


async def main() -> None:
    """Seed the database with some test data."""
    async with Connections.DB_SESSION_MAKER() as session, session.begin():
        session.add_all(
            [
                Voucher(voucher_code="k1p", balance="13.37", active=False),
                Voucher(voucher_code="k1p", balance="13.37", active=False),
                Voucher(voucher_code="k1p", balance="13.37"),
            ]
        )


if __name__ == "__main__":
    asyncio.run(main())
