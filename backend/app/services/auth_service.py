from datetime import datetime, timedelta, timezone
import random
import string
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest, UserResponse
from app.services.email_service import send_reset_code_email


def register_user(db: Session, user: RegisterRequest) -> dict:
 
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Użytkownik z tym adresem email już istnieje",
        )

    new_user = User(
        name=user.name,
        last_name=user.lastName,
        phone_number=user.phoneNumber,
        email=user.email,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"user_id": new_user.id})

    return {"token": token, "user_id": new_user.id}


def login_user(db: Session, user: LoginRequest) -> dict:
    
    found_user = db.query(User).filter(User.email == user.email).first()

    if not found_user or not verify_password(user.password, found_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowy email lub hasło",
        )

    expires_delta = timedelta(days=30) if user.remember else None
    token = create_access_token(
        data={"user_id": found_user.id}, expires_delta=expires_delta
    )

    return {"token": token, "user_id": found_user.id}

def forgot_password(db: Session, user: ForgotPasswordRequest) -> dict:
    found_user = db.query(User).filter(User.email == user.email).first()
    if not found_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nie ma użytkownika z takim adresem email",
        )
    code = "".join(random.choices(string.digits, k=6))
    found_user.reset_code = code
    found_user.reset_code_expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    db.commit()

    send_reset_code_email(to_email=user.email, code=code)

    return {"message": "Kod resetowania hasła został wysłany na Twój email"}

def reset_password(db: Session, data: ResetPasswordRequest) -> dict:
    found_user = db.query(User).filter(User.email == data.email).first()
    if not found_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie istnieje",
        )
    
    if not found_user.reset_code or found_user.reset_code != data.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nieprawidłowy kod resetowania",
        )
    
    if found_user.reset_code_expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kod resetowania wygasł",
        )
    
    found_user.hashed_password = hash_password(data.new_password)
    found_user.reset_code = None
    found_user.reset_code_expires_at = None
    
    db.commit()
    
    return {"message": "Hasło zostało pomyślnie zmienione"}


def get_user(db: Session, user_id: str) -> User:
    found_user = db.query(User).filter(User.id == user_id).first()
    if not found_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie istnieje",
        )
    return found_user