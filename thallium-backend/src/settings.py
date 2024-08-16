import typing
from collections.abc import AsyncGenerator
from logging import getLogger

import pydantic
import pydantic_settings
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

log = getLogger(__name__)


class _Config(
    pydantic_settings.BaseSettings,
    env_prefix="backend_",
    env_file=".env",
    env_file_encoding="utf-8",
    env_nested_delimiter="__",
    extra="ignore",
):
    """General configuration settings for the service."""

    debug: bool = False
    git_sha: str = "development"

    database_url: pydantic.SecretStr
    token: pydantic.SecretStr


CONFIG = _Config()


class Connections:
    """How to connect to other, internal services."""

    DB_ENGINE = create_async_engine(CONFIG.database_url.get_secret_value(), echo=CONFIG.debug)
    DB_SESSION_MAKER = async_sessionmaker(DB_ENGINE)


async def _get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield a database session, for use with a FastAPI dependency."""
    async with Connections.DB_SESSION_MAKER() as session, session.begin():
        yield session


DBSession = typing.Annotated[AsyncSession, Depends(_get_db_session)]
