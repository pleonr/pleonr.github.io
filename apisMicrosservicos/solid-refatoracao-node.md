---
title: "APIs e Microsserviços: Aula 10"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Refatorando a API Node.js para SOLID

<p class="lesson-subtitle">Aplicando os cinco princípios da Aula 09 na API de usuários da Aula 05: quais arquivos mudam, o que muda em cada um, e por quê</p>

Na [Aula 05](/apisMicrosservicos/exemplo-node-express) construímos uma API de usuários em camadas (rotas → controllers → models). É uma boa arquitetura para começar, mas, olhada com os princípios da [Aula 09](/apisMicrosservicos/solid-apis), tem violações concretas de SOLID. Esta aula é o passo a passo de refatoração: mesmo comportamento HTTP no final (as mesmas rotas, os mesmos status codes, os mesmos `curl` da Aula 05 continuam funcionando), organização interna diferente.

## Ponto de partida: as violações

| # | Onde | Princípio violado | Sintoma |
| --- | --- | --- | --- |
| 1 | `authController.js`, `usuarioController.js` | **SRP** | Validação, regra de negócio, hashing e formatação de resposta HTTP misturados na mesma função |
| 2 | Validação repetida em `registrar`, `substituir`, `atualizarParcial` | **OCP** | Toda regra nova de validação exige editar `if`s espalhados em três funções diferentes |
| 3 | `usuarioModel.js` importa `db.js` fixo no topo do arquivo | **LSP** | Impossível substituir por uma implementação em memória (para teste) sem editar o arquivo |
| 4 | `import * as usuarioModel` nos controllers | **ISP** | `authController` depende do módulo inteiro para usar só 2 das 7 funções |
| 5 | `bcrypt`, `jsonwebtoken` importados direto nos controllers/middleware | **DIP** | Regra de negócio soldada a bibliotecas concretas, impossível testar sem elas |

## Estrutura de pastas: antes e depois

```
# Antes (Aula 05)                    # Depois (esta aula)
src/                                 src/
├── db.js                            ├── config.js                  (novo)
├── models/                          ├── db.js
│   └── usuarioModel.js              ├── repositories/               (novo)
├── controllers/                     │   └── usuarioRepository.js
│   ├── authController.js            ├── validation/                 (novo)
│   └── usuarioController.js         │   └── regras.js
├── middlewares/                     ├── services/                   (novo)
│   ├── auth.js                      │   ├── hashService.js
│   ├── asyncHandler.js              │   ├── tokenService.js
│   └── errorHandler.js              │   ├── authService.js
├── routes/                          │   └── usuarioService.js
│   ├── authRoutes.js                ├── controllers/
│   └── usuarioRoutes.js             │   ├── authController.js       (reescrito, mais fino)
├── errors/apiError.js               │   └── usuarioController.js    (reescrito, mais fino)
└── app.js                           ├── middlewares/
                                      │   ├── auth.js                 (reescrito)
                                      │   ├── asyncHandler.js         (sem mudança)
                                      │   └── errorHandler.js         (sem mudança)
                                      ├── routes/
                                      │   ├── authRoutes.js           (reescrito)
                                      │   └── usuarioRoutes.js        (reescrito)
                                      ├── errors/apiError.js          (sem mudança)
                                      └── app.js                      (reescrito: composition root)
```

`models/usuarioModel.js` vira `repositories/usuarioRepository.js`: mesmo SQL por dentro, mas exposto como uma *fábrica* em vez de funções soltas. É essa mudança de forma que resolve as violações 3 e 4.

## Passo 1 (DIP): isolando bcrypt e jsonwebtoken

**Por quê primeiro:** todo o resto da refatoração depende de os services não conhecerem bibliotecas concretas. Criamos dois arquivos novos que embrulham `bcryptjs` e `jsonwebtoken` atrás de uma abstração própria da aplicação.

