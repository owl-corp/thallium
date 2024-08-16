from fastapi.testclient import TestClient

from src.app import fastapi_app


def test_heartbeat() -> None:
    """Ensure the heartbeat works."""
    with TestClient(app=fastapi_app) as client:
        assert client.get("/heartbeat").json() == {"detail": "I am alive!"}
