from fastapi import APIRouter

from app.core.errors import AppError, ErrorCode
from app.repositories.analysis_repo import get_latest_result
from app.repositories.recordings_repo import get_recording
from app.services.storage_service import get_signed_url

router = APIRouter()


@router.get("/analysis/{recording_id}")
async def get_analysis_status(recording_id: str):
    recording = await get_recording(recording_id)
    if recording is None:
        raise AppError(ErrorCode.NOT_FOUND, "존재하지 않는 recording_id입니다.", status_code=404)

    latest = await get_latest_result(recording_id)
    audio_url = await get_signed_url(recording.storage_path)

    return {
        "recordingId": recording.id,
        "status": recording.status,
        "result": latest.result_json if latest else None,
        "error": latest.error_message if latest else None,
        "audioUrl": audio_url,
    }
