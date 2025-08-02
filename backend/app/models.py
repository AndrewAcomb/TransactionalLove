from datetime import datetime
from typing import Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Profile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    bio: Optional[str] = None
    photos: Optional[list[str]] = Field(
        default=None, sa_column=Column(JSON), description="List of photo URLs"
    )
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Swipe(SQLModel, table=True):
    swiper_id: int = Field(foreign_key="user.id", primary_key=True)
    swipee_id: int = Field(foreign_key="user.id", primary_key=True)
    direction: str  # "like" or "pass"
    timestamp: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Match(SQLModel, table=True):
    user_a_id: int = Field(foreign_key="user.id", primary_key=True)
    user_b_id: int = Field(foreign_key="user.id", primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False) 


class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    profile_id: int = Field(foreign_key="profile.id")
    date: datetime = Field(nullable=False)
    description: str
    amount: float 