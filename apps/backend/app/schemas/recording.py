from datetime import datetime

from pydantic import BaseModel, Field


class RecordingUploadResponse(BaseModel):
    recording_id: str
    status: str = Field(description="'uploaded' | 'analyzing' | 'failed'")
    duration_seconds: float
    uploaded_at: datetime


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail
