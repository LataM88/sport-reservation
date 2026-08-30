from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import or_
import cloudinary
import cloudinary.uploader

from app.db.session import get_db
from app.models.facility import Facility
from app.models.reservations import Reservation
from app.models.user import User
from app.routers.auth import get_current_admin
from app.schemas.facility import FacilityResponse, FacilityUpdate
from app.schemas.reservations import ReservationResponse, AdminReservationResponse, ReservationStatusUpdate, ManualReservationCreate
from app.schemas.user import UserResponse
from app.services.reservations_service import create_reservation, cancel_reservation
from app.services.email_service import send_reservation_accepted_email, send_reservation_rejected_email

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/my-facility", response_model=FacilityResponse)
def get_my_facility(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    facility = db.query(Facility).filter(Facility.owner_id == current_user.id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Nie przypisano Ci żadnego obiektu")
    return facility


@router.patch("/my-facility", response_model=FacilityResponse)
def update_my_facility(
    data: FacilityUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    facility = db.query(Facility).filter(Facility.owner_id == current_user.id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Nie przypisano Ci żadnego obiektu")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(facility, key, value)

    db.commit()
    db.refresh(facility)
    return facility


@router.post("/my-facility/photo")
def upload_facility_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    facility = db.query(Facility).filter(Facility.owner_id == current_user.id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Nie przypisano Ci żadnego obiektu")

    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder="sport-reservation/facilities",
            public_id=f"facility_{facility.id}",
            overwrite=True,
            transformation=[
                {"width": 800, "height": 600, "crop": "fill"}
            ]
        )
        image_url = result.get("secure_url")
        facility.image_url = image_url
        db.commit()
        return {"image_url": image_url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Błąd podczas wgrywania zdjęcia: {str(e)}"
        )


@router.get("/my-facility/reservations", response_model=List[AdminReservationResponse])
def get_my_facility_reservations(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    facility = db.query(Facility).filter(Facility.owner_id == current_user.id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Nie przypisano Ci żadnego obiektu")
    
    reservations = (
        db.query(Reservation)
        .filter(Reservation.facility_id == facility.id)
        .order_by(Reservation.reservation_date.desc(), Reservation.start_time.desc())
        .all()
    )
    return reservations


@router.patch("/reservations/{reservation_id}/status", response_model=AdminReservationResponse)
def update_reservation_status(
    reservation_id: str,
    data: ReservationStatusUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    facility = db.query(Facility).filter(Facility.owner_id == current_user.id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Brak obiektu")

    reservation = db.query(Reservation).filter(Reservation.id == reservation_id, Reservation.facility_id == facility.id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Rezerwacja nie znaleziona")

    reservation.status = data.status
    db.commit()
    db.refresh(reservation)

    if reservation.user and reservation.user.email_reservation_updates:
        if data.status == "confirmed":
            send_reservation_accepted_email(
                reservation.user.email, facility.name, str(reservation.reservation_date), str(reservation.start_time)
            )
        elif data.status == "cancelled":
            send_reservation_rejected_email(
                reservation.user.email, facility.name, str(reservation.reservation_date), str(reservation.start_time)
            )

    return reservation


@router.post("/reservations", response_model=AdminReservationResponse)
def create_manual_reservation(
    data: ManualReservationCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    facility = db.query(Facility).filter(Facility.owner_id == current_user.id).first()
    if not facility or str(facility.id) != str(data.facility_id):
        raise HTTPException(status_code=403, detail="Brak dostępu do tego obiektu")

    from app.schemas.reservations import ReservationCreate
    reservation_create_data = ReservationCreate(
        facility_id=data.facility_id,
        reservation_date=data.reservation_date,
        start_time=data.start_time,
        end_time=data.end_time,
    )
    
    reservation = create_reservation(db=db, user_id=current_user.id, data=reservation_create_data)
    reservation.status = "confirmed"
    reservation.guest_name = data.guest_name
    reservation.guest_phone = data.guest_phone
    db.commit()
    db.refresh(reservation)
    return reservation


@router.get("/my-facility/users", response_model=List[UserResponse])
def get_facility_users(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    facility = db.query(Facility).filter(Facility.owner_id == current_user.id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Nie przypisano Ci żadnego obiektu")

    # Get distinct users who have a reservation for this facility
    users = (
        db.query(User)
        .join(Reservation, Reservation.user_id == User.id)
        .filter(Reservation.facility_id == facility.id)
        .filter(User.id != current_user.id) # Exclude the admin if they made manual reservations
        .distinct()
        .all()
    )
    return users


@router.patch("/reservations/{reservation_id}/cancel", response_model=AdminReservationResponse)
def admin_cancel_reservation(
    reservation_id: str,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    facility = db.query(Facility).filter(Facility.owner_id == current_user.id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Brak obiektu")

    reservation = db.query(Reservation).filter(
        Reservation.id == reservation_id,
        Reservation.facility_id == facility.id,
    ).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Rezerwacja nie znaleziona")

    return cancel_reservation(
        db=db, reservation_id=reservation_id, user_id=current_user.id, is_admin=True
    )
