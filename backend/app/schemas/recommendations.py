from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class RecommendedFacilityResponse(BaseModel):
    id: UUID
    name: str
    category: str
    location: Optional[str] = None
    image_url: Optional[str] = None
    base_price: Optional[Decimal] = None

    model_config = {"from_attributes": True}