```js
// src/services/hashService.js  (novo)
import bcrypt from 'bcryptjs';

export function criarHashService({ custo = 10 } = {}) {
  return {
    hash: (senha) => bcrypt.hash(senha, custo),
    comparar: (senha, hash) => bcrypt.compare(senha, hash)
  };
}
```

```js
// src/services/tokenService.js  (novo)
import jwt from 'jsonwebtoken';

export function criarTokenService({ secret, expiresIn = '1h' }) {
  return {
    gerar: (payload) => jwt.sign(payload, secret, { expiresIn }),
    verificar: (token) => jwt.verify(token, secret)
  };
}
```

Note que `hashService`/`tokenService` são *fábricas* (`criarHashService`, `criarTokenService`), não módulos com estado fixo: quem cria decide o custo do bcrypt e o segredo do JWT, em vez de esses valores estarem fixos dentro da função. Isso também tira o `JWT_SECRET` de dentro de `middlewares/auth.js`, que não deveria ser dono de um segredo. Ele só precisa *usar* um token service já configurado. O segredo agora mora em um módulo de configuração:

```js
// src/config.js  (novo)
export const JWT_SECRET = process.env.JWT_SECRET || 'segredo-de-desenvolvimento';
export const PORT = process.env.PORT || 3000;
```

## Passo 2 (LSP + DIP): o repositório recebe o banco por parâmetro

**Por quê:** `usuarioModel.js` original importa `db.js` fixo no topo do arquivo. Não dá para trocar por outra implementação sem editar o arquivo. Transformamos as funções soltas em uma fábrica que recebe a conexão como parâmetro:

```js
// src/repositories/usuarioRepository.js  (substitui models/usuarioModel.js)
export function criarUsuarioRepository(db) {
  function buscarPorId(id) {
    return db
      .prepare('SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?')
      .get(id);
  }

  return {
    criar({ nome, email, senhaHash }) {
      const stmt = db.prepare(
        'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)'
      );
      const info = stmt.run(nome, email, senhaHash);
      return buscarPorId(info.lastInsertRowid);
    },

    listar() {
      return db.prepare('SELECT id, nome, email, criado_em FROM usuarios').all();
    },

    buscarPorId,

    buscarPorEmail(email) {
      return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    },

    atualizar(id, { nome, email, senhaHash }) {
      db.prepare(
        'UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?'
      ).run(nome, email, senhaHash, id);
      return buscarPorId(id);
    },

    atualizarParcial(id, campos) {
      const atual = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
      if (!atual) return null;

      const nome = campos.nome ?? atual.nome;
      const email = campos.email ?? atual.email;
      const senhaHash = campos.senhaHash ?? atual.senha_hash;

      db.prepare(
        'UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?'
      ).run(nome, email, senhaHash, id);
      return buscarPorId(id);
    },

    remover(id) {
      const info = db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);
      return info.changes > 0;
    }
  };
}
```

O SQL não mudou uma linha. Só a forma como o módulo é exposto. `db.js` continua exatamente igual ao da Aula 05 (só criando e exportando a conexão). Quem antes fazia `import db from '../db.js'` dentro do model agora faz `criarUsuarioRepository(db)` em `app.js`. Isso resolve LSP na prática: qualquer objeto com esses mesmos sete métodos e o mesmo contrato de retorno (`undefined`/`null` quando não encontra, nunca uma exceção) pode ocupar o lugar deste repositório, inclusive um fake em memória num teste, sem SQLite nenhum.

## Passo 3 (OCP): validação como lista de regras

**Por quê:** na Aula 05, cada função de controller repete seu próprio bloco de `if`s de validação. Extraímos isso para regras compostas: adicionar uma regra nova vira adicionar uma função à lista, não editar uma função existente:

```js
// src/validation/regras.js  (novo)
export const obrigatorio = (campo) => (dados) => {
  if (!dados[campo]) return `O campo '${campo}' é obrigatório.`;
};

export function validar(dados, regras) {
  for (const regra of regras) {
    const erro = regra(dados);
    if (erro) return erro;
  }
  return null;
}
```

