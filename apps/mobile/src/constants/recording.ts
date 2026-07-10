// Mirrors apps/backend/app/core/config.py — keep these two in sync.
// The backend re-validates all of these server-side; these constants only drive
// client-side UX (timer warnings, auto-stop, friendly messaging).
export const RECOMMENDED_MIN_SECONDS = 60;
export const RECOMMENDED_MAX_SECONDS = 120;
export const MAX_RECORDING_SECONDS = 120; // 2분 하드 제한 — 도달 시 자동 종료
export const MAX_DAILY_RECORDINGS = 10;
