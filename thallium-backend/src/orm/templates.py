from datetime import datetime
from decimal import Decimal

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import AuditBase, Base

template_variant_association = Table(
    "template_variant",
    Base.metadata,
    Column("template_id", Integer, ForeignKey("templates.template_id", ondelete="CASCADE")),
    Column("variant_id", Integer, ForeignKey("variants.variant_id", ondelete="CASCADE")),
)


class Template(AuditBase, Base):
    """An authenticated user of the service."""

    __tablename__ = "templates"

    template_id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    product_id: Mapped[int]
    mockup_file_url: Mapped[str]
    last_synced: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    variants: Mapped[list["Variant"]] = relationship(
        "Variant",
        secondary=template_variant_association,
        back_populates="templates",
        lazy=True,
    )

    def loggify(self) -> str:
        """Human readable repr for logging."""
        return f"{self.__class__.__name__} {self.title} ({self.template_id})"


class Variant(AuditBase, Base):
    """An authenticated user of the service."""

    __tablename__ = "variants"

    variant_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    size: Mapped[str]
    colour: Mapped[str] = mapped_column(nullable=True)
    colour_code: Mapped[str] = mapped_column(nullable=True)
    colour_code2: Mapped[str] = mapped_column(nullable=True)
    price: Mapped[Decimal]
    last_synced: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    templates: Mapped[list["Template"]] = relationship(
        "Template",
        secondary=template_variant_association,
        back_populates="variants",
        lazy=True,
    )

    def loggify(self) -> str:
        """Human readable repr for logging."""
        return f"{self.__class__.__name__} {self.name} ({self.variant_id})"
