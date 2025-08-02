from fastapi import FastAPI
from .db import init_db
from app.routers.user_profiles import router as profiles_router

app = FastAPI()


@app.on_event("startup")
def _startup() -> None:
    init_db()


@app.get("/")
async def root():
    return {"status": "ok"}

app.include_router(profiles_router) 