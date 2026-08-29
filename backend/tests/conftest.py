"""
Wspólne fixtury dla testów backendowych.

Wykorzystuje SQLite w pamięci (in-memory) do szybkiego uruchamiania testów.
"""

import os

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["SECRET_KEY"] = "test-secret-key-for-pytest"

import sys
from datetime import date, time, datetime, timedelta, timezone

import pytest
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

TEST_ENGINE = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSessionLocal = sessionmaker(bind=TEST_ENGINE, autocommit=False, autoflush=False)

from app.db.base import Base
from app.core.security import hash_password, create_access_token
from app.models.user import User
from app.models.facility import Facility
from app.models.reservations import Reservation

import app.db.session as _session_mod
_session_mod.engine = TEST_ENGINE
_session_mod.SessionLocal = TestSessionLocal

from app.main import app
from app.db.session import get_db


@pytest.fixture()
def db():
    """Tworzy tabele, udostępnia sesję do testu, a po zakończeniu czyści bazę."""
    Base.metadata.create_all(bind=TEST_ENGINE)
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=TEST_ENGINE)


@pytest.fixture()
def client(db: Session):
    """Klient testowy FastAPI z nadpisaną sesją bazy danych."""

    def _override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def create_user(db: Session):
    """Tworzy i zapisuje użytkownika w bazie testowej."""

    def _create(
        email: str = "jan@example.com",
        password: str = "Test1234!",
        name: str = "Jan",
        last_name: str = "Kowalski",
        phone: str = "123456789",
        is_active: bool = True,
        role: str = "user",
    ) -> User:
        user = User(
            name=name,
            last_name=last_name,
            phone_number=phone,
            email=email,
            hashed_password=hash_password(password),
            is_active=is_active,
            role=role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    return _create


@pytest.fixture()
def create_facility(db: Session):
    """Tworzy i zapisuje obiekt sportowy w bazie testowej."""

    def _create(
        name: str = "Kort tenisowy",
        category: str = "tenis",
        base_price: float = 100.00,
        opening_time: time = time(8, 0),
        closing_time: time = time(20, 0),
        slot_duration_minutes: int = 60,
        owner_id: str | None = None,
    ) -> Facility:
        facility = Facility(
            name=name,
            category=category,
            base_price=base_price,
            opening_time=opening_time,
            closing_time=closing_time,
            slot_duration_minutes=slot_duration_minutes,
            is_active=True,
            owner_id=owner_id,
        )
        db.add(facility)
        db.commit()
        db.refresh(facility)
        return facility

    return _create


@pytest.fixture()
def make_reservation(db: Session):
    """Tworzy i zapisuje rezerwację w bazie testowej."""

    def _create(
        user_id: str,
        facility_id: str,
        reservation_date: date = None,
        start_time: time = time(10, 0),
        end_time: time = time(11, 0),
        total_price: float = 100.00,
        status: str = "pending",
    ) -> Reservation:
        if reservation_date is None:
            reservation_date = date.today() + timedelta(days=7)

        reservation = Reservation(
            user_id=user_id,
            facility_id=facility_id,
            reservation_date=reservation_date,
            start_time=start_time,
            end_time=end_time,
            total_price=total_price,
            status=status,
        )
        db.add(reservation)
        db.commit()
        db.refresh(reservation)
        return reservation

    return _create


@pytest.fixture()
def auth_headers(create_user):
    """Zwraca nagłówki autoryzacyjne z tokenem JWT dla testowego użytkownika."""
    user = create_user()
    token = create_access_token(data={"user_id": user.id, "role": user.role})
    return {"Authorization": f"Bearer {token}"}, user
