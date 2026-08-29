"""
Testy jednostkowe dla logiki autoryzacji (auth_service.py).

Pokrywa: rejestrację, logowanie, weryfikację adresu e-mail oraz reset hasła.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest
from fastapi import HTTPException

from app.services.auth_service import (
    register_user,
    login_user,
    verify_email,
    reset_password,
)
from app.schemas.user import (
    RegisterRequest,
    LoginRequest,
    VerifyEmailRequest,
    ResetPasswordRequest,
)
from app.core.security import hash_password
from app.models.user import User


class TestRegister:
    """Reguły rejestracji użytkownika."""

    @patch("app.services.auth_service.send_activation_code_email")
    def test_register_creates_inactive_user(self, mock_email, db):
        # Arrange
        data = RegisterRequest(
            name="Jan",
            lastName="Kowalski",
            phoneNumber="123456789",
            email="jan@example.com",
            password="Secret123!",
        )

        # Act
        result = register_user(db, data)

        # Assert
        user = db.query(User).filter(User.email == "jan@example.com").first()
        assert user is not None
        assert user.is_active is False
        assert user.verification_code is not None
        assert "message" in result
        mock_email.assert_called_once()

    @patch("app.services.auth_service.send_activation_code_email")
    def test_register_duplicate_email_rejected(self, mock_email, db, create_user):
        # Arrange
        create_user(email="jan@example.com")
        data = RegisterRequest(
            name="Anna",
            lastName="Nowak",
            phoneNumber="987654321",
            email="jan@example.com",
            password="Secret123!",
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            register_user(db, data)
        assert exc.value.status_code == 409


class TestLogin:
    """Walidacja logowania użytkownika."""

    def test_login_success(self, db, create_user):
        # Arrange
        create_user(email="jan@example.com", password="Secret123!")
        data = LoginRequest(email="jan@example.com", password="Secret123!")

        # Act
        result = login_user(db, data)

        # Assert
        assert "token" in result
        assert result["role"] == "user"

    def test_login_wrong_password(self, db, create_user):
        # Arrange
        create_user(email="jan@example.com", password="Secret123!")
        data = LoginRequest(email="jan@example.com", password="WrongPass1!")

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            login_user(db, data)
        assert exc.value.status_code == 401

    def test_login_inactive_account(self, db, create_user):
        # Arrange
        create_user(email="jan@example.com", password="Secret123!", is_active=False)
        data = LoginRequest(email="jan@example.com", password="Secret123!")

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            login_user(db, data)
        assert exc.value.status_code == 403


class TestVerifyEmail:
    """Weryfikacja adresu e-mail kodem aktywacyjnym."""

    @patch("app.services.auth_service.datetime")
    def test_valid_code_activates_user(self, mock_dt, db):
        # Arrange
        now_naive = datetime(2026, 1, 1, 12, 0, 0)
        mock_dt.now.return_value = now_naive
        mock_dt.side_effect = lambda *a, **kw: datetime(*a, **kw)

        user = User(
            name="Jan",
            last_name="Kowalski",
            phone_number="123456789",
            email="jan@example.com",
            hashed_password=hash_password("Secret123!"),
            is_active=False,
            verification_code="123456",
            verification_code_expires_at=datetime(2026, 1, 1, 13, 0, 0),
        )
        db.add(user)
        db.commit()
        data = VerifyEmailRequest(email="jan@example.com", code="123456")

        # Act
        result = verify_email(db, data)

        # Assert
        assert "token" in result
        db.refresh(user)
        assert user.is_active is True

    def test_wrong_code_rejected(self, db):
        # Arrange
        user = User(
            name="Jan",
            last_name="Kowalski",
            phone_number="123456789",
            email="jan@example.com",
            hashed_password=hash_password("Secret123!"),
            is_active=False,
            verification_code="123456",
            verification_code_expires_at=datetime(2099, 1, 1, 0, 0, 0),
        )
        db.add(user)
        db.commit()
        data = VerifyEmailRequest(email="jan@example.com", code="000000")

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            verify_email(db, data)
        assert exc.value.status_code == 400
