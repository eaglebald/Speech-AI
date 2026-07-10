import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Query, Request, UploadFile

from app.core.auth import get_current_user_id
from app.core.rate_limit import DAILY_RECORDING_LIMIT, limiter
from app.repositories.analysis_repo import get_latest_result
from app.repositories.recordings_repo import create_recording, list_by_device
from app.schemas.recording import RecordingUploadResponse
from app.services import storage_service
from app.services.analysis_pipeline import run_analysis
from app.services.audio_validation import (
    validate_audio_duration,
    validate_audio_format,
    validate_file_size,
)

router = APIRouter()

VALID_PURPOSES = ("student", "job_interview_prep", "thesis_defense", "general_speaking")


@router.post("/recordings", response_model=RecordingUploadResponse)
@limiter.limit(DAILY_RECORDING_LIMIT)
async def upload_recording(
    request: Request,  # required by slowapi as first positional arg for @limiter.limit
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    language: str = Form("ko", description="분석 언어 — 'ko' 또는 'en' (Home 화면에서 녹음 전 선택)"),
    purpose: str = Form(
        "general_speaking",
        description="온보딩에서 선택한 연습 목적 — student/job_interview_prep/thesis_defense/general_speaking",
    ),
    name: str = Form("", description="온보딩에서 입력한 유저 이름 (선택, Gemini 개인화용)"),
    user_id: str = Depends(get_current_user_id),
):
    validate_audio_format(file)

    language = language if language in ("ko", "en") else "ko"
    purpose = purpose if purpose in VALID_PURPOSES else "general_speaking"

    raw_bytes = await file.read()
    validate_file_size(raw_bytes)
    duration_seconds = validate_audio_duration(raw_bytes)

    recording_id = str(uuid.uuid4())
    content_type = file.content_type or "audio/m4a"
    storage_path = await storage_service.upload_recording(recording_id, user_id, raw_bytes, content_type)

    await create_recording(recording_id, user_id, duration_seconds, storage_path)

    background_tasks.add_task(run_analysis, recording_id, raw_bytes, content_type, language, purpose, name)

    return RecordingUploadResponse(
        recording_id=recording_id,
        status="uploaded",
        duration_seconds=duration_seconds,
        uploaded_at=datetime.now(UTC),
    )


@router.get("/recordings")
async def list_recordings(limit: int = Query(20, le=50), user_id: str = Depends(get_current_user_id)):
    recordings = await list_by_device(user_id, limit)

    items = []
    for rec in recordings:
        latest = await get_latest_result(rec.id)
        result = latest.result_json if latest and latest.result_json else None
        items.append(
            {
                "recordingId": rec.id,
                "status": rec.status,
                "createdAt": rec.created_at.isoformat(),
                "durationSeconds": rec.duration_seconds,
                "globalScore": result.get("globalScore") if result else None,
                "statusLabel": result.get("statusLabel") if result else None,
                "summary": result.get("summary") if result else None,
            }
        )

    return {"items": items}
