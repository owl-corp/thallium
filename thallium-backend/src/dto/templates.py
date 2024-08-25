from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class Template(BaseModel):
    """Base model for a template."""

    template_id: int
    title: str
    product_id: int
    mockup_file_url: str
    last_synced: datetime


class Variant(BaseModel):
    """Base model for a template."""

    variant_id: int
    name: str
    size: str
    colour: str | None
    colour_code: str | None
    colour_code2: str | None
    price: Decimal
    last_synced: datetime


class TemplateWithVariant(Template):
    """A voucher as stored in the database."""

    variants: list[Variant]
