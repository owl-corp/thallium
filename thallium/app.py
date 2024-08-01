from litestar import Litestar, get


@get("/heartbeat", sync_to_thread=False)
def heartbeat() -> dict:
    """Return a simple heartbeat."""
    return {"detail": "I am alive!"}


app = Litestar([heartbeat])
