from pydantic import BaseModel


class CalculateResult(BaseModel):
    kg_loss: float
    procent_loss: float
    longitude: float
    latitude: float
    fullnes: float