Uma regra nova (por exemplo, senha com no mínimo 8 caracteres) seria só mais uma função. Nada nas linhas acima precisaria mudar:

```js
export const senhaForte = (dados) => {
  if (dados.senha && dados.senha.length < 8) {
    return "O campo 'senha' precisa ter ao menos 8 caracteres.";
  }
};
```

## Passo 4 (SRP): extraindo a regra de negócio para services

**Por quê:** aqui é onde a mistura de responsabilidades do controller original é desfeita. `authService` cuida de registro/login. `usuarioService` cuida do CRUD. Cada um recebe suas dependências (repositório, hash, token) por parâmetro, o que também resolve ISP: cada service só recebe, explicitamente, o que usa.

```js
// src/services/authService.js  (novo, extraído de authController.js)
import ApiError from '../errors/apiError.js';
import { obrigatorio, validar } from '../validation/regras.js';

export function criarAuthService({ usuarioRepository, hashService, tokenService }) {
  async function registrar({ nome, email, senha }) {
    const erro = validar({ nome, email, senha }, [
      obrigatorio('nome'),
      obrigatorio('email'),
      obrigatorio('senha')
    ]);
    if (erro) throw new ApiError(400, 'VALIDATION_ERROR', erro);

    if (usuarioRepository.buscarPorEmail(email)) {
      throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
    }

    const senhaHash = await hashService.hash(senha);
    return usuarioRepository.criar({ nome, email, senhaHash });
  }

  async function login({ email, senha }) {
    const usuario = usuarioRepository.buscarPorEmail(email);
    const senhaValida = usuario && (await hashService.comparar(senha, usuario.senha_hash));

    if (!senhaValida) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
    }

    const token = tokenService.gerar({ sub: usuario.id, nome: usuario.nome, email: usuario.email });
    return token;
  }

  return { registrar, login };
}
```

```js
// src/services/usuarioService.js  (novo, extraído de usuarioController.js)
import ApiError from '../errors/apiError.js';
import { obrigatorio, validar } from '../validation/regras.js';

export function criarUsuarioService({ usuarioRepository, hashService }) {
  function listar() {
    return usuarioRepository.listar();
  }

  function buscarPorId(id) {
    const usuario = usuarioRepository.buscarPorId(id);
    if (!usuario) throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
    return usuario;
  }

  async function substituir(id, { nome, email, senha }) {
    if (!usuarioRepository.buscarPorId(id)) {
      throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
    }

    const erro = validar({ nome, email, senha }, [
      obrigatorio('nome'),
      obrigatorio('email'),
      obrigatorio('senha')
    ]);
    if (erro) throw new ApiError(400, 'VALIDATION_ERROR', erro);

    const outro = usuarioRepository.buscarPorEmail(email);
    if (outro && outro.id !== id) {
      throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
    }

    const senhaHash = await hashService.hash(senha);
    return usuarioRepository.atualizar(id, { nome, email, senhaHash });
  }

  async function atualizarParcial(id, { nome, email, senha }) {
    if (!usuarioRepository.buscarPorId(id)) {
      throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
    }

    if (email) {
      const outro = usuarioRepository.buscarPorEmail(email);
      if (outro && outro.id !== id) {
        throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
      }
    }

    const senhaHash = senha ? await hashService.hash(senha) : undefined;
    return usuarioRepository.atualizarParcial(id, { nome, email, senhaHash });
  }

  function remover(id) {
    const removido = usuarioRepository.remover(id);
    if (!removido) throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
  }

  return { listar, buscarPorId, substituir, atualizarParcial, remover };
}
```

Repare que `authService` só recebe `usuarioRepository`, `hashService` e `tokenService`, nunca `bcrypt` ou `jsonwebtoken` diretamente. É a mesma regra de negócio de antes, mas agora ela só conhece abstrações, nunca uma biblioteca concreta.

## Passo 5: controllers ficam finos

**Por quê:** com a regra de negócio fora, o controller volta a ter uma única responsabilidade: traduzir HTTP para chamada de função, e o retorno da função para resposta HTTP.

