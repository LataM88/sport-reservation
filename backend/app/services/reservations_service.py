from datetime import date, datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.reservations import Reservation
from app.models.facility import Facility
from app.models.user import User
from app.schemas.reservations import ReservationCreate


def create_reservation(db: Session, user_id: str, data: ReservationCreate) -> Reservation:
    # Sprawdź czy termin nie jest w przeszłości
    today = date.today()
    if data.reservation_date < today:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nie można rezerwować terminów w przeszłości",
        )

    if data.reservation_date == today:
        now_time = datetime.now(timezone.utc).time()
        if data.start_time <= now_time:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nie można rezerwować godzin, które już minęły",
            )

    # Sprawdź czy obiekt istnieje i jest aktywny
    facility = db.query(Facility).filter(
        Facility.id == str(data.facility_id),
        Facility.is_active == True,
    ).first()

    if not facility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obiekt nie istnieje lub jest nieaktywny",
        )

    # Sprawdź czy slot nie jest już zajęty
    existing = db.query(Reservation).filter(
        Reservation.facility_id == str(data.facility_id),
        Reservation.reservation_date == data.reservation_date,
        Reservation.start_time == data.start_time,
        Reservation.status != "cancelled",
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ten termin jest już zarezerwowany",
        )

    reservation = Reservation(
        user_id=user_id,
        facility_id=str(data.facility_id),
        reservation_date=data.reservation_date,
        start_time=data.start_time,
        end_time=data.end_time,
        total_price=data.total_price,
        status="pending",
    )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    return reservation


def get_user_reservations(db: Session, user_id: str) -> list[Reservation]:
    return (
        db.query(Reservation)
        .filter(Reservation.user_id == user_id)
        .order_by(Reservation.reservation_date.desc(), Reservation.start_time.desc())
        .all()
    )


def get_reservation_by_id(db: Session, reservation_id: str) -> Reservation:
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()

    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rezerwacja nie istnieje",
        )

    return reservation


def cancel_reservation(db: Session, reservation_id: str, user_id: str) -> Reservation:
    reservation = get_reservation_by_id(db, reservation_id)

    if reservation.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nie masz uprawnień do anulowania tej rezerwacji",
        )

    if reservation.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rezerwacja jest już anulowana",
        )

    reservation.status = "cancelled"
    db.commit()
    db.refresh(reservation)

    return reservation


def get_facility_reservations(db: Session, facility_id: str, reservation_date=None) -> list[Reservation]:
    query = db.query(Reservation).filter(
        Reservation.facility_id == facility_id,
        Reservation.status != "cancelled",
    )

    if reservation_date:
        query = query.filter(Reservation.reservation_date == reservation_date)

    return query.order_by(Reservation.start_time).all()
