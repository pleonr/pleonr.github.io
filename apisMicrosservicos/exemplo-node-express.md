---
title: "APIs e Microsserviços: Aula 05"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Exemplo Prático: Node.js + Express

<p class="lesson-subtitle">Uma API de cadastro de usuários com arquitetura em camadas, SQLite, autenticação JWT e tratamento de erros centralizado</p>

Vamos construir uma API REST completa de **cadastro de usuários**: registro, login com token JWT e CRUD protegido por autenticação, persistindo os dados em um arquivo SQLite. O objetivo é a mesma API que vamos repetir, endpoint por endpoint, em [Python/FastAPI](/apisMicrosservicos/exemplo-python-fastapi), [Go/Gin](/apisMicrosservicos/exemplo-golang-gin) e [Elixir/Phoenix](/apisMicrosservicos/exemplo-elixir-phoenix), para comparar como cada stack resolve os mesmos problemas.

## O que vamos construir

| Método | Rota | Autenticado? | Descrição |
| --- | --- | --- | --- |
| `POST` | `/auth/registrar` | Não | Cria um novo usuário (senha criptografada) |
| `POST` | `/auth/login` | Não | Valida credenciais e devolve um token JWT |
| `GET` | `/usuarios` | Sim | Lista todos os usuários |
| `GET` | `/usuarios/:id` | Sim | Busca um usuário pelo id |
| `PUT` | `/usuarios/:id` | Sim | Substitui nome, e-mail e senha |
| `PATCH` | `/usuarios/:id` | Sim | Atualiza só os campos enviados |
| `DELETE` | `/usuarios/:id` | Sim | Remove um usuário |

