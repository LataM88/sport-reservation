from datetime import datetime
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
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)