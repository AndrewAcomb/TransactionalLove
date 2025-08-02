from sqlmodel import Session, select

from app.db import engine, init_db
from app.models import User


def test_create_user():
    # Ensure tables exist
    init_db()

    import uuid

    unique_email = f"test_{uuid.uuid4().hex}@example.com"

    with Session(engine) as session:
        new_user = User(email=unique_email, hashed_password="hashed")
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        assert new_user.id is not None

        stmt = select(User).where(User.email == unique_email)
        result = session.exec(stmt).first()
        assert result is not None
        assert result.id == new_user.id 