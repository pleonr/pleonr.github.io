# Parâmetros em APIs (REST)

Ao consumir ou construir uma API, é normal enviar dados para a api. Ao trabalhar com uma API REST podemos enviar parâmetros utilizando **URL Params**, **Query Params**, **Body Params** e **Headers**. Cada tipo tem uma finalidade e local de transporte distintos.

## Visão Geral

| Tipo               | Onde aparece                    | Uso principal                       | Exemplo                                       |
|--------------------|----------------------------------|-------------------------------------|-----------------------------------------------|
| URL Params         | Parte da rota (`/users/:id`)     | Identificar recurso específico       | `/users/42`                                   |
| Query Params       | Após `?` na URL                  | Filtros, paginação, ordenação       | `/products?limit=10&page=2&sort=price`        |
| Body Params        | Corpo da requisição              | Criação/atualização de recursos     | JSON: `{ "name": "Ana", "email": "a@x.com" }` |
| Headers            | Cabeçalho HTTP                   | Metadados (auth, mime, cache)       | `Authorization: Bearer <token>`               |

---

## 1) URL Params (Path Params)

**Definição:** Parte **obrigatória** do caminho da rota, usada para identificar um **recurso único**.

**Exemplo de rota e chamada**

```
GET /users/:id
GET /users/42
```

**Express (TypeScript)**

```ts
import { Router, Request, Response } from 'express';
const router = Router();

router.get('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params; // string
  res.json({ id });
});

export default router;
```

**Com dois URL Params**

```
GET /playlists/:playlistId/musics/:musicId
GET /playlists/10/musics/55
```

```ts
router.get('/playlists/:playlistId/musics/:musicId', (req, res) => {
  const { playlistId, musicId } = req.params;
  res.json({ playlistId, musicId });
});
```

---

## 2) Query Params

**Definição:** Parâmetros **opcionais** na URL após `?`, separados por `&`. Usados para **filtrar**, **paginar**, **ordenar** etc.

**Exemplo**

```
GET /musics?genre=rock&year=2020&limit=20&page=2
```

**Express**

```ts
router.get('/musics', (req, res) => {
  const { genre, year, limit = '20', page = '1' } = req.query;
  res.json({ genre, year, limit, page });
});
```

**Arrays e múltiplos valores**

```
GET /musics?genre=rock&genre=blues
# ou
GET /musics?genre[]=rock&genre[]=blues
```

No Express, acesse como `req.query.genre` (pode ser `string | string[]`).

---

## 3) Body Params

**Definição:** Dados enviados no **corpo** da requisição, ideais para **criar** ou **atualizar** recursos.

**Requer middleware** no Express:
```ts
app.use(express.json()); // para application/json
```

**Exemplo (POST JSON)**

```http
POST /musics
Content-Type: application/json

{
  "title": "Back in Black",
  "author": "AC/DC",
  "year": 1980,
  "duration": 255
}
```

**Express**

```ts
router.post('/musics', (req, res) => {
  const { title, author, year, duration } = req.body;
  // validação, persistência...
  res.status(201).json({ title, author, year, duration });
});
```

**Outros formatos de body**
- `multipart/form-data` (upload de arquivos)
- `application/x-www-form-urlencoded` (forms)
- `text/plain`

---

## 4) Headers

**Definição:** Metadados enviados no **cabeçalho** da requisição/resposta. Não fazem parte do body.

**Comuns em APIs**

- `Authorization: Bearer <jwt>` — autenticação/autorização
- `Content-Type: application/json` — tipo do corpo enviado
- `Accept: application/json` — formato aceito na resposta
- `Cache-Control: no-cache` — cache
- `X-Request-Id: ...` — rastreabilidade

**Express**

```ts
router.get('/secure', (req, res) => {
  const auth = req.headers['authorization']; // ou req.get('authorization')
  if (!auth) return res.status(401).json({ error: 'Token não enviado' });
  res.json({ ok: true });
});
```

---

## 5) Exemplo Unificado (Músicas por Usuário)

```
GET /users/:userId/musics?genre=rock&year=2020
```

- **URL Param:** `:userId` → qual usuário.
- **Query Param:** `genre`, `year` → filtros opcionais.
- **Body Param (se fosse POST/PUT):** dados complexos (JSON).
- **Headers:** `Authorization`, `Accept`, `Content-Type`…

**Express**

```ts
router.get('/users/:userId/musics', (req, res) => {
  const { userId } = req.params;
  const { genre, year } = req.query;
  const auth = req.get('authorization');
  res.json({ userId, genre, year, auth });
});
```

---

## 6) Boas Práticas

- **Consistência** de nomes (`snake_case` ou `camelCase`) e semântica clara.
- **URL Params** para **identidade** de recurso; **Query** para **filtros**; **Body** para **dados**.
- **Validação** de entrada (ex.: `zod`, `joi`, `class-validator`).
- **Documentação** com OpenAPI/Swagger.
- **Paginação** previsível (`limit`, `page` ou `cursor`).
- **Erros** padronizados (status code + payload consistente).
- **Headers**: sempre envie `Content-Type` correto e valide `Authorization` quando necessário.

---

## 7) Exemplos de Requisições

### curl
```bash
curl -H "Authorization: Bearer TOKEN"   "http://localhost:3000/api/users/1/musics?genre=rock&year=2020"
```

### REST Client (VSCode)
```http
GET http://localhost:3000/api/users/1/musics?genre=rock&year=2020
Authorization: Bearer TOKEN
Accept: application/json
```

### Postman
- Sete `{{baseUrl}}` e crie requisições com **Params**, **Headers** e **Body** conforme necessário.

---

## 8) Tipagem (TypeScript)

```ts
// Tipos úteis para req
import { Request } from 'express';

type UserMusicParams = { userId: string };
type UserMusicQuery = { genre?: string; year?: string };

type Req = Request<UserMusicParams, any, any, UserMusicQuery>;

router.get('/users/:userId/musics', (req: Req, res) => {
  // req.params.userId: string
  // req.query.genre: string | undefined
  res.json({ ok: true });
});
```

---

## 9) Segurança e Validação

- **Sanitização** de input (evite injeções).
- Valide **tipos** e **intervalos** (ex.: `year` como número válido).
- Use **HTTPS** e tokens **curtos** (JWT com expiração).
- **Rate limiting** e **CORS** quando expor publicamente.
