import io

from fastapi import UploadFile
from mutagen import File as MutagenFile

from app.core.config import settings
from app.core.errors import AppError, ErrorCode

ALLOWED_EXTENSIONS = {".m4a", ".mp3", ".mp4", ".aac", ".wav"}
ALLOWED_CONTENT_TYPES = {
    "audio/m4a",
    "audio/x-m4a",
    "audio/mp4",
    "audio/mpeg",
    "audio/aac",
    "audio/wav",
    "audio/x-wav",
}

# 기획서 1.1.2: 1~2분 권장, 2분 초과 시 서버에서 하드 거부 (MAX_RECORDING_SECONDS=120)
MIN_AUDIO_SECONDS = 1.0


def validate_audio_format(file: UploadFile) -> None:
    filename = (file.filename or "").lower()
    ext = filename[filename.rfind(".") :] if "." in filename else ""

    if ext not in ALLOWED_EXTENSIONS:
        raise AppError(
            ErrorCode.INVALID_AUDIO,
            f"지원하지 않는 파일 형식입니다 ({ext or 'unknown'}). m4a/mp3/aac/wav만 허용됩니다.",
        )

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise AppError(
            ErrorCode.INVALID_AUDIO,
            f"지원하지 않는 콘텐츠 타입입니다 ({file.content_type}).",
        )


def validate_file_size(raw_bytes: bytes) -> None:
    size_mb = len(raw_bytes) / (1024 * 1024)
    if size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise AppError(
            ErrorCode.FILE_SIZE_EXCEEDED,
            f"파일 크기가 너무 큽니다 ({size_mb:.1f}MB). 최대 {settings.MAX_UPLOAD_SIZE_MB}MB까지 허용됩니다.",
        )


def validate_audio_duration(raw_bytes: bytes) -> float:
    """Decodes the actual container/codec metadata via mutagen — never trusts the
    client-reported duration, since that value only drives client-side UI guidance.
    """
    try:
        audio = MutagenFile(io.BytesIO(raw_bytes))
    except Exception as exc:  # noqa: BLE001 — any decode failure means an unusable file
        raise AppError(
            ErrorCode.INVALID_AUDIO,
            "오디오 파일을 읽을 수 없습니다. 손상되었거나 지원하지 않는 형식입니다.",
        ) from exc

    if audio is None or audio.info is None or not hasattr(audio.info, "length"):
        raise AppError(
            ErrorCode.INVALID_AUDIO,
            "오디오 파일에서 길이 정보를 확인할 수 없습니다.",
        )

    duration = float(audio.info.length)

    if duration < MIN_AUDIO_SECONDS:
        raise AppError(
            ErrorCode.INVALID_AUDIO,
            "녹음이 너무 짧습니다. 다시 녹음해주세요.",
        )

    if duration > settings.MAX_RECORDING_SECONDS:
        raise AppError(
            ErrorCode.DURATION_EXCEEDED,
            f"녹음 길이는 최대 {settings.MAX_RECORDING_SECONDS // 60}분까지 허용됩니다 "
            f"(현재 {duration:.0f}초).",
        )

    return duration
