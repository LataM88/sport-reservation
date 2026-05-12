from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import RegisterRequest, LoginRequest


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

    token = create_access_token(data={"user_id": found_user.id})

    return {"token": token, "user_id": found_user.id}
