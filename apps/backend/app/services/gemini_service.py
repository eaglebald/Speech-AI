import json
from functools import lru_cache

from google import genai
from google.genai import types

from app.core.config import settings
from app.core.errors import AppError, ErrorCode
from app.prompts.speech_analysis_v2 import build_analysis_instructions
from app.schemas.analysis import SpeechAnalysisResult


@lru_cache
def _get_client() -> genai.Client:
    return genai.Client(api_key=settings.GEMINI_API_KEY)


async def analyze_speech_audio(
    audio_bytes: bytes,
    mime_type: str,
    language: str = "ko",
    purpose: str = "general_speaking",
    name: str = "",
) -> dict:
    client = _get_client()
    instructions = build_analysis_instructions(language, purpose, name)

    try:
        response = await client.aio.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=[
                types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                instructions,
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=SpeechAnalysisResult,
            ),
        )
    except Exception as exc:  # noqa: BLE001 — surface every Gemini failure as a standardized AppError
        raise AppError(
            ErrorCode.ANALYSIS_FAILED,
            "Gemini 분석 요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
            status_code=502,
        ) from exc

    # response.parsed gives us an already-validated SpeechAnalysisResult when the SDK
    # supports it; fall back to manual json + validation if it doesn't come back parsed.
    parsed = getattr(response, "parsed", None)
    if isinstance(parsed, SpeechAnalysisResult):
        return parsed.model_dump()

    if not response.text:
        raise AppError(ErrorCode.ANALYSIS_FAILED, "Gemini 응답이 비어 있습니다.", status_code=502)

    try:
        raw = json.loads(response.text)
        return SpeechAnalysisResult.model_validate(raw).model_dump()
    except (json.JSONDecodeError, ValueError) as exc:
        raise AppError(
            ErrorCode.ANALYSIS_FAILED,
            "Gemini 응답을 파싱하는 데 실패했습니다.",
            status_code=502,
        ) from exc
