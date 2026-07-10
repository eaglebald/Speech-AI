from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.config import settings
from app.core.errors import ErrorCode


def get_client_identifier(request: Request) -> str:
    """Keys the daily quota off the Supabase-verified user id (set on
    request.state by the get_current_user_id dependency, which FastAPI
    resolves before this decorator's wrapped body runs) so it can't be reset
    by spoofing a client-supplied id. Falls back to remote IP for routes that
    don't require auth.
    """
    user_id = getattr(request.state, "user_id", None)
    if user_id:
        return f"user:{user_id}"
    return f"ip:{get_remote_address(request)}"


limiter = Limiter(key_func=get_client_identifier)

# 기획서 요구사항: 하루 최대 MAX_DAILY_RECORDINGS회 녹음/분석 요청만 허용 (Gemini 무료 티어 보호)
DAILY_RECORDING_LIMIT = f"{settings.MAX_DAILY_RECORDINGS}/day"


async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={
            "error": {
                "code": ErrorCode.RATE_LIMIT_EXCEEDED.value,
                "message": (
                    f"하루 녹음 가능 횟수({settings.MAX_DAILY_RECORDINGS}회)를 모두 사용했습니다. "
                    "내일 다시 시도해주세요."
                ),
            }
        },
    )
