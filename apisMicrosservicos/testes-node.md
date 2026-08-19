---
title: "APIs e Microsserviços: Aula 11"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Testes Automatizados na API Node.js

<p class="lesson-subtitle">Testes unitários dos services isolados com fakes (o retorno do investimento da Aula 10) e testes de integração HTTP com Supertest sobre a API completa</p>

Até aqui, toda verificação que fizemos foi manual: rodar `node server.js` e disparar `curl` à mão. Isso funciona para explorar, mas não escala: ninguém roda quinze comandos `curl` toda vez que muda uma linha de código, e ninguém lembra de testar o caso de e-mail duplicado depois da vigésima alteração. Testes automatizados resolvem isso, com um bônus direto da [Aula 10](/apisMicrosservicos/solid-refatoracao-node): como os `services` agora recebem suas dependências por parâmetro, dá para testar a regra de negócio inteira **sem** SQLite, sem `bcrypt` de verdade e sem gerar um JWT de verdade.

## Duas camadas de teste, dois objetivos diferentes

| | Teste unitário (`authService`, `usuarioService`) | Teste de integração (HTTP, via Supertest) |
| --- | --- | --- |
| O que valida | Regra de negócio isolada: validação, e-mail duplicado, credenciais | O contrato HTTP de ponta a ponta: rotas, status codes, middlewares, JSON |
| Dependências reais? | Não — repositório, hash e token são **fakes** em memória | Sim — Express real, SQLite real (em memória), `bcrypt`/`jsonwebtoken` reais |
| Velocidade | Milissegundos, sem I/O | Um pouco mais lento (I/O em memória, ainda assim rápido) |
| O que pega que o outro não pega | Bugs na lógica de negócio, isolados de framework | Bugs de "fiação": rota errada, middleware na ordem errada, `app.js` montado errado |

Nenhuma das duas camadas substitui a outra: a unitária é rápida e aponta exatamente onde está o problema, a de integração é a única que garante que as peças, montadas juntas, respondem como o cliente HTTP espera.

## Instalando Vitest e Supertest

```bash
npm install -D vitest supertest
```

- **vitest**: test runner. Roda nativamente sobre ES Modules (o mesmo `"type": "module"` já configurado desde a Aula 05), sem passo de transpilação extra.
- **supertest**: faz requisições HTTP contra um objeto `app` do Express diretamente, sem precisar dar `app.listen()` em uma porta de verdade.

```json
// package.json
"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js",
  "test": "vitest run"
}
```

::: tip Por que Vitest, e não Jest?
Jest foi criado antes de o Node ter suporte nativo a ES Modules, e até hoje exige configuração extra (`--experimental-vm-modules` ou um transpilador via Babel) para rodar `import`/`export` sem conversão para CommonJS. O Vitest nasceu já em cima do ESM nativo, então testa este projeto sem tocar em `package.json` além do necessário — nenhum `babel.config.js`, nenhuma flag experimental.
:::

## Configurando o banco de teste

Repare em `src/db.js`: o caminho do arquivo já vem de `process.env.DB_PATH`, com um valor padrão em disco. O `better-sqlite3` trata o caminho especial `':memory:'` como "crie um banco novo, vazio, só na RAM, sem tocar em disco". Usamos isso para os testes de integração, via um arquivo de configuração do próprio Vitest:

```js
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      DB_PATH: ':memory:',
      JWT_SECRET: 'segredo-de-teste'
    }
  }
});
```

`test.env` injeta essas variáveis **antes** de qualquer arquivo de teste ser carregado, então quando `src/db.js` roda `new Database(process.env.DB_PATH)`, ele já recebe `':memory:'`. Cada arquivo de teste roda em seu próprio contexto de módulos no Vitest, então cada arquivo de integração recebe um banco em memória isolado dos demais.

::: warning Nunca aponte os testes para `usuarios.db`
Sem esse `DB_PATH`, os testes cairiam no mesmo arquivo `usuarios.db` que você usa rodando `npm run dev` manualmente, cada `npm test` iria acumular linhas, colidir com e-mails já cadastrados e, na pior hipótese, apagar dados que você queria manter. Banco em memória garante que cada execução começa de uma tabela vazia e não deixa rastro no disco.
:::

