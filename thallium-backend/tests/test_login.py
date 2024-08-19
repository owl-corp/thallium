from http import HTTPStatus

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.orm import Voucher


@pytest.mark.asyncio()
async def test_successful_voucher_login(http_client: AsyncClient, db_session: AsyncSession) -> None:
    """Test that a valid voucher can login to the system and receive a JWT."""
    db_session.add(Voucher(voucher_code="k1p", balance="13.37"))
    await db_session.flush()

    resp = await http_client.post("/voucher-login", json={"voucher_code": "k1p"})
    resp_data: dict[str, str] = resp.json()
    assert resp.status_code == HTTPStatus.OK
    assert {"voucher_code", "jwt"} <= resp_data.keys()
