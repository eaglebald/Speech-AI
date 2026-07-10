import jwt
from fastapi import Request, status

from app.core.config import settings
from app.core.errors import AppError, ErrorCode

# Supabase projects created since the asymmetric-JWT rollout sign tokens with
# a per-project ES256 key rather than a shared HS256 secret. PyJWKClient
# fetches/caches the public signing keys from Supabase's JWKS endpoint, so
# there's no shared secret to store on the backend at all.
_jwks_client = jwt.PyJWKClient(f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json")


def verify_jwt(token: str) -> str:
    """Verifies a Supabase Auth JWT and returns its `sub` (the auth.users id).

    This is the only identifier the API trusts for ownership — it's signed by
    Supabase, unlike a client-supplied device_id, so it can't be forged.
    """
    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
        )
    except jwt.PyJWTError as exc:
        raise AppError(
            ErrorCode.UNAUTHORIZED, "인증에 실패했습니다. 앱을 재시작해주세요.", status.HTTP_401_UNAUTHORIZED
        ) from exc
    return payload["sub"]


def get_current_user_id(request: Request) -> str:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise AppError(ErrorCode.UNAUTHORIZED, "인증 토큰이 필요합니다.", status.HTTP_401_UNAUTHORIZED)

    user_id = verify_jwt(auth_header.removeprefix("Bearer "))
    # Read by the rate limiter's key_func — Depends() resolves before slowapi's
    # decorator runs the route body, so this is set by the time it's read.
    request.state.user_id = user_id
    return user_id
