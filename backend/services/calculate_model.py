from utils.models.config import Config
from utils.models.calculate_result import CalculateResult
from typing import Optional


class CalculateModel:
    def __init__(self, worker: str):
        self.worker = worker

    async def set_config(self, config: Config) -> None:
        self.volume = config.volume
        self.humidity = config.humidity * 0.01
        self.access_point = config.access_point * self.humidity
        self.apperent_density = config.bulk_density * self.humidity
    
    async def set_max_fullness(self) -> None:
        self.max_fullness = self.volume * self.apperent_density
    
    async def get_max_fullness(self) -> Optional[float]:
        return self.max_fullness if self.max_fullness else self.volume * self.apperent_density
        
    async def calculate(self, volume_t1: int, volume_t2: int) -> CalculateResult:
        difference: float = (volume_t2 - volume_t1) * 0.01
        increase = self.max_fullness * difference
        kg_loss = self.access_point - increase
        procent_loss = (kg_loss / self.access_point) * 100
        return CalculateResult(kg_loss=kg_loss, procent_loss=procent_loss)
