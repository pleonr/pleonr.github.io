from fastapi import APIRouter, Response

from app import models
from app.errors import ApiError
from app.schemas import Credenciais, NovoUsuario, TokenResponse, Usuario
from app.security import gerar_hash, gerar_token, verificar_senha

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/registrar", response_model=Usuario, status_code=201)
def registrar(dados: NovoUsuario, response: Response):
    if models.buscar_por_email(dados.email):
        raise ApiError(409, "EMAIL_IN_USE", "Este e-mail já está cadastrado.")

    senha_hash = gerar_hash(dados.senha)
    usuario = models.criar(dados.nome, dados.email, senha_hash)

    response.headers["Location"] = f"/usuarios/{usuario['id']}"
    return usuario


@router.post("/login", response_model=TokenResponse)
def login(credenciais: Credenciais):
    usuario = models.buscar_por_email(credenciais.email)
    valido = usuario and verificar_senha(credenciais.senha, usuario["senha_hash"])

    if not valido:
        raise ApiError(401, "INVALID_CREDENTIALS", "E-mail ou senha inválidos.")

    return {"token": gerar_token(usuario)}
