import logging
from datetime import datetime, date, time, timedelta, timezone

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.reservations import Reservation
from app.models.facility import Facility
from app.models.user import User
from app.services.email_service import send_reservation_reminder_email

logger = logging.getLogger(__name__)


def send_upcoming_reservation_reminders() -> None:
    """
    Check for reservations starting in ~2 hours and send reminder emails
    to users who have email_notifications enabled.
    Runs every 10 minutes via APScheduler.
    """
    db: Session = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        today = now.date()

        # Window: reservations starting between 110 and 130 minutes from now
        window_start = now + timedelta(minutes=110)
        window_end = now + timedelta(minutes=130)

        window_start_time = window_start.time()
        window_end_time = window_end.time()

        # Query reservations that:
        # - are today
        # - start within the 2h window
        # - haven't been reminded yet
        # - belong to users with notifications enabled
        reservations = (
            db.query(Reservation)
            .join(User, Reservation.user_id == User.id)
            .filter(
                Reservation.reservation_date == today,
                Reservation.start_time >= window_start_time,
                Reservation.start_time <= window_end_time,
                Reservation.reminder_sent == False,  # noqa: E712
                Reservation.status != "cancelled",
                User.email_notifications == True,  # noqa: E712
            )
            .all()
        )

        for reservation in reservations:
            try:
                user = db.query(User).filter(User.id == reservation.user_id).first()
                facility = db.query(Facility).filter(Facility.id == reservation.facility_id).first()

                if not user or not facility:
                    continue

                send_reservation_reminder_email(
                    to_email=user.email,
                    facility_name=facility.name,
                    reservation_date=reservation.reservation_date.strftime("%d.%m.%Y"),
                    start_time=reservation.start_time.strftime("%H:%M"),
                )

                reservation.reminder_sent = True
                db.commit()

                logger.info(
                    f"Reminder sent for reservation {reservation.id} to {user.email}"
                )
            except Exception as e:
                logger.error(f"Failed to send reminder for reservation {reservation.id}: {e}")
                db.rollback()

    except Exception as e:
        logger.error(f"Error in reminder scheduler: {e}")
    finally:
        db.close()
