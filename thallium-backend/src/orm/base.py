"""The base classes for ORM models."""

import re
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.schema import MetaData
from sqlalchemy.sql import func, text
from sqlalchemy.types import DateTime

NAMING_CONVENTIONS = {
    "ix": "%(column_0_label)s_ix",
    "uq": "%(table_name)s_%(column_0_name)s_uq",
    "ck": "%(table_name)s_%(constraint_name)s_ck",
    "fk": "%(table_name)s_%(column_0_name)s_%(referred_table_name)s_fk",
    "pk": "%(table_name)s_pk",
}
table_name_regexp = re.compile("((?<=[a-z0-9])[A-Z]|(?!^)[A-Z](?=[a-z]))")


class Base(AsyncAttrs, DeclarativeBase):
    """Classes that inherit this class will be automatically mapped using declarative mapping."""

    metadata = MetaData(naming_convention=NAMING_CONVENTIONS)

    def patch_from_pydantic(self, pydantic_model: BaseModel) -> None:
        """Patch this model using the given pydantic model, unspecified attributes remain the same."""
        for key, value in pydantic_model.model_dump(exclude_unset=True).items():
            setattr(self, key, value)


class AuditBase:
    """Common columns for a table with UUID PK and datetime audit columns."""

    id: Mapped[UUID] = mapped_column(server_default=text("gen_random_uuid()"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
