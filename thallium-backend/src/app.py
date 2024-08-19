import logging
import time
from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from src.routes import top_level_router
from src.settings import CONFIG

log = logging.getLogger(__name__)

fastapi_app = FastAPI(debug=CONFIG.debug, root_path=CONFIG.app_prefix)
fastapi_app.include_router(top_level_router)


@fastapi_app.get("/heartbeat")
def health_check() -> JSONResponse:
    """Return basic response, for use as a health check."""
    return JSONResponse({"detail": "I am alive!"})


@fastapi_app.exception_handler(RequestValidationError)
def pydantic_validation_error(request: Request, error: RequestValidationError) -> JSONResponse:
    """Raise a warning for pydantic validation errors, before returning."""
    log.warning("Error from %s: %s", request.url, error)
    return JSONResponse({"error": str(error)}, status_code=422)


@fastapi_app.middleware("http")
async def add_process_time_and_security_headers(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    """Add process time and some security headers before sending the response."""
    start_time = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Process-Time"] = str(time.perf_counter() - start_time)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'unsafe-inline' https://cdn.jsdelivr.net/;"
        " style-src https://cdn.jsdelivr.net/ https://fonts.googleapis.com/;"
        " img-src 'self' data:;"
    )
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = (
        "camera=(), display-capture=(), fullscreen=(), geolocation=(), microphone=(), screen-wake-lock=(), web-share=()"
    )
    return response
