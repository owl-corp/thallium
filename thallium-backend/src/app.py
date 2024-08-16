import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from src.settings import CONFIG

log = logging.getLogger(__name__)


fastapi_app = FastAPI(debug=CONFIG.debug)


@fastapi_app.get("/heartbeat")
def health_check() -> JSONResponse:
    """Return basic response, for use as a health check."""
    return JSONResponse({"detail": "I am alive!"})


@fastapi_app.exception_handler(RequestValidationError)
def pydantic_validation_error(request: Request, error: RequestValidationError) -> JSONResponse:
    """Raise a warning for pydantic validation errors, before returning."""
    log.warning("Error from %s: %s", request.url, error)
    return JSONResponse({"error": str(error)}, status_code=422)