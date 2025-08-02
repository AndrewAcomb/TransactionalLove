from typing import List

from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select

from ..db import engine
from ..models import Profile, User, Transaction, Match
from ..schemas import SignupRequest, ProfileResponse, ChatRequest, ChatResponse

router = APIRouter(tags=["profiles"])


@router.post("/signup", response_model=ProfileResponse)
async def signup(payload: SignupRequest):
    with Session(engine) as session:
        # Create user
        user = User(email=payload.user.email, hashed_password="")
        session.add(user)
        session.commit()
        session.refresh(user)

        # Create profile
        profile = Profile(
            user_id=user.id,
            name=payload.user.name,
            age=payload.user.age,
            gender=payload.user.gender,
            bio=payload.user.bio,
        )
        session.add(profile)
        session.commit()
        session.refresh(profile)

        # Insert transactions
        for t in payload.transactions:
            txn = Transaction(
                profile_id=profile.id,
                date=t.date,
                description=t.description,
                amount=t.amount,
            )
            session.add(txn)
        session.commit()

        # For demo: create matches with up to 3 existing profiles (if any)
        other_profiles = (
            session.exec(select(Profile).where(Profile.id != profile.id).limit(3)).all()
        )
        for op in other_profiles:
            # ensure consistent ordering of user ids
            a_id, b_id = sorted([profile.user_id, op.user_id])
            match_exists = session.exec(
                select(Match).where(
                    Match.user_a_id == a_id, Match.user_b_id == b_id
                )
            ).first()
            if not match_exists:
                session.add(Match(user_a_id=a_id, user_b_id=b_id))
        session.commit()

        # Convert to response model before session closes
        return ProfileResponse.model_validate(profile, from_attributes=True)


@router.get("/user-profiles", response_model=List[ProfileResponse])
async def get_user_profiles():
    with Session(engine) as session:
        profiles = session.exec(select(Profile)).all()
        return [ProfileResponse.model_validate(p, from_attributes=True) for p in profiles]


@router.post("/{user_profile_id}/chat-completions", response_model=ChatResponse)
async def chat_with_profile(user_profile_id: int, payload: ChatRequest):
    # For demo: Just echo back a canned response incorporating the message.
    response_text = (
        f"(Demo) You said: '{payload.message}'. {user_profile_id} thinks you're interesting!"
    )
    return ChatResponse(response=response_text)


@router.get("/matches", response_model=List[ProfileResponse])
async def get_matches(profile_id: int):
    """Return matched profiles for given profile_id (no auth for demo)."""
    with Session(engine) as session:
        # find user id of profile
        profile = session.get(Profile, profile_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        # get matches where user is part
        matches = session.exec(
            select(Match).where(
                (Match.user_a_id == profile.user_id)
                | (Match.user_b_id == profile.user_id)
            )
        ).all()

        # gather other user ids
        other_user_ids = [
            m.user_b_id if m.user_a_id == profile.user_id else m.user_a_id for m in matches
        ]

        if not other_user_ids:
            return []

        profiles = session.exec(
            select(Profile).where(Profile.user_id.in_(other_user_ids))
        ).all()

        return [ProfileResponse.model_validate(p, from_attributes=True) for p in profiles] 