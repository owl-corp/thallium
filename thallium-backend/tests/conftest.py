from collections.abc import AsyncGenerator, Callable

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.app import fastapi_app
from src.orm import Base
from src.settings import CONFIG, Connections, _get_db_session

db_url = CONFIG.database_url.get_secret_value()
test_db_url = db_url + "_test"
DB_ENGINE = create_async_engine(test_db_url, isolation_level="REPEATABLE READ", echo=False)
DB_SESSION_MAKER = async_sessionmaker(DB_ENGINE)


@pytest.fixture(scope="session")
async def _create_test_database_engine() -> AsyncGenerator:
    """Yield back a Database engine object."""
    create_engine = Connections.DB_ENGINE.execution_options(isolation_level="AUTOCOMMIT", echo=False)
    async with create_engine.connect() as conn:
        await conn.execute(text(f"DROP DATABASE IF EXISTS {DB_ENGINE.url.database}"))
        await conn.execute(text(f"CREATE DATABASE {DB_ENGINE.url.database}"))


@pytest.fixture()
async def db_session(_create_test_database_engine: None) -> AsyncGenerator[AsyncSession]:
    """Yield an Asynchronous database session."""
    async with DB_ENGINE.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        async with AsyncSession(bind=conn, expire_on_commit=False) as session:
            yield session
            await session.close()


@pytest.fixture()
def override_db_session(db_session: AsyncSession) -> AsyncSession:
    """Yield the modified Database session that uses the correspondent Database."""

    async def _override_db_session() -> AsyncGenerator[AsyncSession]:
        yield db_session

    return _override_db_session


@pytest.fixture()
def app(override_db_session: Callable) -> FastAPI:
    """Override the default FastAPI app to use the overridden DB session."""
    fastapi_app.dependency_overrides[_get_db_session] = override_db_session
    return fastapi_app


@pytest.fixture()
async def http_client(app: FastAPI) -> AsyncGenerator[AsyncClient]:
    """Yield a client for testing the app."""
    async with AsyncClient(app=app, base_url="http://testserver", follow_redirects=True) as ac:
        yield ac
