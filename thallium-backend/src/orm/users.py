from sqlalchemy.orm import Mapped, mapped_column

from .base import AuditBase, Base


class User(AuditBase, Base):
    """An authenticated user of the service."""

    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True)
    is_admin: Mapped[bool]
