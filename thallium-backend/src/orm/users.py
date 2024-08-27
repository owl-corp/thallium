from datetime import datetime

from sqlalchemy import CheckConstraint, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column

from .base import AuditBase, Base, UUIDBase


class User(UUIDBase, AuditBase, Base):
    """An authenticated user of the service."""

    __tablename__ = "users"

    username: Mapped[str] = mapped_column(unique=True)
    password_hash: Mapped[str]
    permissions: Mapped[int]
    password_set_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))
    require_password_change: Mapped[bool] = mapped_column(default=True)
    password_reset_code: Mapped[str] = mapped_column(nullable=True)
    active: Mapped[bool] = mapped_column(default=True)

    __table_args__ = (
        CheckConstraint("require_password_change = (password_reset_code is not null)", name="pass_req_change_has_code"),
    )
