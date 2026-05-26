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
