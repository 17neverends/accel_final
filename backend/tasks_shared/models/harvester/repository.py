from sqlalchemy import update, delete
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from typing import List, Optional

from tasks_shared.models.harvester.model import Harvester
from tasks_shared.models.harvester.schemas import (
    HarvesterUpdate,
    HarvesterCreate,
    HarvesterInDB
)


class HarvesterRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, model_create: HarvesterCreate) -> HarvesterInDB:
        new_record = Harvester(**model_create)
        self.session.add(new_record)

        await self.session.commit()
        await self.session.refresh(new_record)

        return HarvesterInDB.model_validate(new_record).model_dump()

    async def get_all(self) -> List[HarvesterInDB]:
        result = await self.session.execute(
            select(Harvester)
        )
        records = result.scalars().all()

        return [HarvesterInDB.model_validate(record).model_dump() for record in records]

    async def get_by_id(self, id: int) -> Optional[HarvesterInDB]:
        result = await self.session.execute(select(Harvester).filter_by(id=id))
        record = result.scalars().one_or_none()
        if record:
            return HarvesterInDB.model_validate(record).model_dump()

        return None

    async def update(self,
                     id: int,
                     model_update: HarvesterUpdate) -> Optional[HarvesterInDB]:
        await self.session.execute(
            update(Harvester).where(Harvester.id == id)
            .values(**model_update)
        )

        await self.session.commit()
        return await self.get_by_id(id=id)

    async def delete(self, id: int) -> bool:
        try:
            await self.session.execute(delete(Harvester).where(Harvester.id == id))
            await self.session.commit()
            return True
        except Exception:
            return False

    async def get_harvester_by_name(self, name: str) -> Optional[HarvesterInDB]:
        result = await self.session.execute(
            select(Harvester).filter_by(name=name)
        )
        record = result.scalars().one_or_none()
        if record:
            return HarvesterInDB.model_validate(record).model_dump()

        return None
    
    async def get_harvester_list(self) -> List[HarvesterCreate]:
        result = await self.session.execute(
            select(Harvester)
        )
        records = result.scalars().all()

        return [HarvesterCreate.model_validate(record).model_dump() for record in records]