## Organizando os arquivos de teste

```
api-usuarios-node/
├── src/                             # igual à Aula 10
├── tests/
│   ├── unit/
│   │   ├── validacao.test.js
│   │   ├── authService.test.js
│   │   └── usuarioService.test.js
│   └── integration/
│       └── usuarios.test.js
├── vitest.config.js
└── package.json
```

## Teste unitário mais simples: a validação

`src/validation/regras.js` (Aula 10) não depende de nada além dos dados recebidos. É o candidato ideal para o primeiro teste, sem nenhum fake envolvido:

```js
// tests/unit/validacao.test.js
import { describe, it, expect } from 'vitest';
import { obrigatorio, validar } from '../../src/validation/regras.js';

describe('validar', () => {
  it('retorna null quando todas as regras passam', () => {
    const erro = validar({ nome: 'Ana', email: 'ana@exemplo.com' }, [
      obrigatorio('nome'),
      obrigatorio('email')
    ]);

    expect(erro).toBeNull();
  });

  it('retorna a mensagem da primeira regra que falhar', () => {
    const erro = validar({ nome: '' }, [
      obrigatorio('nome'),
      obrigatorio('email')
    ]);

    expect(erro).toBe("O campo 'nome' é obrigatório.");
  });
});
```

## Testes unitários dos services, com fakes no lugar das dependências reais

Esta é a parte que a Aula 10 deixou pronta: `criarAuthService` e `criarUsuarioService` recebem `usuarioRepository`, `hashService` e `tokenService` como parâmetros, então em teste basta passar versões falsas, sem SQLite, sem `bcrypt`, sem `jsonwebtoken`.

Um repositório fake não precisa reimplementar SQL algum — só o contrato que os services esperam (`criar`, `buscarPorEmail`, etc.), guardando os dados em um array:

```js
// tests/unit/fakes.js
export function criarFakeUsuarioRepository() {
  const usuarios = [];
  let proximoId = 1;

  return {
    criar({ nome, email, senhaHash }) {
      const usuario = { id: proximoId++, nome, email, senha_hash: senhaHash };
      usuarios.push(usuario);
      return usuario;
    },
    buscarPorId(id) {
      return usuarios.find((u) => u.id === id);
    },
    buscarPorEmail(email) {
      return usuarios.find((u) => u.email === email);
    }
  };
}

export const fakeHashService = {
  hash: async (senha) => `hash(${senha})`,
  comparar: async (senha, hash) => hash === `hash(${senha})`
};

export const fakeTokenService = {
  gerar: (payload) => `token(${payload.sub})`
};
```

`fakeHashService` não chama `bcrypt` de verdade: só devolve uma string previsível o bastante para o teste comparar. O mesmo vale para `fakeTokenService`. Nenhum dos dois precisa se comportar como a implementação real, só cumprir o mesmo contrato (`hash`/`comparar`, `gerar`) que o service espera.

```js
// tests/unit/authService.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { criarAuthService } from '../../src/services/authService.js';
import { criarFakeUsuarioRepository, fakeHashService, fakeTokenService } from './fakes.js';

describe('authService', () => {
  let authService;

  beforeEach(() => {
    authService = criarAuthService({
      usuarioRepository: criarFakeUsuarioRepository(),
      hashService: fakeHashService,
      tokenService: fakeTokenService
    });
  });

  it('registra um usuário novo com a senha em hash', async () => {
    const usuario = await authService.registrar({
      nome: 'Ana', email: 'ana@exemplo.com', senha: 'senhaForte123'
    });

    expect(usuario.id).toBe(1);
    expect(usuario.senha_hash).toBe('hash(senhaForte123)');
  });

  it('rejeita campos obrigatórios ausentes', async () => {
    await expect(
      authService.registrar({ nome: 'Ana', email: '', senha: 'senhaForte123' })
    ).rejects.toMatchObject({ statusCode: 400, code: 'VALIDATION_ERROR' });
  });

  it('rejeita e-mail duplicado', async () => {
    await authService.registrar({ nome: 'Ana', email: 'ana@exemplo.com', senha: 'senhaForte123' });

    await expect(
      authService.registrar({ nome: 'Outra Ana', email: 'ana@exemplo.com', senha: 'outraSenha1' })
    ).rejects.toMatchObject({ statusCode: 409, code: 'EMAIL_IN_USE' });
  });

  it('faz login e devolve um token para credenciais válidas', async () => {
    await authService.registrar({ nome: 'Ana', email: 'ana@exemplo.com', senha: 'senhaForte123' });

    const token = await authService.login({ email: 'ana@exemplo.com', senha: 'senhaForte123' });

    expect(token).toBe('token(1)');
  });

  it('rejeita senha incorreta', async () => {
    await authService.registrar({ nome: 'Ana', email: 'ana@exemplo.com', senha: 'senhaForte123' });

    await expect(
      authService.login({ email: 'ana@exemplo.com', senha: 'errada' })
    ).rejects.toMatchObject({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
  });
});
```

