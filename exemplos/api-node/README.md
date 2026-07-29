# API de Usuários — Node.js + Express

Implementação da API de cadastro de usuários com Node.js, Express, SQLite (`better-sqlite3`) e autenticação JWT. Código completo e explicado passo a passo em [Aula 05](https://pleonr.github.io/apisMicrosservicos/exemplo-node-express).

## Pré-requisitos

- Node.js 18 ou mais recente

## Instalação e execução

```bash
cd exemplos/api-node
npm install
npm start
```

O servidor sobe em `http://localhost:3000`. Na primeira execução, um arquivo `usuarios.db` é criado automaticamente na raiz desta pasta (a tabela `usuarios` é criada sozinha, se ainda não existir).

Para desenvolvimento com reinício automático a cada alteração:

```bash
npm run dev
```

## Variáveis de ambiente (opcionais)

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3000` | Porta HTTP do servidor |
| `JWT_SECRET` | `segredo-de-desenvolvimento` | Segredo usado para assinar/validar tokens JWT |
| `DB_PATH` | `./usuarios.db` | Caminho do arquivo SQLite |

```bash
JWT_SECRET=algo-mais-seguro PORT=4000 npm start
```

## Testando com `curl`

```bash
# Registrar um usuário
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Silva", "email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Login (copie o token da resposta)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Listar usuários (rota protegida)
curl http://localhost:3000/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Buscar por id
curl http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Atualizar parcialmente
curl -X PATCH http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana S. Souza"}'

# Substituir por completo
curl -X PUT http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Final", "email": "ana@exemplo.com", "senha": "outraSenha"}'

# Remover
curl -X DELETE http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Estrutura do projeto

```
api-node/
├── server.js                        # ponto de entrada, sobe o servidor
└── src/
    ├── app.js                       # monta express + rotas + middlewares
    ├── db.js                        # conexão SQLite + schema
    ├── models/usuarioModel.js       # queries SQL
    ├── controllers/
    │   ├── authController.js       # registrar/login
    │   └── usuarioController.js    # CRUD de usuários
    ├── middlewares/
    │   ├── auth.js                  # valida o JWT
    │   ├── errorHandler.js          # formata qualquer erro como JSON
    │   └── asyncHandler.js          # encaminha rejeições de Promise ao errorHandler
    ├── errors/apiError.js           # erro com status HTTP embutido
    └── routes/
        ├── authRoutes.js
        └── usuarioRoutes.js
```

Este projeto usa **ES Modules** (`import`/`export`), habilitado via `"type": "module"` no `package.json`.

Para apagar o banco e recomeçar do zero:

```bash
rm usuarios.db
```
