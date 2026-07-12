from datetime import UTC, datetime

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.recording import Recording, RecordingStatus


async def create_recording(
    recording_id: str, device_id: str, duration_seconds: float, storage_path: str
) -> None:
    async with AsyncSessionLocal() as session:
        session.add(
            Recording(
                id=recording_id,
                device_id=device_id,
                status=RecordingStatus.UPLOADED.value,
                duration_seconds=duration_seconds,
                storage_path=storage_path,
            )
        )
        await session.commit()


async def update_status(recording_id: str, status: RecordingStatus) -> None:
    async with AsyncSessionLocal() as session:
        recording = await session.get(Recording, recording_id)
        if recording is None:
            return
        recording.status = status.value
        recording.updated_at = datetime.now(UTC)
        await session.commit()


async def get_recording(recording_id: str) -> Recording | None:
    async with AsyncSessionLocal() as session:
        return await session.get(Recording, recording_id)


async def delete_recording(recording_id: str) -> None:
    """Deletes the recording row. Callers must delete dependent analysis_results
    first (recordings_repo has no FK-cascade to analysis_result) and remove the
    Storage object separately — this only touches the DB row.
    """
    async with AsyncSessionLocal() as session:
        recording = await session.get(Recording, recording_id)
        if recording is None:
            return
        await session.delete(recording)
        await session.commit()


async def list_by_device(device_id: str, limit: int = 20) -> list[Recording]:
    async with AsyncSessionLocal() as session:
        stmt = (
            select(Recording)
            .where(Recording.device_id == device_id)
            .order_by(Recording.created_at.desc())
            .limit(limit)
        )
        result = await session.execute(stmt)
        return list(result.scalars().all())
