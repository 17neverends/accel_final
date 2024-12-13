from pydantic import BaseModel


class HarvesterGet(BaseModel):
    name: str
