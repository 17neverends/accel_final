from contextlib import asynccontextmanager
import importlib
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from settings import settings


SQLALCHEMY_DATABASE_URL = settings.db_url


async def cook_models():
    for pkg in os.listdir("tasks_shared/models"):
        if not pkg.endswith(".py") and not pkg.endswith("__"):
            importlib.import_module(f".{pkg}.model",
                                    package="tasks_shared.models")


@asynccontextmanager
async def get_session():
    engine = await get_engine()
    async_session_factory = await get_session_factory(engine)

    async with async_session_factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
            await engine.dispose()


async def get_engine():
    engine = create_async_engine(
        SQLALCHEMY_DATABASE_URL,
        future=True
    )
    return engine


async def get_session_factory(engine):
    async_session_factory = sessionmaker(
        bind=engine,
        expire_on_commit=False,
        class_=AsyncSession
    )

    return async_session_factory
