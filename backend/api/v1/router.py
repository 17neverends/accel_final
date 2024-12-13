from fastapi import APIRouter
from api.v1.routes import (
    harvester,
    monitoring
)

router = APIRouter(
    prefix="/api/v1",
    responses={404: {"description": "Не найдено"}},
)

router.include_router(harvester.router)
router.include_router(monitoring.router)
