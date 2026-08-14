from datetime import time
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class FacilityResponse(BaseModel):
    id: UUID
    name: str
    category: str
    description: Optional[str] = None

    image_url: Optional[str] = None

    opening_time: Optional[time] = None
    closing_time: Optional[time] = None
    slot_duration_minutes: Optional[int] = None
    buffer_time_minutes: Optional[int] = None
    max_capacity: Optional[int] = None
    base_price: Optional[Decimal] = None

    is_active: bool

    model_config = {"from_attributes": True}


class FacilityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    opening_time: Optional[time] = None
    closing_time: Optional[time] = None
    base_price: Optional[Decimal] = None
    is_active: Optional[bool] = None
