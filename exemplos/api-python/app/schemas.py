from pydantic import BaseModel, EmailStr


class NovoUsuario(BaseModel):
    nome: str
    email: EmailStr
    senha: str


class AtualizarUsuario(BaseModel):
    nome: str | None = None
    email: EmailStr | None = None
    senha: str | None = None


class Usuario(BaseModel):
    id: int
    nome: str
    email: EmailStr
    criado_em: str


class Credenciais(BaseModel):
    email: EmailStr
    senha: str


class TokenResponse(BaseModel):
    token: str
