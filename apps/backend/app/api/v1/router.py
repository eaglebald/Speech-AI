from fastapi import APIRouter

from app.api.v1 import analysis, health, recordings

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(recordings.router, tags=["recordings"])
api_router.include_router(analysis.router, tags=["analysis"])
