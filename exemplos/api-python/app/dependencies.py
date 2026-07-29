from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWTError

from app.errors import ApiError
from app.security import decodificar_token

bearer_scheme = HTTPBearer(auto_error=False)


def obter_usuario_atual(
    credenciais: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict:
    if credenciais is None:
        raise ApiError(401, "UNAUTHORIZED", "Token ausente ou inválido.")

    try:
        return decodificar_token(credenciais.credentials)
    except PyJWTError:
        raise ApiError(401, "UNAUTHORIZED", "Token ausente ou inválido.")
