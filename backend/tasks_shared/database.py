from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase

from tasks_shared.database_utils import get_engine


class Base(AsyncAttrs, DeclarativeBase):
    pass


async def init_db() -> None:
    engine = await get_engine()

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await engine.dispose(False)
