from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.user import (
    ProfileUpdateRequest,
    PasswordChangeRequest,
    ConfirmChangeRequest,
    NotificationPreferencesRequest,
    NotificationPreferencesResponse,
    MessageResponse,
    AvatarUpdateResponse,
)
from app.services import user_service

router = APIRouter(prefix="/api/users", tags=["users"])


@router.put("/profile", response_model=MessageResponse)
def request_profile_update(
    data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.request_profile_update(db=db, current_user=current_user, data=data)


@router.post("/profile/confirm", response_model=MessageResponse)
def confirm_profile_update(
    data: ConfirmChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.confirm_profile_update(db=db, current_user=current_user, data=data)


@router.put("/password", response_model=MessageResponse)
def request_password_change(
    data: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.request_password_change(db=db, current_user=current_user, data=data)


@router.post("/password/confirm", response_model=MessageResponse)
def confirm_password_change(
    data: ConfirmChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.confirm_password_change(db=db, current_user=current_user, data=data)


@router.get("/notifications", response_model=NotificationPreferencesResponse)
def get_notification_preferences(
    current_user: User = Depends(get_current_user),
):
    return user_service.get_notification_preferences(current_user=current_user)


@router.put("/notifications", response_model=NotificationPreferencesResponse)
def update_notification_preferences(
    data: NotificationPreferencesRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.update_notification_preferences(
        db=db, current_user=current_user, data=data
    )


@router.put("/avatar", response_model=AvatarUpdateResponse)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.upload_avatar(db=db, current_user=current_user, file=file)

