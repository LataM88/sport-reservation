from datetime import date
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.facility import Facility
from app.schemas.facility import FacilityResponse
from app.services import reservations_service

router = APIRouter(prefix="/api/facilities", tags=["facilities"])


@router.get("/", response_model=List[FacilityResponse])
def get_facilities(db: Session = Depends(get_db)):
    facilities = db.query(Facility).filter(Facility.is_active == True).order_by(Facility.id.desc()).all()
    return facilities


@router.get("/{facility_id}/free-slots", response_model=List[str])
def get_free_slots(
    facility_id: str,
    date: date = Query(..., description="Data w formacie YYYY-MM-DD, np. 2026-07-20"),
    db: Session = Depends(get_db),
):
    """
    Zwraca listę wolnych slotów czasowych dla danego obiektu i daty.
    """
    return reservations_service.get_free_slots(
        db=db,
        facility_id=facility_id,
        target_date=date,
    )
