import logging

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from src.auth import HasPermission, TokenAuth, UserPermission
from src.dto import Template, TemplateWithVariant
from src.orm import Template as DBTemplate
from src.settings import DBSession

router = APIRouter(
    tags=["Templates"],
    prefix="/templates",
    dependencies=[Depends(TokenAuth(allow_regular_users=True, allow_vouchers=True))],
)
log = logging.getLogger(__name__)


@router.get("/", dependencies=[Depends(HasPermission(UserPermission.VIEW_TEMPLATES, allow_vouchers=True))])
async def get_templates(db: DBSession, *, with_variants: bool = False) -> list[Template] | list[TemplateWithVariant]:
    """Return all templates in printful."""
    stmt = select(DBTemplate)
    if with_variants:
        stmt = stmt.options(joinedload(DBTemplate.variants))
    res = await db.scalars(stmt)

    if with_variants:
        return res.unique().all()

    return res.all()