```js
// src/controllers/authController.js  (reescrito)
export function criarAuthController({ authService }) {
  async function registrar(req, res) {
    const usuario = await authService.registrar(req.body);
    res.status(201).location(`/usuarios/${usuario.id}`).json(usuario);
  }

  async function login(req, res) {
    const token = await authService.login(req.body);
    res.json({ token });
  }

  return { registrar, login };
}
```

```js
// src/controllers/usuarioController.js  (reescrito)
export function criarUsuarioController({ usuarioService }) {
  function listar(req, res) {
    res.json(usuarioService.listar());
  }

  function buscarPorId(req, res) {
    res.json(usuarioService.buscarPorId(Number(req.params.id)));
  }

  async function substituir(req, res) {
    res.json(await usuarioService.substituir(Number(req.params.id), req.body));
  }

  async function atualizarParcial(req, res) {
    res.json(await usuarioService.atualizarParcial(Number(req.params.id), req.body));
  }

  function remover(req, res) {
    usuarioService.remover(Number(req.params.id));
    res.status(204).send();
  }

  return { listar, buscarPorId, substituir, atualizarParcial, remover };
}
```

Nenhuma dessas funções sabe o que é um e-mail duplicado, o que é bcrypt, ou como o SQL busca um usuário, e é exatamente por isso que agora só têm um motivo para mudar: o formato da requisição/resposta HTTP.

## Passo 6: o middleware de autenticação usa o tokenService

**Por quê:** `middlewares/auth.js` importava `jsonwebtoken` e o `JWT_SECRET` diretamente. Agora recebe um `tokenService` já configurado, do mesmo jeito que `authService` recebe:

```js
// src/middlewares/auth.js  (reescrito)
import ApiError from '../errors/apiError.js';

export function criarAuthMiddleware({ tokenService }) {
  return function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return next(new ApiError(401, 'UNAUTHORIZED', 'Token ausente ou inválido.'));
    }

    const token = header.slice('Bearer '.length);

    try {
      req.usuario = tokenService.verificar(token);
      next();
    } catch (err) {
      next(new ApiError(401, 'UNAUTHORIZED', 'Token ausente ou inválido.'));
    }
  };
}
```

`errors/apiError.js` e `middlewares/asyncHandler.js` não mudam: nenhum dos dois tinha uma dependência concreta escondida, e o contrato de ambos já era mínimo.

## Passo 7: rotas recebem controllers/middlewares prontos

**Por quê:** como controllers e middleware agora são fábricas (recebem dependências), as rotas também precisam receber as instâncias já montadas, em vez de importar `authController`/`usuarioController` como módulos fixos:

```js
// src/routes/authRoutes.js  (reescrito)
import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';

export function criarAuthRoutes({ authController }) {
  const router = Router();

  router.post('/registrar', asyncHandler(authController.registrar));
  router.post('/login', asyncHandler(authController.login));

  return router;
}
```

```js
// src/routes/usuarioRoutes.js  (reescrito)
import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';

export function criarUsuarioRoutes({ usuarioController, authMiddleware }) {
  const router = Router();

  router.use(authMiddleware);

  router.get('/', asyncHandler(usuarioController.listar));
  router.get('/:id', asyncHandler(usuarioController.buscarPorId));
  router.put('/:id', asyncHandler(usuarioController.substituir));
  router.patch('/:id', asyncHandler(usuarioController.atualizarParcial));
  router.delete('/:id', asyncHandler(usuarioController.remover));

  return router;
}
```

## Passo 8: `app.js` vira o *composition root*

**Por quê:** este é o único arquivo da aplicação que tem permissão para conhecer implementações concretas (`better-sqlite3` via `db.js`, `bcryptjs`, `jsonwebtoken`, o segredo de `config.js`). Todo o resto da aplicação só enxerga abstrações injetadas. É aqui que elas se encontram:

