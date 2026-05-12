from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    name: str
    lastName: str
    phoneNumber: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    token: str
    user_id: str


class MessageResponse(BaseModel):
    message: str
