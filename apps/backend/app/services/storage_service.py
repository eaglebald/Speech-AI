import asyncio
import logging
import mimetypes

from app.core.config import settings
from app.db.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)

_bucket_ready = False


def _ensure_bucket() -> None:
    global _bucket_ready
    if _bucket_ready:
        return
    client = get_supabase_client()
    try:
        client.storage.create_bucket(settings.SUPABASE_BUCKET, options={"public": False})
        logger.info("Created Supabase Storage bucket '%s'", settings.SUPABASE_BUCKET)
    except Exception as exc:  # noqa: BLE001 — bucket already existing is the common case
        logger.debug("Bucket ensure skipped/failed (likely already exists): %s", exc)
    _bucket_ready = True


async def upload_recording(recording_id: str, device_id: str, raw_bytes: bytes, content_type: str | None) -> str:
    """Uploads the raw audio bytes to Supabase Storage and returns the object path.

    supabase-py's storage client is synchronous, so the call is offloaded to a
    worker thread to avoid blocking the event loop.
    """
    ext = mimetypes.guess_extension(content_type or "") or ".m4a"
    path = f"{device_id}/{recording_id}{ext}"

    client = get_supabase_client()

    def _upload() -> None:
        _ensure_bucket()
        client.storage.from_(settings.SUPABASE_BUCKET).upload(
            path,
            raw_bytes,
            {"content-type": content_type or "application/octet-stream"},
        )

    await asyncio.to_thread(_upload)
    return path


async def get_signed_url(storage_path: str, expires_in_seconds: int = 3600) -> str | None:
    """Short-lived signed URL so the mobile app can stream the recording for
    playback without the Storage bucket being public."""
    client = get_supabase_client()

    def _sign() -> str | None:
        response = client.storage.from_(settings.SUPABASE_BUCKET).create_signed_url(
            storage_path, expires_in_seconds
        )
        return response.get("signedURL") or response.get("signedUrl")

    try:
        return await asyncio.to_thread(_sign)
    except Exception:  # noqa: BLE001 — missing/movable file shouldn't break the whole response
        logger.warning("Failed to create signed URL for %s", storage_path, exc_info=True)
        return None
