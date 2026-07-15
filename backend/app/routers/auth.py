from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    UserResponse,
    VerifyEmailRequest,
    ResendCodeRequest,
)
from app.services import auth_service

settings = get_settings()
security_scheme = HTTPBearer()

router = APIRouter(prefix="/api/auth", tags=["auth"])


def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Niepoprawne dane uwierzytelniające",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    return auth_service.get_user(db=db, user_id=user_id)


@router.post("/register", response_model=MessageResponse)
def register(user: RegisterRequest, db: Session = Depends(get_db)):
    return auth_service.register_user(db=db, user=user)


@router.post("/verify-email", response_model=TokenResponse)
def verify_email(data: VerifyEmailRequest, db: Session = Depends(get_db)):
    return auth_service.verify_email(db=db, data=data)


@router.post("/resend-code", response_model=MessageResponse)
def resend_code(data: ResendCodeRequest, db: Session = Depends(get_db)):
    return auth_service.resend_activation_code(db=db, data=data)


@router.post("/login", response_model=TokenResponse)
def login(user: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login_user(db=db, user=user)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(user: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.forgot_password(db=db, user=user)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.reset_password(db=db, data=data)


@router.get("/get-user", response_model=UserResponse)
def get_user(current_user: User = Depends(get_current_user)):
    return current_user