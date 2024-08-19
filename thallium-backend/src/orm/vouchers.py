from decimal import Decimal

from sqlalchemy import Index, text
from sqlalchemy.orm import Mapped, mapped_column

from .base import AuditBase, Base


class Voucher(AuditBase, Base):
    """A valid voucher in the database."""

    __tablename__ = "vouchers"

    voucher_code: Mapped[str] = mapped_column()
    active: Mapped[bool] = mapped_column(default=True)
    balance: Mapped[Decimal]

    __table_args__ = (
        Index(
            "ix_unique_active_voucher_code",
            voucher_code,
            unique=True,
            postgresql_where=text("active"),
        ),
    )