::: tip `rejects.toMatchObject`
`ApiError` estende `Error`, e um `Error` real carrega mais propriedades (`stack`, `message`, protótipo) do que só `statusCode`/`code`. `toMatchObject` verifica apenas os campos listados, então o teste não quebra por causa de detalhes irrelevantes de como o erro foi construído, só o que o `errorHandler` (Aula 05) de fato usa para montar a resposta HTTP.
:::

Repare no que **não** aparece em nenhum desses testes: nenhuma chamada de rede, nenhum arquivo `.db` criado, nenhum `await bcrypt.hash` de verdade (que é deliberadamente lento, ~80ms por chamada, para dificultar força bruta). Cinco testes desses rodam em menos tempo do que uma única chamada real ao `bcrypt`. É exatamente o ganho que a injeção de dependência da Aula 10 comprou: `authService` nunca soube que estava recebendo fakes, porque só depende do formato (`hash`, `comparar`, `gerar`), nunca da biblioteca concreta por trás.

`usuarioService` segue o mesmo padrão — um teste representativo:

```js
// tests/unit/usuarioService.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { criarUsuarioService } from '../../src/services/usuarioService.js';
import { criarFakeUsuarioRepository, fakeHashService } from './fakes.js';

describe('usuarioService', () => {
  let usuarioRepository;
  let usuarioService;

  beforeEach(() => {
    usuarioRepository = criarFakeUsuarioRepository();
    usuarioService = criarUsuarioService({ usuarioRepository, hashService: fakeHashService });
    usuarioRepository.criar({ nome: 'Ana', email: 'ana@exemplo.com', senhaHash: 'hash(x)' });
  });

  it('lança NOT_FOUND ao buscar um id inexistente', () => {
    expect(() => usuarioService.buscarPorId(999)).toThrow(
      expect.objectContaining({ statusCode: 404, code: 'NOT_FOUND' })
    );
  });

  it('atualiza parcialmente só os campos enviados', async () => {
    const atualizado = await usuarioService.atualizarParcial(1, { nome: 'Ana Souza' });

    expect(atualizado.nome).toBe('Ana Souza');
    expect(atualizado.email).toBe('ana@exemplo.com'); // não enviado, permanece igual
  });
});
```

## Testes de integração: subindo a API de verdade com Supertest

Os testes acima provam que a regra de negócio está correta **isolada**. Eles não provam que `app.js` está com as rotas certas, o middleware de autenticação no lugar certo, ou que o `errorHandler` está de fato conectado. Para isso, subimos o `app` real e disparamos requisições HTTP nele, com um banco SQLite em memória (via `DB_PATH=':memory:'` do `vitest.config.js`) no lugar do arquivo em disco:

