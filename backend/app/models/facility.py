import uuid
from datetime import datetime, time
from decimal import Decimal
from typing import Optional

from sqlalchemy import String, Text, Time, Integer, Boolean, Numeric, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Facility(Base):
    __tablename__ = "facilities"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    opening_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    closing_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    slot_duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    buffer_time_minutes: Mapped[Optional[int]] = mapped_column(Integer, default=30, nullable=True)
    max_capacity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    base_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    def __repr__(self) -> str:
        return f"<Facility {self.name}>"
