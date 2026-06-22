from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.reservations import ReservationCreate, ReservationResponse
from app.services import reservations_service

router = APIRouter(prefix="/api/reservations", tags=["reservations"])


@router.post("/", response_model=ReservationResponse)
def create_reservation(
    data: ReservationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return reservations_service.create_reservation(
        db=db, user_id=current_user.id, data=data
    )


@router.get("/my", response_model=List[ReservationResponse])
def get_my_reservations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return reservations_service.get_user_reservations(db=db, user_id=current_user.id)


@router.get("/facility/{facility_id}", response_model=List[ReservationResponse])
def get_facility_reservations(
    facility_id: str,
    reservation_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
):
    return reservations_service.get_facility_reservations(
        db=db, facility_id=facility_id, reservation_date=reservation_date
    )


@router.patch("/{reservation_id}/cancel", response_model=ReservationResponse)
def cancel_reservation(
    reservation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return reservations_service.cancel_reservation(
        db=db, reservation_id=reservation_id, user_id=current_user.id
    )