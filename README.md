# 오디오 기반 AI 스피치 코치 앱 (SpeechAi)

모노레포: `apps/mobile` (Expo/React Native + TypeScript) · `apps/backend` (FastAPI + Gemini 2.5 Flash + Supabase)

## 구조

```
apps/
  mobile/    # Expo Router 앱 (Recording / Active Recording / Analysis Loading / Feedback)
  backend/   # FastAPI 서버 (업로드, 검증, rate limiting, Gemini 분석 파이프라인)
```

## 핵심 정책 (양쪽 동기화 필요)

| 항목 | 값 | 위치 |
| --- | --- | --- |
| 권장 녹음 길이 | 1~2분 | `backend/app/core/config.py`, `mobile/src/constants/recording.ts` |
| 서버 하드 제한 | 2분 (120초) — 초과 시 `DURATION_EXCEEDED` | 동일 |
| 일일 녹음 한도 | 10회/디바이스 — 초과 시 `RATE_LIMIT_EXCEEDED` (429) | `backend/app/core/rate_limit.py` |
| 업로드 최대 용량 | 10MB | `backend/app/core/config.py` |

서버가 모든 값을 실제로 강제하며, 클라이언트 상수는 UX(경고/자동 종료 안내)용입니다.

## Backend 실행

```bash
cd apps/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # GEMINI_API_KEY, SUPABASE_* 값 채우기
uvicorn app.main:app --reload --port 8000
```

- `POST /api/v1/recordings` — multipart 업로드 (`file`, `device_id`). 디바이스당 하루 10회 제한(slowapi), 2분 초과/형식 불일치 시 표준 에러코드 반환.
- `GET /api/v1/analysis/{recording_id}` — 분석 파이프라인 연결 전까지 501 스텁.
- `GET /api/v1/health` — 헬스체크.

### 표준 에러 응답

```json
{ "error": { "code": "DURATION_EXCEEDED", "message": "녹음 길이는 최대 2분까지 허용됩니다 (현재 150초)." } }
```

코드 목록: `INVALID_AUDIO`, `FILE_SIZE_EXCEEDED`, `DURATION_EXCEEDED`, `RATE_LIMIT_EXCEEDED`, `API_TIMEOUT`, `NETWORK_ERROR`, `ANALYSIS_FAILED`, `NOT_FOUND`.

## Mobile 실행

```bash
cd apps/mobile
npm install
cp .env.example .env   # EXPO_PUBLIC_API_BASE_URL만 설정 (시크릿 없음)
npx expo start
```

iOS 시뮬레이터(`i`), Android 에뮬레이터(`a`), 또는 Expo Go로 실기기 스캔.

## 보안 메모

- `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`는 `apps/backend/.env`에만 존재하며 모바일 번들에는 절대 포함되지 않습니다.
- 모바일 `.env`는 `EXPO_PUBLIC_API_BASE_URL`(공개 정보)만 가집니다 — `EXPO_PUBLIC_*` 변수는 JS 번들에 그대로 인라인되므로 시크릿을 넣지 않습니다.
- Rate limiting은 `X-Device-Id` 헤더(없으면 IP) 기준으로 동작 — 인증 시스템 도입 시 사용자 ID 기준으로 교체 권장.

## 다음 단계 (Step 3)

- 디자인 캡처본 기반 UI 컴포넌트 구현 (`ScoreGauge`, `Waveform`, 4대 영역 카드)
- `gemini_service.py` + `analysis_pipeline.py` 실제 연동
- Supabase Storage/Postgres 연동 (`storage_service.py`의 TODO 해소)
