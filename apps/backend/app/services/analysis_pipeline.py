import logging

from app.core.errors import AppError
from app.models.recording import RecordingStatus
from app.repositories.analysis_repo import save_result
from app.repositories.recordings_repo import update_status
from app.services import gemini_service

logger = logging.getLogger(__name__)


async def run_analysis(
    recording_id: str,
    audio_bytes: bytes,
    mime_type: str,
    language: str = "ko",
    purpose: str = "general_speaking",
    name: str = "",
) -> None:
    """Runs as a FastAPI BackgroundTask after the upload response has already
    been sent — persists progress to Postgres so the client can poll
    GET /api/v1/analysis/{id} for status."""
    await update_status(recording_id, RecordingStatus.ANALYZING)
    try:
        result = await gemini_service.analyze_speech_audio(audio_bytes, mime_type, language, purpose, name)
        await save_result(recording_id, result, None)
        await update_status(recording_id, RecordingStatus.COMPLETED)
    except AppError as exc:
        logger.warning("Analysis failed for %s: %s", recording_id, exc.message)
        await save_result(recording_id, None, exc.message)
        await update_status(recording_id, RecordingStatus.FAILED)
    except Exception as exc:  # noqa: BLE001 — background task, must never raise unhandled
        logger.exception("Unexpected analysis failure for %s", recording_id)
        await save_result(recording_id, None, str(exc))
        await update_status(recording_id, RecordingStatus.FAILED)
