from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.analysis_result import AnalysisResult


async def save_result(recording_id: str, result_json: dict | None, error_message: str | None) -> None:
    async with AsyncSessionLocal() as session:
        session.add(
            AnalysisResult(recording_id=recording_id, result_json=result_json, error_message=error_message)
        )
        await session.commit()


async def get_latest_result(recording_id: str) -> AnalysisResult | None:
    async with AsyncSessionLocal() as session:
        stmt = (
            select(AnalysisResult)
            .where(AnalysisResult.recording_id == recording_id)
            .order_by(AnalysisResult.created_at.desc())
            .limit(1)
        )
        row = await session.execute(stmt)
        return row.scalar_one_or_none()
