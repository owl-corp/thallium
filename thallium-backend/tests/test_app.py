import pytest
from httpx import AsyncClient


@pytest.mark.asyncio()
async def test_heartbeat(http_client: AsyncClient) -> None:
    """Ensure the heartbeat works."""
    resp = await http_client.get("/heartbeat")
    assert resp.json() == {"detail": "I am alive!"}