```js
// tests/integration/usuarios.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import db from '../../src/db.js';

beforeEach(() => {
  db.exec('DELETE FROM usuarios'); // zera o banco em memória antes de cada teste
});

describe('POST /auth/registrar', () => {
  it('cria um usuário e nunca devolve a senha em hash', async () => {
    const res = await request(app)
      .post('/auth/registrar')
      .send({ nome: 'Ana Silva', email: 'ana@exemplo.com', senha: 'senhaForte123' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ nome: 'Ana Silva', email: 'ana@exemplo.com' });
    expect(res.body.senha_hash).toBeUndefined();
  });

  it('devolve 409 em e-mail duplicado', async () => {
    await request(app)
      .post('/auth/registrar')
      .send({ nome: 'Ana', email: 'ana@exemplo.com', senha: 'senhaForte123' });

    const res = await request(app)
      .post('/auth/registrar')
      .send({ nome: 'Outra Ana', email: 'ana@exemplo.com', senha: 'outraSenha1' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_IN_USE');
  });
});

describe('rotas protegidas por JWT', () => {
  async function registrarELogar() {
    await request(app)
      .post('/auth/registrar')
      .send({ nome: 'Ana', email: 'ana@exemplo.com', senha: 'senhaForte123' });

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'ana@exemplo.com', senha: 'senhaForte123' });

    return login.body.token;
  }

  it('bloqueia GET /usuarios sem token', async () => {
    const res = await request(app).get('/usuarios');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('libera GET /usuarios com um token válido', async () => {
    const token = await registrarELogar();

    const res = await request(app)
      .get('/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('PATCH atualiza só o campo enviado, mantendo o resto', async () => {
    const token = await registrarELogar();

    const res = await request(app)
      .patch('/usuarios/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Ana S. Souza' });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Ana S. Souza');
    expect(res.body.email).toBe('ana@exemplo.com');
  });

  it('DELETE remove e devolve 204', async () => {
    const token = await registrarELogar();

    const res = await request(app)
      .delete('/usuarios/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});

describe('rota inexistente', () => {
  it('devolve 404 com o formato de erro padrão', async () => {
    const res = await request(app).get('/rota/que/nao/existe');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
  });
});
```

Note que `supertest` nunca chama `app.listen()`: `request(app)` sobe o Express só o suficiente para processar a requisição em memória e devolver a resposta, sem ocupar uma porta de verdade. Isso também é o motivo de esses testes poderem rodar em paralelo sem conflito de porta.

::: tip Estes testes valem para a Aula 05 e para a Aula 10
Como eles só enxergam a fronteira HTTP (rota, status, corpo da resposta), o mesmo arquivo de teste passa tanto contra o `app.js` em camadas da Aula 05 quanto contra o `app.js` refatorado da Aula 10, é exatamente a prova prática de que aquela refatoração não mudou o contrato externo, só a organização interna.
:::

## Rodando os testes

```bash
npm test
```

```
✓ tests/unit/validacao.test.js (2)
✓ tests/unit/authService.test.js (5)
✓ tests/unit/usuarioService.test.js (2)
✓ tests/integration/usuarios.test.js (7)

Test Files  4 passed (4)
     Tests  16 passed (16)
```

Para reexecutar automaticamente a cada alteração salva, troque `vitest run` (uma execução só, usada em CI) por `vitest` sem o `run` durante o desenvolvimento — ele entra em modo *watch* e roda de novo só os testes afetados pelo arquivo que mudou.

::: tip Cobertura de código
`npm install -D @vitest/coverage-v8` habilita `vitest run --coverage`, que gera um relatório de quais linhas do `src/` nunca foram executadas por nenhum teste. É um indicador útil (áreas com 0% quase sempre escondem um caminho de erro não testado), mas cobertura alta não é sinônimo de teste bom: 100% de cobertura ainda passa se os testes nunca verificarem `expect`, só executarem o código.
:::

## Checklist do que este par de suítes garante

| Cenário | Coberto por |
| --- | --- |
| Regra de validação (campo obrigatório) | Unitário — `validacao.test.js` |
| E-mail duplicado no registro | Unitário (`authService`) e integração |
| Senha nunca sai em texto puro nem em hash nas respostas | Integração |
| Credenciais inválidas no login | Unitário (`authService`) |
| Token ausente/inválido bloqueia rota protegida | Integração |
| Atualização parcial (`PATCH`) preserva campos não enviados | Unitário e integração |
| Rota inexistente devolve o formato de erro padrão | Integração |
| `app.js` monta rotas e middlewares na ordem certa | Só integração — é exatamente o que o teste unitário, por design, não vê |


<style scoped src="./shared.css"></style>
