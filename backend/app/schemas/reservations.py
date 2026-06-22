from datetime import date, time, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ReservationCreate(BaseModel):
    facility_id: UUID
    reservation_date: date
    start_time: time
    end_time: time
    total_price: Decimal


class ReservationResponse(BaseModel):
    id: UUID
    user_id: str
    facility_id: UUID
    reservation_date: date
    start_time: time
    end_time: time
    total_price: Decimal
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ReservationStatusUpdate(BaseModel):
    status: str
