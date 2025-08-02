from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict


class UserCreateRequest(BaseModel):
    email: str
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    bio: Optional[str] = None


class TransactionIn(BaseModel):
    date: date
    description: str
    amount: float


class SignupRequest(BaseModel):
    user: UserCreateRequest
    transactions: List[TransactionIn] = Field(default_factory=list)


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    bio: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str 