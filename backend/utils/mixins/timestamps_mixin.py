from datetime import datetime, timezone, timedelta
from sqlalchemy import Column, DateTime
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import declarative_mixin


def server_now() -> datetime:
    utc_plus_3 = timezone(timedelta(hours=3))
    return datetime.now(timezone.utc).astimezone(utc_plus_3)


@declarative_mixin
class TimestampMixin:
    @declared_attr
    def created_at(cls):
        return Column(DateTime(timezone=True), default=server_now,
                      nullable=False)

    @declared_attr
    def updated_at(cls):
        return Column(DateTime(timezone=True), default=server_now,
                      onupdate=server_now, nullable=False)