Erros seguem sempre o formato `{ "error": { "code", "message" } }` visto na [Aula 03](/apisMicrosservicos/boas-praticas#tratamento-de-erros-consistente).

## Configurando o projeto

```bash
mkdir api-usuarios-node
cd api-usuarios-node
npm init -y
npm pkg set type=module
npm install express better-sqlite3 bcryptjs jsonwebtoken cors
```

- **express**: framework web.
- **better-sqlite3**: driver SQLite síncrono, sem dependências externas de servidor (o banco é um arquivo `.db` no disco).
- **bcryptjs**: hashing de senha (implementação pura em JS do bcrypt, sem compilação nativa).
- **jsonwebtoken**: geração e verificação de tokens JWT.
- **cors**: middleware que adiciona os headers de CORS às respostas.

::: tip `"type": "module"`
`npm pkg set type=module` adiciona `"type": "module"` ao `package.json`, habilitando **ES Modules** (`import`/`export`) em vez do CommonJS tradicional (`require`/`module.exports`). É a mesma sintaxe de import usada no navegador e em ferramentas modernas do ecossistema JS. Uma consequência prática: imports relativos precisam da extensão `.js` explícita (`'../db.js'`, não `'../db'`).
:::

## Organizando o projeto como MVC

Em vez de um único arquivo, separamos por responsabilidade: **rotas** (o que existe), **controllers** (o que fazer quando uma rota é chamada), **models** (como os dados são lidos/gravados) e **middlewares** (o que roda antes/depois das rotas, transversalmente).

```
api-usuarios-node/
├── src/
│   ├── db.js                        # conexão SQLite + schema
│   ├── models/
│   │   └── usuarioModel.js          # queries SQL (camada "M")
│   ├── controllers/
│   │   ├── authController.js        # registrar/login (camada "C")
│   │   └── usuarioController.js     # CRUD de usuários (camada "C")
│   ├── middlewares/
│   │   ├── auth.js                  # valida o JWT
│   │   └── errorHandler.js          # formata qualquer erro como JSON
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── usuarioRoutes.js
│   ├── errors/apiError.js           # classe de erro com status + code
│   └── app.js                       # monta express + rotas + middlewares
└── server.js                        # ponto de entrada, sobe o servidor
```

::: tip Onde fica a "View"?
Em uma API REST não há HTML para renderizar: a "view" é o próprio JSON que o controller devolve. Por isso muita gente chama esse estilo de **MVC "sem V"**, ou simplesmente de arquitetura em camadas (rotas → controllers → models).
:::

## Um erro com status HTTP embutido

Todo erro de negócio (validação, não encontrado, credenciais inválidas...) precisa virar uma resposta HTTP com o status certo. Em vez de espalhar `res.status(...)` pelos controllers, criamos uma classe de erro que carrega essa informação:

```js
// src/errors/apiError.js
export default class ApiError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
```

## Banco de dados: SQLite em arquivo

```js
// src/db.js
import Database from 'better-sqlite3';

const db = new Database('usuarios.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;
```

Ao abrir `new Database('usuarios.db')`, o `better-sqlite3` cria o arquivo se ele não existir. `CREATE TABLE IF NOT EXISTS` garante que rodar isso várias vezes (a cada `npm start`) não apague nada.

::: tip `__dirname` não existe em ES Modules
Se quiser montar o caminho do banco de forma absoluta (em vez de relativo ao diretório onde o comando `node` foi executado), `__dirname` não está disponível em ESM. A alternativa é derivá-lo de `import.meta.url`:

```js
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
```
:::

## Model: acesso aos dados

O model é a única camada que sabe escrever SQL. Controllers nunca tocam o banco diretamente:

```js
// src/models/usuarioModel.js
import db from '../db.js';

export function criar({ nome, email, senhaHash }) {
  const stmt = db.prepare(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)'
  );
  const info = stmt.run(nome, email, senhaHash);
  return buscarPorId(info.lastInsertRowid);
}

export function listar() {
  return db.prepare('SELECT id, nome, email, criado_em FROM usuarios').all();
}

export function buscarPorId(id) {
  return db
    .prepare('SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?')
    .get(id);
}

export function buscarPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
}

export function atualizar(id, { nome, email, senhaHash }) {
  db.prepare(
    'UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?'
  ).run(nome, email, senhaHash, id);
  return buscarPorId(id);
}

export function atualizarParcial(id, campos) {
  const atual = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
  if (!atual) return null;

  const nome = campos.nome ?? atual.nome;
  const email = campos.email ?? atual.email;
  const senhaHash = campos.senhaHash ?? atual.senha_hash;

  db.prepare(
    'UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?'
  ).run(nome, email, senhaHash, id);
  return buscarPorId(id);
}

export function remover(id) {
  const info = db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);
  return info.changes > 0;
}
```

Repare que `listar` e `buscarPorId` nunca selecionam `senha_hash`: o hash da senha não deve sair do model em uma resposta de leitura comum.

## Middleware de autenticação (JWT)

Um middleware Express é uma função `(req, res, next)` que roda antes da rota. Aqui, ele lê o header `Authorization`, valida o token e anexa o usuário autenticado em `req.usuario`:

```js
// src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import ApiError from '../errors/apiError.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'segredo-de-desenvolvimento';

export function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'UNAUTHORIZED', 'Token ausente ou inválido.'));
  }

  const token = header.slice('Bearer '.length);

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    next(new ApiError(401, 'UNAUTHORIZED', 'Token ausente ou inválido.'));
  }
}
```

::: tip Por que `next(erro)` e não lançar direto?
Middlewares e rotas assíncronas no Express não propagam exceções sozinhas para o tratamento de erros. Chamar `next(erro)` é a forma de dizer "pare o fluxo normal e vá direto para o middleware de erros", visto a seguir.
:::

## Middleware de tratamento de erros

Este middleware tem uma assinatura especial: **quatro** argumentos (`err, req, res, next`). É assim que o Express o reconhece como um *error handler*, e não como um middleware normal:

```js
// src/middlewares/errorHandler.js
import ApiError from '../errors/apiError.js';

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message }
    });
  }

  console.error(err); // erro inesperado: logamos para investigar depois
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor.' }
  });
}

export default errorHandler;
```

Qualquer `ApiError` lançado em qualquer controller vira uma resposta JSON consistente. Qualquer outro erro (um bug, uma exceção não prevista) também vira JSON em vez de travar o processo ou vazar um stack trace HTML para o cliente.

Como os controllers usam `async/await`, envolvemos cada um em um pequeno helper que captura a rejeição da Promise e chama `next(err)` automaticamente:

```js
// src/middlewares/asyncHandler.js
export default function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}
```

## Controller de autenticação: registrar e login

```js
// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/usuarioModel.js';
import ApiError from '../errors/apiError.js';
import { JWT_SECRET } from '../middlewares/auth.js';

export async function registrar(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    throw new ApiError(400, 'VALIDATION_ERROR', "Os campos 'nome', 'email' e 'senha' são obrigatórios.");
  }

  if (usuarioModel.buscarPorEmail(email)) {
    throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = usuarioModel.criar({ nome, email, senhaHash });

  res.status(201).location(`/usuarios/${usuario.id}`).json(usuario);
}

export async function login(req, res) {
  const { email, senha } = req.body;

  const usuario = usuarioModel.buscarPorEmail(email);
  const senhaValida = usuario && (await bcrypt.compare(senha, usuario.senha_hash));

  if (!senhaValida) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
  }

  const token = jwt.sign(
    { sub: usuario.id, nome: usuario.nome, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
}
```

`bcrypt.hash` nunca guarda a senha em texto puro, apenas um hash irreversível. `bcrypt.compare` recalcula o hash da senha recebida e compara com o hash salvo, sem nunca precisar descriptografar nada (bcrypt não é reversível).

## Controller de usuários: CRUD

```js
// src/controllers/usuarioController.js
import bcrypt from 'bcryptjs';
import * as usuarioModel from '../models/usuarioModel.js';
import ApiError from '../errors/apiError.js';

export function listar(req, res) {
  res.json(usuarioModel.listar());
}

export function buscarPorId(req, res) {
  const usuario = usuarioModel.buscarPorId(Number(req.params.id));
  if (!usuario) {
    throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
  }
  res.json(usuario);
}

export async function substituir(req, res) {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  if (!usuarioModel.buscarPorId(id)) {
    throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
  }
  if (!nome || !email || !senha) {
    throw new ApiError(400, 'VALIDATION_ERROR', "Os campos 'nome', 'email' e 'senha' são obrigatórios.");
  }

  const outro = usuarioModel.buscarPorEmail(email);
  if (outro && outro.id !== id) {
    throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  res.json(usuarioModel.atualizar(id, { nome, email, senhaHash }));
}

export async function atualizarParcial(req, res) {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  if (!usuarioModel.buscarPorId(id)) {
    throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
  }

  if (email) {
    const outro = usuarioModel.buscarPorEmail(email);
    if (outro && outro.id !== id) {
      throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
    }
  }

  const senhaHash = senha ? await bcrypt.hash(senha, 10) : undefined;
  res.json(usuarioModel.atualizarParcial(id, { nome, email, senhaHash }));
}

export function remover(req, res) {
  const removido = usuarioModel.remover(Number(req.params.id));
  if (!removido) {
    throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
  }
  res.status(204).send();
}
```

## Rotas

```js
// src/routes/authRoutes.js
import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/registrar', asyncHandler(authController.registrar));
router.post('/login', asyncHandler(authController.login));

export default router;
```

```js
// src/routes/usuarioRoutes.js
import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import { auth } from '../middlewares/auth.js';
import * as usuarioController from '../controllers/usuarioController.js';

const router = Router();

router.use(auth); // toda rota abaixo desta linha exige um token válido

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.buscarPorId);
router.put('/:id', asyncHandler(usuarioController.substituir));
router.patch('/:id', asyncHandler(usuarioController.atualizarParcial));
router.delete('/:id', usuarioController.remover);

export default router;
```

`router.use(auth)` aplica o middleware de autenticação a **todas** as rotas declaradas depois dele neste router, sem repetir `auth` em cada linha.

## Montando a aplicação

```js
// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

const ALLOWED_ORIGINS = [
  'https://leon.dev.br',
  'https://www.leon.dev.br',
  'http://localhost:5173'
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: `Rota ${req.method} ${req.path} não existe.` }
  });
});

app.use(errorHandler); // sempre por último

export default app;
```

```js
// server.js
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
```

::: warning Ordem importa
`app.use(errorHandler)` precisa vir **depois** de todas as rotas (e depois do middleware de 404). O Express identifica um middleware de erro pela assinatura de 4 argumentos, mas ele só entra em ação quando algo antes dele chama `next(erro)` ou lança uma exceção capturada pelo `asyncHandler`.
:::

## CORS: liberando o acesso do navegador

Por padrão, o navegador **bloqueia** chamadas `fetch`/`XMLHttpRequest` feitas por JavaScript de uma origem (domínio + porta) diferente da origem do próprio servidor da API — é a política de **CORS** (*Cross-Origin Resource Sharing*). Sem o middleware acima, uma SPA rodando em `http://localhost:5173` que tenta chamar `http://localhost:3000/auth/registrar` recebe um erro no console como:

```
Access to fetch at 'http://localhost:3000/auth/registrar' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.
```

O middleware `cors` resolve isso adicionando o header `Access-Control-Allow-Origin` (e respondendo automaticamente ao *preflight* `OPTIONS` que o navegador dispara antes de requisições com método/headers não triviais). A função `origin` acima consulta uma lista branca (`ALLOWED_ORIGINS`) em vez de liberar `*` para qualquer origem — importante porque `credentials: true` (necessário para enviar o header `Authorization`) não é compatível com um `Access-Control-Allow-Origin: *` genérico.

::: tip Requisições sem `Origin`
`!origin` cobre chamadas que não têm o header `Origin`, como requisições feitas por `curl`, Postman ou por outro servidor — o navegador é o único que envia `Origin` e aplica CORS; ferramentas server-to-server nunca são bloqueadas por essa política.
:::

## Rodando e testando com `curl`

```bash
node server.js
```

```bash
# Registrar
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Silva", "email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Login (guarde o token retornado)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Listar usuários (rota protegida)
curl http://localhost:3000/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Atualizar parcialmente
curl -X PATCH http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana S. Souza"}'

# Remover
curl -X DELETE http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

Chamar `GET /usuarios` sem o header `Authorization` (ou com um token inválido/expirado) devolve:

```json
{ "error": { "code": "UNAUTHORIZED", "message": "Token ausente ou inválido." } }
```

::: warning Isso é um exemplo didático
O segredo do JWT (`JWT_SECRET`) está com um valor padrão só para facilitar o teste local; em produção ele **precisa** vir de uma variável de ambiente/segredo gerenciado, nunca de um valor fixo no código. O mesmo vale para políticas de senha, expiração de token e *refresh tokens*, deixados de fora aqui para focar na arquitetura.
:::

[Testar esta API ao vivo →](/apisMicrosservicos/exemplos-api)

---

**Próxima página:** [Aula 06: Exemplo Prático: Python + FastAPI →](/apisMicrosservicos/exemplo-python-fastapi)

<style scoped src="./shared.css"></style>
