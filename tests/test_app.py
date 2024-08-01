from litestar.testing import TestClient

from thallium.app import app


def test_heartbeat() -> None:
    with TestClient(app=app) as client:
        assert client.get("/heartbeat").json() == {"detail": "I am alive!"}
