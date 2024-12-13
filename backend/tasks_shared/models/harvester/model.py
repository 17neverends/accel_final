from tasks_shared.database import Base
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from utils.mixins.timestamps_mixin import TimestampMixin


class Harvester(Base, TimestampMixin):
    __tablename__ = "harvesters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    type: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    access_point: Mapped[float] = mapped_column(nullable=False)
    photo_url: Mapped[str | None] = mapped_column(nullable=False)

    class Config:
        orm_mode = True
        from_attributes = True
