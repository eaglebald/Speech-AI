from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENV: str = "development"

    # Gemini (Google GenAI SDK) — server-side only. Never expose to the mobile client/bundle.
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Supabase — service_role key bypasses RLS and must stay server-side only.
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_BUCKET: str = "recordings"
    DATABASE_URL: str

    # Recording limits (기획서 1.1.2: 권장 1~2분 / 서버단 하드 캡 2분)
    RECOMMENDED_MIN_SECONDS: int = 60
    RECOMMENDED_MAX_SECONDS: int = 120
    MAX_RECORDING_SECONDS: int = 120

    # Abuse / cost control (Gemini 무료 티어 보호)
    MAX_DAILY_RECORDINGS: int = 10
    MAX_UPLOAD_SIZE_MB: int = 10

    ALLOWED_ORIGINS: list[str] = ["*"]


settings = Settings()