```js
// src/app.js  (reescrito)
import express from 'express';
import cors from 'cors';
import db from './db.js';
import { JWT_SECRET } from './config.js';

import { criarUsuarioRepository } from './repositories/usuarioRepository.js';
import { criarHashService } from './services/hashService.js';
import { criarTokenService } from './services/tokenService.js';
import { criarAuthService } from './services/authService.js';
import { criarUsuarioService } from './services/usuarioService.js';

import { criarAuthController } from './controllers/authController.js';
import { criarUsuarioController } from './controllers/usuarioController.js';
import { criarAuthMiddleware } from './middlewares/auth.js';
import errorHandler from './middlewares/errorHandler.js';

import { criarAuthRoutes } from './routes/authRoutes.js';
import { criarUsuarioRoutes } from './routes/usuarioRoutes.js';

// --- Composição: único lugar da aplicação onde peças concretas se encontram ---
const usuarioRepository = criarUsuarioRepository(db);
const hashService = criarHashService();
const tokenService = criarTokenService({ secret: JWT_SECRET });

const authService = criarAuthService({ usuarioRepository, hashService, tokenService });
const usuarioService = criarUsuarioService({ usuarioRepository, hashService });

const authController = criarAuthController({ authService });
const usuarioController = criarUsuarioController({ usuarioService });
const authMiddleware = criarAuthMiddleware({ tokenService });

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

app.use('/auth', criarAuthRoutes({ authController }));
app.use('/usuarios', criarUsuarioRoutes({ usuarioController, authMiddleware }));

app.use((req, res) => {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: `Rota ${req.method} ${req.path} não existe.` }
  });
});

app.use(errorHandler); // sempre por último

export default app;
```

`server.js` não muda: continua só importando `app` e chamando `app.listen`.

::: tip Por que não usar classes e `interface`?
JavaScript não tem `interface` como TypeScript ou Java. O padrão usado aqui (fábricas, via `criarX`, que recebem um objeto de dependências e devolvem um objeto de funções) é a forma idiomática de fazer injeção de dependência em JS puro, e cumpre o mesmo papel: o "contrato" é implícito (o formato do objeto retornado), mas ainda assim permite trocar uma implementação por outra sem alterar quem a consome.
:::

## Conferindo que nada quebrou

O contrato HTTP é idêntico ao da Aula 05: mesmas rotas, mesmos status codes, mesmo formato de erro. Os mesmos comandos `curl` daquela aula continuam funcionando sem alteração:

```bash
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Silva", "email": "ana@exemplo.com", "senha": "senhaForte123"}'
```

O que mudou é só a organização interna. Isso, por si só, já é uma verificação da qualidade da refatoração: se o comportamento externo mudasse, não seria mais um refactor, seria uma reescrita.

## Checklist final

| Violação (Aula 05) | Princípio | Correção (esta aula) |
| --- | --- | --- |
| `authController`/`usuarioController` fazem validação + regra de negócio + hashing + resposta HTTP | SRP | Regra de negócio movida para `authService`/`usuarioService`, controller só traduz HTTP |
| Validação repetida em três funções | OCP | `validation/regras.js`: lista de regras composta, extensível sem editar código existente |
| `usuarioModel.js` importa `db.js` fixo | LSP | `criarUsuarioRepository(db)`: qualquer objeto com o mesmo contrato é substituível |
| `import * as usuarioModel` traz 7 funções para quem usa 2 | ISP | Services recebem só `usuarioRepository`/`hashService`/`tokenService` explicitamente, via parâmetro |
| `bcrypt`/`jsonwebtoken` importados nos controllers/middleware | DIP | `hashService`/`tokenService` como abstrações, implementações concretas só existem em `app.js` |

[Ver a Aula 09 novamente →](/apisMicrosservicos/solid-apis) · [Testar esta API ao vivo →](/apisMicrosservicos/exemplos-api)

---

**Próxima página:** [Aula 11: Testes Automatizados na API Node.js →](/apisMicrosservicos/testes-node)

<style scoped src="./shared.css"></style>
