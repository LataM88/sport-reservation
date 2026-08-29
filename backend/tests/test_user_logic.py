"""
Testy jednostkowe dla logiki użytkownika (user_service.py).

Pokrywa: walidację wyrażenia regularnego hasła oraz proces zmiany hasła.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest
from fastapi import HTTPException

from app.services.user_service import (
    PASSWORD_REGEX,
    request_password_change,
    confirm_profile_update,
)
from app.schemas.user import PasswordChangeRequest, ConfirmChangeRequest
from app.core.security import hash_password
from app.models.user import User


class TestPasswordRegex:
    """PASSWORD_REGEX musi wymagać: min. 8 znaków, dużej i małej litery, cyfry oraz znaku specjalnego."""

    def test_valid_password(self):
        # Arrange
        password = "MySecret1!"

        # Act & Assert
        assert PASSWORD_REGEX.match(password) is not None

    def test_too_short_password(self):
        # Arrange
        password = "Ab1!"

        # Act & Assert
        assert PASSWORD_REGEX.match(password) is None

    def test_no_special_char(self):
        # Arrange
        password = "MySecret123"

        # Act & Assert
        assert PASSWORD_REGEX.match(password) is None

    def test_no_uppercase(self):
        # Arrange
        password = "mysecret1!"

        # Act & Assert
        assert PASSWORD_REGEX.match(password) is None


class TestPasswordChange:
    """Walidacja procesu zmiany hasła."""

    @patch("app.services.user_service.send_password_change_confirmation_email")
    def test_wrong_old_password_rejected(self, mock_email, db):
        # Arrange
        user = User(
            name="Jan",
            last_name="Kowalski",
            phone_number="123456789",
            email="jan@example.com",
            hashed_password=hash_password("CorrectOld1!"),
            is_active=True,
        )
        db.add(user)
        db.commit()
        data = PasswordChangeRequest(
            oldPassword="WrongOld1!",
            newPassword="NewSecure1!",
            confirmPassword="NewSecure1!",
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            request_password_change(db, user, data)
        assert exc.value.status_code == 400

    @patch("app.services.user_service.send_password_change_confirmation_email")
    def test_mismatched_confirmation_rejected(self, mock_email, db):
        # Arrange
        user = User(
            name="Jan",
            last_name="Kowalski",
            phone_number="123456789",
            email="jan@example.com",
            hashed_password=hash_password("CorrectOld1!"),
            is_active=True,
        )
        db.add(user)
        db.commit()
        data = PasswordChangeRequest(
            oldPassword="CorrectOld1!",
            newPassword="NewSecure1!",
            confirmPassword="Different1!",
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            request_password_change(db, user, data)
        assert exc.value.status_code == 400
