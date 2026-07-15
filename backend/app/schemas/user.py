from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field

class RegisterRequest(BaseModel):
    name: str
    lastName: str
    phoneNumber: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember: bool = False


class TokenResponse(BaseModel):
    token: str
    user_id: str


class MessageResponse(BaseModel):
    message: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

class UserResponse(BaseModel):
    id: str
    name: str
    lastName: str = Field(alias="lastName", validation_alias="last_name")
    phoneNumber: str = Field(alias="phoneNumber", validation_alias="phone_number")
    email: EmailStr
    email_notifications: bool = False
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AvatarUpdateResponse(BaseModel):
    avatar_url: str | None = None


class ProfileUpdateRequest(BaseModel):
    email: EmailStr
    phoneNumber: str


class PasswordChangeRequest(BaseModel):
    oldPassword: str
    newPassword: str
    confirmPassword: str


class ConfirmChangeRequest(BaseModel):
    code: str


class NotificationPreferencesRequest(BaseModel):
    email_notifications: bool


class NotificationPreferencesResponse(BaseModel):
    email_notifications: bool

    model_config = ConfigDict(from_attributes=True)


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str


class ResendCodeRequest(BaseModel):
    email: EmailStr