# API de Usuários — Python + FastAPI

Implementação da API de cadastro de usuários com Python, FastAPI, SQLite (via `sqlite3` da biblioteca padrão) e autenticação JWT. Código completo e explicado passo a passo em [Aula 06](https://pleonr.github.io/apisMicrosservicos/exemplo-python-fastapi).

## Pré-requisitos

- Python 3.11 ou mais recente

## Instalação e execução

```bash
cd exemplos/api-python
python -m venv venv
source venv/bin/activate  # no Windows: venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

O servidor sobe em `http://localhost:8000`. Na primeira execução, um arquivo `usuarios.db` é criado automaticamente na raiz desta pasta (a tabela `usuarios` é criada sozinha, se ainda não existir). `--reload` reinicia o servidor a cada alteração no código, útil durante o desenvolvimento.

## Documentação automática

Com o servidor rodando, o FastAPI gera documentação interativa (com botão "Authorize" para colar o token JWT):

- `http://localhost:8000/docs` — Swagger UI
- `http://localhost:8000/redoc` — Redoc

## Variáveis de ambiente (opcionais)

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `JWT_SECRET` | `segredo-de-desenvolvimento` | Segredo usado para assinar/validar tokens JWT |
| `DB_PATH` | `./usuarios.db` | Caminho do arquivo SQLite |

```bash
JWT_SECRET=algo-mais-seguro uvicorn app.main:app --port 8001
```

## Testando com `curl`

```bash
# Registrar um usuário
curl -X POST http://localhost:8000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Silva", "email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Login (copie o token da resposta)
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Listar usuários (rota protegida)
curl http://localhost:8000/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Buscar por id
curl http://localhost:8000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Atualizar parcialmente
curl -X PATCH http://localhost:8000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana S. Souza"}'

# Substituir por completo
curl -X PUT http://localhost:8000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Final", "email": "ana@exemplo.com", "senha": "outraSenha"}'

# Remover
curl -X DELETE http://localhost:8000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Estrutura do projeto

```
api-python/
├── requirements.txt
└── app/
    ├── main.py                # cria o app, inclui routers, registra handlers de erro
    ├── db.py                  # conexão SQLite + schema
    ├── models.py               # funções de acesso a dados
    ├── schemas.py              # modelos Pydantic (validação de entrada/saída)
    ├── security.py             # hashing de senha + geração/verificação de JWT
    ├── dependencies.py        # "middleware" de autenticação, via Depends
    ├── errors.py               # exceção ApiError
    ├── error_handlers.py       # "middleware" de tratamento de erros
    └── routers/
        ├── auth.py             # registrar/login
        └── usuarios.py        # CRUD de usuários
```

Para apagar o banco e recomeçar do zero:

```bash
rm usuarios.db
```
