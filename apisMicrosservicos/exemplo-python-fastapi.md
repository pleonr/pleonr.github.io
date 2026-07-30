---
title: "APIs e Microsserviços: Aula 06"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Exemplo Prático: Python + FastAPI

<p class="lesson-subtitle">A mesma API de usuários da Aula 05, agora em Python: validação automática, dependências como middleware e documentação de graça</p>

Vamos construir a **mesma** API de cadastro de usuários da [Aula 05](/apisMicrosservicos/exemplo-node-express), agora com [FastAPI](https://fastapi.tiangolo.com/): mesmas rotas, mesmos códigos de erro, mesmo banco SQLite em arquivo, mesma autenticação por JWT.

## O que vamos construir

| Método | Rota | Autenticado? | Descrição |
| --- | --- | --- | --- |
| `POST` | `/auth/registrar` | Não | Cria um novo usuário (senha criptografada) |
| `POST` | `/auth/login` | Não | Valida credenciais e devolve um token JWT |
| `GET` | `/usuarios` | Sim | Lista todos os usuários |
| `GET` | `/usuarios/{id}` | Sim | Busca um usuário pelo id |
| `PUT` | `/usuarios/{id}` | Sim | Substitui nome, e-mail e senha |
| `PATCH` | `/usuarios/{id}` | Sim | Atualiza só os campos enviados |
| `DELETE` | `/usuarios/{id}` | Sim | Remove um usuário |

## Configurando o projeto

```bash
mkdir api-usuarios-py
cd api-usuarios-py
python -m venv venv
source venv/bin/activate  # no Windows: venv\Scripts\activate

pip install fastapi uvicorn pyjwt bcrypt "pydantic[email]"
```

O banco (`sqlite3`) já vem na biblioteca padrão do Python, sem instalar nada. `pydantic[email]` traz o validador de formato de e-mail usado no schema. O suporte a CORS (`CORSMiddleware`) já vem embutido no FastAPI (via Starlette), sem precisar instalar nada a mais.

## Organizando o projeto

A mesma separação em camadas da Aula 05, com nomes que soam mais "Python":

```
api-usuarios-py/
└── app/
    ├── db.py                # conexão SQLite + schema
    ├── models.py            # funções de acesso a dados (camada "M")
    ├── schemas.py            # modelos Pydantic: validação de entrada e saída
    ├── security.py           # hashing de senha + geração/verificação de JWT
    ├── dependencies.py       # "middleware" de autenticação, via Depends
    ├── errors.py              # exceção ApiError
    ├── error_handlers.py      # "middleware" de tratamento de erros, via exception_handler
    ├── routers/
    │   ├── auth.py            # registrar/login (camada "C")
    │   └── usuarios.py       # CRUD de usuários (camada "C")
    └── main.py                 # cria o app, inclui routers, registra handlers de erro
```

## Modelando os dados com Pydantic

```python
# app/schemas.py
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
```

Assim como no exemplo em Express, `Usuario` nunca tem um campo `senha`: o hash não deve sair do model em uma resposta.

## Banco de dados: SQLite em arquivo

```python
# app/db.py
import sqlite3

DB_PATH = "usuarios.db"

conn = sqlite3.connect(DB_PATH, check_same_thread=False)
conn.row_factory = sqlite3.Row


def init_db():
    conn.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha_hash TEXT NOT NULL,
            criado_em TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    conn.commit()
```

`check_same_thread=False` permite reusar a mesma conexão entre as *threads* que o Uvicorn usa para atender requisições síncronas. `init_db()` roda uma vez, na inicialização do app (mais abaixo).

## Model: acesso aos dados

```python
# app/models.py
from app.db import conn


def criar(nome: str, email: str, senha_hash: str) -> dict:
    cursor = conn.execute(
        "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
        (nome, email, senha_hash),
    )
    conn.commit()
    return buscar_por_id(cursor.lastrowid)


def listar() -> list[dict]:
    linhas = conn.execute("SELECT id, nome, email, criado_em FROM usuarios").fetchall()
    return [dict(linha) for linha in linhas]


def buscar_por_id(usuario_id: int) -> dict | None:
    linha = conn.execute(
        "SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?", (usuario_id,)
    ).fetchone()
    return dict(linha) if linha else None


def buscar_por_email(email: str) -> dict | None:
    linha = conn.execute("SELECT * FROM usuarios WHERE email = ?", (email,)).fetchone()
    return dict(linha) if linha else None


def atualizar(usuario_id: int, nome: str, email: str, senha_hash: str) -> dict:
    conn.execute(
        "UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?",
        (nome, email, senha_hash, usuario_id),
    )
    conn.commit()
    return buscar_por_id(usuario_id)


def atualizar_parcial(usuario_id: int, nome: str | None, email: str | None, senha_hash: str | None) -> dict:
    atual = conn.execute("SELECT * FROM usuarios WHERE id = ?", (usuario_id,)).fetchone()
    conn.execute(
        "UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?",
        (nome or atual["nome"], email or atual["email"], senha_hash or atual["senha_hash"], usuario_id),
    )
    conn.commit()
    return buscar_por_id(usuario_id)


def remover(usuario_id: int) -> bool:
    cursor = conn.execute("DELETE FROM usuarios WHERE id = ?", (usuario_id,))
    conn.commit()
    return cursor.rowcount > 0
```

Note que `buscar_por_email`, usado para checar credenciais no login, é o único que seleciona `*` (incluindo `senha_hash`); os demais listam colunas explicitamente para nunca vazar o hash.

## Senhas e JWT

```python
# app/security.py
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

JWT_SECRET = "segredo-de-desenvolvimento"
JWT_ALGORITHM = "HS256"


def gerar_hash(senha: str) -> str:
    return bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()


def verificar_senha(senha: str, senha_hash: str) -> bool:
    return bcrypt.checkpw(senha.encode(), senha_hash.encode())


def gerar_token(usuario: dict) -> str:
    payload = {
        "sub": str(usuario["id"]),
        "nome": usuario["nome"],
        "email": usuario["email"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decodificar_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
```

::: tip Por que `str(usuario["id"])`?
A especificação do JWT (RFC 7519) exige que a claim `sub` seja uma string, e o **PyJWT** valida isso na decodificação: um `sub` numérico faz `jwt.decode` falhar com `InvalidSubjectError`, mesmo com assinatura e expiração corretas. `jsonwebtoken` (Node) não é tão rígido, por isso esse detalhe passa despercebido vindo da Aula 05.
:::

## O erro de negócio

```python
# app/errors.py
class ApiError(Exception):
    def __init__(self, status_code: int, code: str, message: str):
        self.status_code = status_code
        self.code = code
        self.message = message
```

## "Middleware" de autenticação: uma dependência do FastAPI

O Express (e o Gin, e o Phoenix) resolvem autenticação com um **middleware**: uma função que roda antes da rota e pode interromper a requisição. O FastAPI resolve o mesmo problema com **injeção de dependência** (`Depends`): uma função que o FastAPI executa antes do *handler*, cujo resultado é injetado como parâmetro. É o mesmo papel, só que declarado de forma diferente.

```python
# app/dependencies.py
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
```

`HTTPBearer` já sabe extrair o token do header `Authorization: Bearer <token>`; `auto_error=False` evita que ele mesmo devolva um erro genérico, deixando nossa função lançar o `ApiError` no formato padrão da API.

## Middleware de tratamento de erros: *exception handlers*

O FastAPI também não usa uma cadeia de middlewares para tratar erros; ele usa **handlers de exceção** registrados no `app`. O efeito é o mesmo do `errorHandler` do Express: qualquer exceção lançada em qualquer parte do código passa por aqui antes de virar uma resposta.

```python
# app/error_handlers.py
import logging

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.errors import ApiError

logger = logging.getLogger("uvicorn.error")


def registrar_error_handlers(app):
    @app.exception_handler(ApiError)
    async def handle_api_error(request: Request, exc: ApiError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": exc.code, "message": exc.message}},
        )

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, exc: RequestValidationError):
        campo = exc.errors()[0]["loc"][-1]
        return JSONResponse(
            status_code=400,
            content={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": f"O campo '{campo}' é inválido ou está ausente.",
                }
            },
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception):
        logger.exception("Erro não tratado")
        return JSONResponse(
            status_code=500,
            content={"error": {"code": "INTERNAL_ERROR", "message": "Erro interno do servidor."}},
        )
```

::: tip Por que sobrescrever o erro de validação padrão?
Por padrão, o FastAPI responde `422 Unprocessable Entity` com um formato próprio quando um `NovoUsuario` chega inválido. Isso é ótimo isoladamente, mas quebra o contrato `{ "error": { "code", "message" } }` que a API segue em todo o resto (e nas outras três linguagens). O handler de `RequestValidationError` acima traduz o erro nativo do FastAPI para o mesmo formato, mantendo a API consistente consigo mesma.
:::

## Controller de autenticação: registrar e login

```python
# app/routers/auth.py
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
```

O parâmetro `dados: NovoUsuario` já diz ao FastAPI para ler e validar o corpo da requisição, o equivalente ao `req.body` do Express, mas validado antes mesmo da função rodar (e sem `if not dados.nome: ...` manual).

## Controller de usuários: CRUD

```python
# app/routers/usuarios.py
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
```

`dependencies=[Depends(obter_usuario_atual)]` no `APIRouter` é o equivalente direto do `router.use(auth)` da Aula 05: aplica a checagem de token a todas as rotas do router, sem repetir em cada função.

## Montando a aplicação

```python
# app/main.py
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import init_db
from app.error_handlers import registrar_error_handlers
from app.routers import auth, usuarios

ALLOWED_ORIGINS = [
    "https://leon.dev.br",
    "https://www.leon.dev.br",
    "http://localhost:5173",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="API de Usuários", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)

registrar_error_handlers(app)
```

## CORS: liberando o acesso do navegador

O mesmo problema da Aula 05 se aplica aqui: sem liberar CORS, uma SPA rodando em `http://localhost:5173` (ou publicada em `https://leon.dev.br`) que tenta chamar essa API recebe um erro de `Access-Control-Allow-Origin` ausente, bloqueado pelo próprio navegador antes mesmo da requisição chegar ao servidor.

O `CORSMiddleware` do FastAPI é o equivalente direto do pacote `cors` do Express: `allow_origins` funciona como a lista branca (`ALLOWED_ORIGINS`) do exemplo em Node, `allow_credentials=True` libera o envio do header `Authorization` entre origens diferentes, e `allow_methods`/`allow_headers` abertos (`["*"]`) evitam ter que listar manualmente cada verbo HTTP e header customizado usado pela API.

::: tip `allow_origins` não aceita `"*"` com `allow_credentials=True`
Assim como no Express, o navegador rejeita a combinação de um `Access-Control-Allow-Origin: *` genérico com `credentials: true`. Por isso `allow_origins` precisa ser uma lista explícita de origens quando `allow_credentials=True` está ativo, nunca um curinga.
:::

## Rodando o servidor

```bash
uvicorn app.main:app --reload
```

## Documentação automática

Sem escrever nenhuma linha a mais, o FastAPI gera documentação interativa a partir dos schemas Pydantic já declarados, incluindo um botão "Authorize" para colar o token JWT e testar as rotas protegidas direto pelo navegador:

- `http://localhost:8000/docs`: Swagger UI.
- `http://localhost:8000/redoc`: documentação em formato Redoc.
- `http://localhost:8000/openapi.json`: a especificação OpenAPI crua (ver [Aula 04](/apisMicrosservicos/documentacao)).

## Testando com `curl`

```bash
# Registrar
curl -X POST http://localhost:8000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Silva", "email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Login (guarde o token retornado)
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Listar usuários (rota protegida)
curl http://localhost:8000/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Atualizar parcialmente
curl -X PATCH http://localhost:8000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana S. Souza"}'

# Remover
curl -X DELETE http://localhost:8000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

::: tip Comparando com o exemplo em Node/Express
A arquitetura é a mesma (rotas → controllers → models, mais um middleware de autenticação e um de erros), mas o FastAPI resolve as duas transversais de um jeito mais declarativo: autenticação vira uma dependência (`Depends`) em vez de um `router.use(...)`, e o tratamento de erros vira `@app.exception_handler(...)` em vez de uma função de 4 argumentos no fim da cadeia. O resultado observável pelo cliente HTTP, porém, é idêntico.
:::

::: warning Isso é um exemplo didático
O segredo do JWT está fixo no código só para facilitar o teste local; em produção ele precisa vir de uma variável de ambiente/segredo gerenciado. Políticas de senha, expiração/renovação de token e *rate limiting* no login ficaram de fora para manter o foco na arquitetura.
:::

[Testar esta API ao vivo →](/apisMicrosservicos/exemplos-api)

---

**Próxima página:** [Aula 07: Exemplo Prático: Go + Gin →](/apisMicrosservicos/exemplo-golang-gin)

<style scoped src="./shared.css"></style>
