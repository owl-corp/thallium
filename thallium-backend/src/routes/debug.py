import logging

from fastapi import APIRouter

from src.settings import PrintfulClient

router = APIRouter(tags=["debug"])
log = logging.getLogger(__name__)


@router.get("/templates")
async def get_templates(client: PrintfulClient) -> dict:
    """Return all templates in printful."""
    resp = await client.get("/product-templates")
    return resp.json()


@router.get("/oauth-scopes-v1")
async def get_oauth_scopes(client: PrintfulClient) -> dict:
    """Return all templates in printful."""
    resp = await client.get("/oauth/scopes")
    return resp.json()


@router.get("/oauth-scopes-v2")
async def get_v2_oauth_scopes(client: PrintfulClient) -> dict:
    """Return all templates in printful."""
    resp = await client.get("/v2/oauth-scopes")
    return resp.json()
