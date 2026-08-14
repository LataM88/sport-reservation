from datetime import date, datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.reservations import Reservation
from app.models.facility import Facility
from app.models.user import User
from app.schemas.reservations import ReservationCreate


def create_reservation(db: Session, user_id: str, data: ReservationCreate) -> Reservation:
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

    facility = db.query(Facility).filter(
        Facility.id == str(data.facility_id),
        Facility.is_active == True,
    ).first()

    if not facility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obiekt nie istnieje lub jest nieaktywny",
        )

    existing = db.query(Reservation).filter(
        Reservation.facility_id == str(data.facility_id),
        Reservation.reservation_date == data.reservation_date,
        Reservation.start_time < data.end_time,
        Reservation.end_time > data.start_time,
        Reservation.status != "cancelled",
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ten termin koliduje z istniejącą rezerwacją",
        )

    # 1. Łączymy datę z czasem, aby móc je łatwo odjąć
    start_dt = datetime.combine(data.reservation_date, data.start_time)
    end_dt = datetime.combine(data.reservation_date, data.end_time)
    
    # 2. Obliczamy różnicę w godzinach
    duration_hours = (end_dt - start_dt).total_seconds() / 3600.0
    
    # 3. Wyliczamy ostateczną kwotę 
    calculated_price = float(facility.base_price) * duration_hours

    # Tworzenie rezerwacji
    reservation = Reservation(
        user_id=user_id,
        facility_id=str(data.facility_id),
        reservation_date=data.reservation_date,
        start_time=data.start_time,
        end_time=data.end_time,
        total_price=calculated_price,  # wartosc wyliczona z bazy a nie przez ai
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


def cancel_reservation(db: Session, reservation_id: str, user_id: str, is_admin: bool = False) -> Reservation:
    reservation = get_reservation_by_id(db, reservation_id)

    if not is_admin and reservation.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nie masz uprawnień do anulowania tej rezerwacji",
        )

    if reservation.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rezerwacja jest już anulowana",
        )

    if not is_admin:
        start_dt = datetime.combine(reservation.reservation_date, reservation.start_time)
        now = datetime.now()
        hours_left = (start_dt - now).total_seconds() / 3600
        if hours_left < 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nie można anulować rezerwacji na mniej niż 12 godzin przed jej rozpoczęciem",
            )

    reservation.status = "cancelled"
    db.commit()
    db.refresh(reservation)

    return reservation


def get_free_slots(db: Session, facility_id: str, target_date: date) -> list[str]:
 
    from datetime import timedelta, datetime

    facility = db.query(Facility).filter(
        Facility.id == facility_id,
        Facility.is_active == True,
    ).first()

    if not facility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Obiekt nie istnieje lub jest nieaktywny",
        )

    if not facility.opening_time or not facility.closing_time:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Obiekt nie ma zdefiniowanych godzin otwarcia",
        )

    slot_minutes = facility.slot_duration_minutes or 60

    all_slots: list[str] = []
    current = datetime.combine(target_date, facility.opening_time)
    closing = datetime.combine(target_date, facility.closing_time)

    while current + timedelta(minutes=slot_minutes) <= closing:
        all_slots.append(current.strftime("%H:%M"))
        current += timedelta(minutes=slot_minutes)

    booked = db.query(Reservation.start_time, Reservation.end_time).filter(
        Reservation.facility_id == facility_id,
        Reservation.reservation_date == target_date,
        Reservation.status != "cancelled",
    ).all()

    free_slots = []
    for slot in all_slots:
        slot_start = datetime.strptime(slot, "%H:%M").time()
        slot_end_dt = datetime.combine(target_date, slot_start) + timedelta(minutes=slot_minutes)
        slot_end = slot_end_dt.time()

        # Sprawdzamy czy slot koliduje z jakąkolwiek istniejącą rezerwacją
        overlaps = any(
            slot_start < r.end_time and slot_end > r.start_time
            for r in booked
        )
        if not overlaps:
            free_slots.append(slot)

    return free_slots


def get_facility_reservations(db: Session, facility_id: str, reservation_date=None) -> list[Reservation]:
    query = db.query(Reservation).filter(
        Reservation.facility_id == facility_id,
        Reservation.status != "cancelled",
    )

    if reservation_date:
        query = query.filter(Reservation.reservation_date == reservation_date)

    return query.order_by(Reservation.start_time).all()
