import logging
from datetime import UTC, datetime
from itertools import chain

from fastapi import APIRouter, Depends
from sqlalchemy import Column, delete
from sqlalchemy.dialects.postgresql import insert

from src.auth import HasPermission, TokenAuth
from src.dto import UserPermission
from src.orm import Template, Variant
from src.orm.templates import template_variant_association
from src.settings import DBSession, PrintfulClient

router = APIRouter(prefix="/admin", tags=["Admin routes"], dependencies=[Depends(TokenAuth(allow_regular_users=True))])


log = logging.getLogger(__name__)


async def delete_orphans(table: Template | Variant, ids_to_keep: list[int], db: DBSession) -> None:
    """Delete all rows from the appropriate db table not present in the ids_to_keep."""
    pk: Column = table.__table__.primary_key.columns[0]

    stmt = delete(table).where(pk.not_in(ids_to_keep)).returning(table)
    res: list[tuple[Template | Variant]] = await db.execute(stmt)
    for row in res:
        log.info("Deleted %s", row[0].loggify())


async def sync_variants(variant_ids: list[int], db: DBSession, client: PrintfulClient) -> None:
    """Sync all variants from printful into the db."""
    variants: list[dict] = []
    for variant_id in variant_ids:
        resp = await client.get(f"/products/variant/{variant_id}")
        resp.raise_for_status()
        variant = resp.json()["result"]["variant"]

        variants.append(
            {
                "variant_id": variant["id"],
                "name": variant["name"],
                "size": variant["size"],
                "colour": variant["color"],
                "colour_code": variant["color_code"],
                "price": variant["price"],
                "last_synced": datetime.now(tz=UTC),
            }
        )
    stmt = insert(Variant).values(variants)
    stmt = stmt.on_conflict_do_update(
        "variants_pk",
        set_={
            "name": stmt.excluded.name,
            "size": stmt.excluded.size,
            "colour": stmt.excluded.colour,
            "colour_code": stmt.excluded.colour_code,
            "price": stmt.excluded.price,
            "last_synced": stmt.excluded.last_synced,
        },
    )
    await db.execute(stmt)


async def sync_templates(printful_templates: list[dict], db: DBSession) -> None:
    """Sync all templates from printful into the db."""
    templates: list[dict] = [
        {
            "template_id": template["id"],
            "title": template["title"],
            "product_id": template["product_id"],
            "mockup_file_url": template["mockup_file_url"],
            "last_synced": datetime.now(tz=UTC),
        }
        for template in printful_templates
    ]
    stmt = insert(Template).values(templates)
    stmt = stmt.on_conflict_do_update(
        "templates_pk",
        set_={
            "title": stmt.excluded.title,
            "product_id": stmt.excluded.product_id,
            "mockup_file_url": stmt.excluded.mockup_file_url,
            "last_synced": stmt.excluded.last_synced,
        },
    )
    await db.execute(stmt)

    for template in printful_templates:
        associations = [
            {"template_id": template["id"], "variant_id": variant_id}
            for variant_id in template["available_variant_ids"]
        ]
        stmt = insert(template_variant_association).values(associations).on_conflict_do_nothing()
        await db.execute(stmt)


@router.get("/fetch-printful-templates", dependencies=[Depends(HasPermission(UserPermission.UPDATE_TEMPLATES))])
async def update_templates_from_printful(db: DBSession, client: PrintfulClient) -> list[dict]:
    """Update the db with the latest templates & variants from printful."""
    resp = await client.get("/product-templates")
    resp.raise_for_status()
    templates = resp.json()["result"]["items"]
    printful_template_ids = {template["id"] for template in templates}
    await delete_orphans(Template, printful_template_ids, db)

    variant_ids = set(chain(*(template["available_variant_ids"] for template in templates)))

    await delete_orphans(Variant, variant_ids, db)
    await sync_variants(variant_ids, db, client)
    await sync_templates(templates, db)

    return templates
