from fastapi import APIRouter
from tasks_shared.models.harvester.repository import HarvesterRepository
from tasks_shared.database_utils import get_session
from api.v1.models.harvester_get import HarvesterGet
from utils.fill_harvesters_in_db import fill_harvesters_in_db

router = APIRouter(
    prefix="/harvester",
    tags=["harvester",],
    responses={404: {"description": "Не найдено"}},
)


@router.get("/list")
async def get_harvester():
    async with get_session() as session:
        return await HarvesterRepository(session).get_harvester_list()


@router.post("/{name}")
async def get_harvester(data: HarvesterGet):
    async with get_session() as session:
        return await HarvesterRepository(session).get_harvester_by_name(name=data.name)


@router.post("/add")
async def fill_db():
    await fill_harvesters_in_db()