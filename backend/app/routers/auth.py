from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import RegisterRequest, LoginRequest, TokenResponse, ForgotPasswordRequest, MessageResponse, ResetPasswordRequest
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(user: RegisterRequest, db: Session = Depends(get_db)):
    return auth_service.register_user(db=db, user=user)


@router.post("/login", response_model=TokenResponse)
def login(user: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login_user(db=db, user=user)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(user: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.forgot_password(db=db, user=user)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.reset_password(db=db, data=data)