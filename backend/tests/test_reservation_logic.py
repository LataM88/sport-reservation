"""
Testy jednostkowe dla logiki biznesowej rezerwacji (reservations_service.py).

Pokrywa: kalkulację ceny, walidację dat/godzin, wykrywanie kolizji nakładających się terminów,
reguły anulowania oraz wyliczanie wolnych slotów.
"""

from datetime import date, time, timedelta
from unittest.mock import patch

import pytest
from fastapi import HTTPException

from app.services.reservations_service import (
    create_reservation as service_create_reservation,
    cancel_reservation,
    get_free_slots,
)
from app.schemas.reservations import ReservationCreate


class TestPriceCalculation:
    """Cena jest wyliczana jako base_price × duration_hours."""

    def test_full_hour_price(self, db, create_user, create_facility):
        # Arrange
        user = create_user()
        facility = create_facility(base_price=120.00)
        future = date.today() + timedelta(days=3)
        data = ReservationCreate(
            facility_id=facility.id,
            reservation_date=future,
            start_time=time(10, 0),
            end_time=time(12, 0),
        )

        # Act
        reservation = service_create_reservation(db, user.id, data)

        # Assert
        assert float(reservation.total_price) == 240.00

    def test_half_hour_price(self, db, create_user, create_facility):
        # Arrange
        user = create_user()
        facility = create_facility(base_price=100.00)
        future = date.today() + timedelta(days=3)
        data = ReservationCreate(
            facility_id=facility.id,
            reservation_date=future,
            start_time=time(14, 0),
            end_time=time(15, 30),
        )

        # Act
        reservation = service_create_reservation(db, user.id, data)

        # Assert
        assert float(reservation.total_price) == 150.00


class TestReservationValidation:
    """Reguły walidacji daty i godziny rezerwacji."""

    def test_past_date_rejected(self, db, create_user, create_facility):
        # Arrange
        user = create_user()
        facility = create_facility()
        past = date.today() - timedelta(days=1)
        data = ReservationCreate(
            facility_id=facility.id,
            reservation_date=past,
            start_time=time(10, 0),
            end_time=time(11, 0),
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            service_create_reservation(db, user.id, data)
        assert exc.value.status_code == 400

    def test_overlapping_slot_rejected(self, db, create_user, create_facility, make_reservation):
        # Arrange
        user = create_user()
        facility = create_facility()
        future = date.today() + timedelta(days=5)
        make_reservation(
            user_id=user.id,
            facility_id=facility.id,
            reservation_date=future,
            start_time=time(10, 0),
            end_time=time(11, 0),
        )
        overlapping = ReservationCreate(
            facility_id=facility.id,
            reservation_date=future,
            start_time=time(10, 30),
            end_time=time(11, 30),
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            service_create_reservation(db, user.id, overlapping)
        assert exc.value.status_code == 409


class TestCancelReservation:
    """Reguły biznesowe dotyczące anulowania rezerwacji."""

    def test_cancel_own_reservation(self, db, create_user, create_facility, make_reservation):
        # Arrange
        user = create_user()
        facility = create_facility()
        future = date.today() + timedelta(days=5)
        res = make_reservation(
            user_id=user.id,
            facility_id=facility.id,
            reservation_date=future,
            start_time=time(10, 0),
            end_time=time(11, 0),
        )

        # Act
        cancelled = cancel_reservation(db, res.id, user.id)

        # Assert
        assert cancelled.status == "cancelled"

    def test_cancel_foreign_reservation_forbidden(
        self, db, create_user, create_facility, make_reservation
    ):
        # Arrange
        owner = create_user(email="owner@example.com")
        stranger = create_user(email="stranger@example.com")
        facility = create_facility()
        future = date.today() + timedelta(days=5)
        res = make_reservation(
            user_id=owner.id,
            facility_id=facility.id,
            reservation_date=future,
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            cancel_reservation(db, res.id, stranger.id)
        assert exc.value.status_code == 403


class TestFreeSlots:
    """Kalkulacja dostępnych slotów."""

    def test_all_slots_free_when_no_bookings(self, db, create_facility):
        # Arrange
        facility = create_facility(
            opening_time=time(8, 0),
            closing_time=time(12, 0),
            slot_duration_minutes=60,
        )
        future = date.today() + timedelta(days=3)

        # Act
        slots = get_free_slots(db, facility.id, future)

        # Assert
        assert slots == ["08:00", "09:00", "10:00", "11:00"]

    def test_booked_slot_excluded(self, db, create_user, create_facility, make_reservation):
        # Arrange
        user = create_user()
        facility = create_facility(
            opening_time=time(8, 0),
            closing_time=time(12, 0),
            slot_duration_minutes=60,
        )
        future = date.today() + timedelta(days=3)
        make_reservation(
            user_id=user.id,
            facility_id=facility.id,
            reservation_date=future,
            start_time=time(9, 0),
            end_time=time(10, 0),
        )

        # Act
        slots = get_free_slots(db, facility.id, future)

        # Assert
        assert "09:00" not in slots
        assert "08:00" in slots
        assert "10:00" in slots
