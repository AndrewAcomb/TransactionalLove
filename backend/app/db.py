import os
from contextlib import contextmanager
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
# echo=False to keep test output clean; switch to True for debugging SQL.
engine = create_engine(DATABASE_URL, echo=False)


def init_db() -> None:
    """Import models and create database tables if they do not exist."""
    from . import models  # noqa: F401  # Registers models on metadata

    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session():
    """Context-manager style session helper (mainly for scripts/tests)."""
    with Session(engine) as session:
        yield session 