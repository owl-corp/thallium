import logging
import os
import time
from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from scalar_fastapi import get_scalar_api_reference

from src.routes import top_level_router
from src.settings import CONFIG

log = logging.getLogger(__name__)

fastapi_app = FastAPI(
    debug=CONFIG.debug,
    root_path=CONFIG.app_prefix,
    title="Thallium",
    version=os.getenv("THALLIUM_VERSION", "0.0.0"),
    docs_url=None,
    redoc_url=None,
)
fastapi_app.include_router(top_level_router)
fastapi_app.mount("/static", StaticFiles(directory="src/static"), name="static")


@fastapi_app.get("/heartbeat")
def health_check() -> JSONResponse:
    """Return basic response, for use as a health check."""
    return JSONResponse({"detail": "I am alive!"})


def build_url(request: Request, path: str = "") -> str:
    """Build a URL from a request, for OpenAPI + Scalar."""
    return f"{request.url.scheme}://{request.headers['Host']}{CONFIG.app_prefix}{path}"


@fastapi_app.get("/docs", include_in_schema=False)
async def scalar_html(request: Request) -> HTMLResponse:
    """Scalar documentation URL."""
    return get_scalar_api_reference(
        openapi_url=CONFIG.app_prefix + fastapi_app.openapi_url,
        title=fastapi_app.title,
        scalar_favicon_url=build_url(request, "/static/favicons/favicon.ico"),
        servers=[{"url": build_url(request), "description": "Thallium"}],
    )


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
        "default-src 'self';"
        " script-src 'unsafe-inline' https://cdn.jsdelivr.net/npm/@scalar/api-reference;"
        " style-src 'unsafe-inline';"
        " font-src https://fonts.scalar.com;"
        " img-src 'self';"
    )
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = (
        "camera=(), display-capture=(), fullscreen=(), geolocation=(), microphone=(), screen-wake-lock=(), web-share=()"
    )
    return response
