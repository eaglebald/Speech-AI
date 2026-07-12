import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Query, Request, Response, UploadFile

from app.core.auth import get_current_user_id
from app.core.errors import AppError, ErrorCode
from app.core.rate_limit import DAILY_RECORDING_LIMIT, limiter
from app.repositories.analysis_repo import delete_by_recording, get_latest_result
from app.repositories.recordings_repo import create_recording, delete_recording, get_recording, list_by_device
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


@router.delete("/recordings/{recording_id}", status_code=204)
async def delete_recording_endpoint(recording_id: str, user_id: str = Depends(get_current_user_id)):
    recording = await get_recording(recording_id)
    if recording is None:
        raise AppError(ErrorCode.NOT_FOUND, "존재하지 않는 recording_id입니다.", status_code=404)
    if recording.device_id != user_id:
        raise AppError(
            ErrorCode.FORBIDDEN, "본인 소유의 recording만 삭제할 수 있습니다.", status_code=403
        )

    try:
        await storage_service.delete_recording(recording.storage_path)
    except Exception as exc:  # noqa: BLE001 — must not delete DB rows if the file might still exist
        raise AppError(
            ErrorCode.STORAGE_ERROR,
            "오디오 파일 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
            status_code=502,
        ) from exc

    # Child row first — analysis_results.recording_id has an FK to recordings.id
    # with no ON DELETE CASCADE, so deleting the parent first would violate it.
    await delete_by_recording(recording_id)
    await delete_recording(recording_id)

    return Response(status_code=204)
