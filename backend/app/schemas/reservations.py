from datetime import date, time, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel
from app.schemas.user import UserResponse


class ReservationCreate(BaseModel):
    facility_id: UUID
    reservation_date: date
    start_time: time
    end_time: time
    total_price: Optional[float] = None


class ReservationResponse(BaseModel):
    id: UUID
    user_id: str
    facility_id: UUID
    reservation_date: date
    start_time: time
    end_time: time
    total_price: Optional[float] = None
    status: str
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class AdminReservationResponse(ReservationResponse):
    user: Optional[UserResponse] = None

class ManualReservationCreate(BaseModel):
    facility_id: UUID
    reservation_date: date
    start_time: time
    end_time: time
    guest_name: str
    guest_phone: str


class ReservationStatusUpdate(BaseModel):
    status: str
