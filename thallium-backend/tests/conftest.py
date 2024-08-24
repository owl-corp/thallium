from collections.abc import AsyncGenerator, Callable

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine

from src.app import fastapi_app
from src.orm import Base
from src.settings import CONFIG, Connections, _get_db_session


@pytest.fixture(scope="session")
async def test_database_engine() -> AsyncEngine:
    """Yield back a Database engine object."""
    test_db_url = CONFIG.database_url.get_secret_value() + "_test"
    test_db_engine = create_async_engine(test_db_url, isolation_level="REPEATABLE READ", echo=False)

    # Use the engine from the main app to create the test DB
    main_engine = Connections.DB_ENGINE.execution_options(isolation_level="AUTOCOMMIT", echo=False)
    async with main_engine.connect() as conn:
        await conn.execute(text(f"DROP DATABASE IF EXISTS {test_db_engine.url.database}"))
        await conn.execute(text(f"CREATE DATABASE {test_db_engine.url.database}"))

    return test_db_engine


@pytest.fixture()
async def db_session(test_database_engine: AsyncEngine) -> AsyncGenerator[AsyncSession]:
    """Yield an Asynchronous database session."""
    async with test_database_engine.begin() as conn:
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
