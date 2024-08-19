import logging

from fastapi import APIRouter, Depends

from src.auth import TokenAuth
from src.settings import PrintfulClient

router = APIRouter(tags=["Printful"], prefix="/printful", dependencies=[Depends(TokenAuth(allow_regular_users=True))])
log = logging.getLogger(__name__)


@router.get("/templates")
async def get_templates(client: PrintfulClient) -> dict:
    """Return all templates in printful."""
    resp = await client.get("/product-templates")
    return resp.json()
