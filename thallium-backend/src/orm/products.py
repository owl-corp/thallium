from decimal import Decimal

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import LargeBinary

from .base import AuditBase, Base


class Product(AuditBase, Base):
    """A product available to be ordered."""

    __tablename__ = "products"

    product_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str]
    price: Mapped[Decimal]
    image: Mapped[bytes] = mapped_column(LargeBinary, deferred=True)
