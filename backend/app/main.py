from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

from app.db.base import Base
from app.db.session import engine
import app.models 

from app.routers.auth import router as auth_router
from app.routers.facilities import router as facilities_router
from app.routers.recommendations import router as recommendations_router
from app.routers.reservations import router as reservations_router
from app.routers.users import router as users_router
from app.routers.admin import router as admin_router
from app.services.scheduler import send_upcoming_reservation_reminders

scheduler = BackgroundScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup
    Base.metadata.create_all(bind=engine)

    # Start reminder scheduler (every 10 minutes)
    scheduler.add_job(
        send_upcoming_reservation_reminders,
        "interval",
        minutes=10,
        id="reservation_reminders",
        replace_existing=True,
    )
    scheduler.start()

    yield

    # Shutdown scheduler on app stop
    scheduler.shutdown(wait=False)


app = FastAPI(
    title="Sport Reservation API",
    description="Backend API for sport facility reservations",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(facilities_router)
app.include_router(recommendations_router)
app.include_router(reservations_router)
app.include_router(users_router)
app.include_router(admin_router)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Sport Reservation API działa"}