import uuid
from datetime import datetime, timezone

from typing import Optional
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    reset_code: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)
    reset_code_expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    email_notifications: Mapped[bool] = mapped_column(default=False, nullable=False)
    pending_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    pending_phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    pending_hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    change_confirmation_code: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)
    change_code_expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=False, nullable=False)
    verification_code: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)
    verification_code_expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"<User {self.email}>"
