import os
import random
import re
import string
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import cloudinary
import cloudinary.uploader

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import (
    ProfileUpdateRequest,
    PasswordChangeRequest,
    ConfirmChangeRequest,
    NotificationPreferencesRequest,
)
from app.services.email_service import (
    send_profile_change_confirmation_email,
    send_password_change_confirmation_email,
)

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

PASSWORD_REGEX = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$")


def upload_avatar(db: Session, current_user: User, file) -> dict:
    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder="sport-reservation/avatars",
            public_id=f"user_{current_user.id}",
            overwrite=True,
            transformation=[
                {"width": 200, "height": 200, "crop": "fill", "gravity": "face"}
            ]
        )
        avatar_url = result.get("secure_url")
        current_user.avatar_url = avatar_url
        db.commit()
        return {"avatar_url": avatar_url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Błąd podczas wgrywania zdjęcia: {str(e)}"
        )


def _generate_code() -> str:
    return "".join(random.choices(string.digits, k=6))


def request_profile_update(
    db: Session, current_user: User, data: ProfileUpdateRequest
) -> dict:
    # Check if new email is already taken by another user
    if data.email != current_user.email:
        existing = db.query(User).filter(
            User.email == data.email, User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ten adres email jest już zajęty",
            )

    # Store pending changes
    current_user.pending_email = data.email
    current_user.pending_phone_number = data.phoneNumber

    # Generate and store confirmation code
    code = _generate_code()
    current_user.change_confirmation_code = code
    current_user.change_code_expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    db.commit()

    # Send confirmation to current email
    send_profile_change_confirmation_email(to_email=current_user.email, code=code)

    return {"message": "Kod potwierdzenia został wysłany na Twój email"}


def confirm_profile_update(
    db: Session, current_user: User, data: ConfirmChangeRequest
) -> dict:
    if not current_user.change_confirmation_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Brak oczekujących zmian do potwierdzenia",
        )

    if current_user.change_confirmation_code != data.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nieprawidłowy kod potwierdzenia",
        )

    if current_user.change_code_expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kod potwierdzenia wygasł",
        )

    # Apply pending changes
    if current_user.pending_email:
        current_user.email = current_user.pending_email
    if current_user.pending_phone_number:
        current_user.phone_number = current_user.pending_phone_number

    # Clear pending fields
    current_user.pending_email = None
    current_user.pending_phone_number = None
    current_user.change_confirmation_code = None
    current_user.change_code_expires_at = None

    db.commit()

    return {"message": "Dane profilu zostały zaktualizowane"}


def request_password_change(
    db: Session, current_user: User, data: PasswordChangeRequest
) -> dict:
    # Verify old password
    if not verify_password(data.oldPassword, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nieprawidłowe obecne hasło",
        )

    # Validate new password matches confirmation
    if data.newPassword != data.confirmPassword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nowe hasło i potwierdzenie nie są identyczne",
        )

    # Validate password strength
    if not PASSWORD_REGEX.match(data.newPassword):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hasło musi zawierać min. 8 znaków, dużą i małą literę, cyfrę oraz znak specjalny",
        )

    # Store pending hashed password
    current_user.pending_hashed_password = hash_password(data.newPassword)

    # Generate and store confirmation code
    code = _generate_code()
    current_user.change_confirmation_code = code
    current_user.change_code_expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    db.commit()

    # Send confirmation email
    send_password_change_confirmation_email(to_email=current_user.email, code=code)

    return {"message": "Kod potwierdzenia został wysłany na Twój email"}


def confirm_password_change(
    db: Session, current_user: User, data: ConfirmChangeRequest
) -> dict:
    if not current_user.pending_hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Brak oczekującej zmiany hasła do potwierdzenia",
        )

    if not current_user.change_confirmation_code or current_user.change_confirmation_code != data.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nieprawidłowy kod potwierdzenia",
        )

    if current_user.change_code_expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kod potwierdzenia wygasł",
        )

    # Apply password change
    current_user.hashed_password = current_user.pending_hashed_password

    # Clear pending fields
    current_user.pending_hashed_password = None
    current_user.change_confirmation_code = None
    current_user.change_code_expires_at = None

    db.commit()

    return {"message": "Hasło zostało pomyślnie zmienione"}


def update_notification_preferences(
    db: Session, current_user: User, data: NotificationPreferencesRequest
) -> dict:
    current_user.email_notifications = data.email_notifications
    db.commit()
    return {"email_notifications": current_user.email_notifications}


def get_notification_preferences(current_user: User) -> dict:
    return {"email_notifications": current_user.email_notifications}
