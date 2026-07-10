from enum import StrEnum

from fastapi import Request, status
from fastapi.responses import JSONResponse


class ErrorCode(StrEnum):
    INVALID_AUDIO = "INVALID_AUDIO"
    FILE_SIZE_EXCEEDED = "FILE_SIZE_EXCEEDED"
    DURATION_EXCEEDED = "DURATION_EXCEEDED"
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
    API_TIMEOUT = "API_TIMEOUT"
    NETWORK_ERROR = "NETWORK_ERROR"
    ANALYSIS_FAILED = "ANALYSIS_FAILED"
    NOT_FOUND = "NOT_FOUND"
    UNAUTHORIZED = "UNAUTHORIZED"


class AppError(Exception):
    """Standardized application error. Raise this anywhere in services/endpoints;
    `app_error_handler` converts it into the wire format every client error case shares.
    """

    def __init__(self, code: ErrorCode, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code.value, "message": exc.message}},
    )
