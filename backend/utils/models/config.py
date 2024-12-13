from pydantic import BaseModel


class Config(BaseModel):
    humidity: int = 100
    volume: float
    access_point: float
    bulk_density: float
