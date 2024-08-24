from sqlalchemy.orm import Mapped

from .base import AuditBase, Base, UUIDBase


class User(UUIDBase, AuditBase, Base):
    """An authenticated user of the service."""

    __tablename__ = "users"

    permissions: Mapped[int]
