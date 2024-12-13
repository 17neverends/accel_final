from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class HarvesterSettings(BaseModel):
    access_point: float


class HarvesterBase(BaseModel):
    name: str
    type: str
    description: Optional[str]
    photo_url: Optional[str]


class HarvesterCreate(HarvesterBase, HarvesterSettings):
    class Config:
        from_attributes = True


class HarvesterUpdate(BaseModel):
    access_point: Optional[float]
    name: Optional[str]
    type: Optional[str]
    description: Optional[str]
    photo_url: Optional[str]


class HarvesterInDB(HarvesterCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
