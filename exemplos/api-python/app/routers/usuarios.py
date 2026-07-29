from fastapi import APIRouter, Depends

from app import models
from app.dependencies import obter_usuario_atual
from app.errors import ApiError
from app.schemas import AtualizarUsuario, NovoUsuario, Usuario
from app.security import gerar_hash

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"],
    dependencies=[Depends(obter_usuario_atual)],  # aplica a TODAS as rotas deste router
)


@router.get("", response_model=list[Usuario])
def listar():
    return models.listar()


@router.get("/{usuario_id}", response_model=Usuario)
def buscar(usuario_id: int):
    usuario = models.buscar_por_id(usuario_id)
    if not usuario:
        raise ApiError(404, "NOT_FOUND", "Usuário não encontrado.")
    return usuario


@router.put("/{usuario_id}", response_model=Usuario)
def substituir(usuario_id: int, dados: NovoUsuario):
    if not models.buscar_por_id(usuario_id):
        raise ApiError(404, "NOT_FOUND", "Usuário não encontrado.")

    outro = models.buscar_por_email(dados.email)
    if outro and outro["id"] != usuario_id:
        raise ApiError(409, "EMAIL_IN_USE", "Este e-mail já está cadastrado.")

    senha_hash = gerar_hash(dados.senha)
    return models.atualizar(usuario_id, dados.nome, dados.email, senha_hash)


@router.patch("/{usuario_id}", response_model=Usuario)
def atualizar_parcial(usuario_id: int, dados: AtualizarUsuario):
    if not models.buscar_por_id(usuario_id):
        raise ApiError(404, "NOT_FOUND", "Usuário não encontrado.")

    if dados.email:
        outro = models.buscar_por_email(dados.email)
        if outro and outro["id"] != usuario_id:
            raise ApiError(409, "EMAIL_IN_USE", "Este e-mail já está cadastrado.")

    senha_hash = gerar_hash(dados.senha) if dados.senha else None
    return models.atualizar_parcial(usuario_id, dados.nome, dados.email, senha_hash)


@router.delete("/{usuario_id}", status_code=204)
def remover(usuario_id: int):
    if not models.remover(usuario_id):
        raise ApiError(404, "NOT_FOUND", "Usuário não encontrado.")
