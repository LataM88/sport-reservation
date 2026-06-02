from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.facility import Facility
from app.schemas.facility import FacilityResponse

router = APIRouter(prefix="/api/facilities", tags=["facilities"])


@router.get("/", response_model=List[FacilityResponse])
def get_facilities(db: Session = Depends(get_db)):
    facilities = db.query(Facility).filter(Facility.is_active == True).order_by(Facility.id.desc()).all()
    return facilities
