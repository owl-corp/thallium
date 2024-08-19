from sqlalchemy.orm import Mapped

from .base import AuditBase, Base


class User(AuditBase, Base):
    """An authenticated user of the service."""

    __tablename__ = "users"

    permissions: Mapped[int]
