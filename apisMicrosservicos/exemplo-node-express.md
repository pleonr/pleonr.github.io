---
title: "APIs e Microsserviços: Aula 05"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Exemplo Prático: Node.js + Express

<p class="lesson-subtitle">Construindo uma API REST de tarefas do zero, aplicando as boas práticas das aulas anteriores</p>

Vamos construir uma API REST completa para gerenciar uma lista de tarefas (*to-do list*), aplicando os verbos HTTP, status codes e formato de erro discutidos na [Aula 03](/apisMicrosservicos/boas-praticas).

## Configurando o projeto

```bash
mkdir api-tarefas
cd api-tarefas
npm init -y
npm install express
```

Isso cria um `package.json` e instala o [Express](https://expressjs.com/), o framework web mais usado no ecossistema Node.js.

## Servidor básico

Crie um arquivo `server.js`:

```js
const express = require('express');
const app = express();

app.use(express.json()); // interpreta o corpo das requisições como JSON

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
```

`express.json()` é um *middleware*: uma função que roda antes das rotas, aqui responsável por transformar o corpo da requisição (texto JSON) em um objeto JavaScript acessível em `req.body`.

## Os dados: uma "base" em memória

Para manter o exemplo simples, vamos guardar as tarefas em um array na memória do processo (em uma aplicação real, isso seria um banco de dados):

```js
let tarefas = [
  { id: 1, titulo: 'Estudar Node.js', concluida: false }
];
let proximoId = 2;
```

## Listando tarefas: `GET /tarefas`

```js
app.get('/tarefas', (req, res) => {
  res.json(tarefas);
});
```

## Buscando uma tarefa: `GET /tarefas/:id`

```js
app.get('/tarefas/:id', (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));

  if (!tarefa) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Tarefa não encontrada.' }
    });
  }

  res.json(tarefa);
});
```

## Criando uma tarefa: `POST /tarefas`

```js
app.post('/tarefas', (req, res) => {
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: "O campo 'titulo' é obrigatório." }
    });
  }

  const novaTarefa = { id: proximoId++, titulo, concluida: false };
  tarefas.push(novaTarefa);

  res.status(201).location(`/tarefas/${novaTarefa.id}`).json(novaTarefa);
});
```

Note o `201 Created` (não `200`) e o header `Location` apontando para o recurso recém-criado, ambos vistos na [Aula 03](/apisMicrosservicos/boas-praticas#status-codes-http).

## Atualizando uma tarefa: `PUT` e `PATCH`

```js
// PUT substitui a tarefa inteira
app.put('/tarefas/:id', (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tarefa não encontrada.' } });
  }

  const { titulo, concluida } = req.body;
  if (!titulo) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: "O campo 'titulo' é obrigatório." } });
  }

  tarefa.titulo = titulo;
  tarefa.concluida = Boolean(concluida);
  res.json(tarefa);
});

// PATCH altera só os campos enviados
app.patch('/tarefas/:id', (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tarefa não encontrada.' } });
  }

  Object.assign(tarefa, req.body);
  res.json(tarefa);
});
```

## Removendo uma tarefa: `DELETE /tarefas/:id`

```js
app.delete('/tarefas/:id', (req, res) => {
  const indice = tarefas.findIndex(t => t.id === Number(req.params.id));

  if (indice === -1) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tarefa não encontrada.' } });
  }

  tarefas.splice(indice, 1);
  res.status(204).send(); // sem corpo na resposta
});
```

## Middleware de rota não encontrada

Se nenhuma rota bater, devolvemos um 404 padronizado (ao invés do HTML de erro padrão do Express):

```js
app.use((req, res) => {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: `Rota ${req.method} ${req.path} não existe.` }
  });
});
```

::: tip Ordem importa
Middlewares e rotas no Express são avaliados na ordem em que são declarados. Este middleware "pega tudo" precisa vir **depois** de todas as rotas. Senão, ele responderia antes delas serem alcançadas.
:::

## Testando com `curl`

```bash
# Listar
curl http://localhost:3000/tarefas

# Criar
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Aprender Express"}'

# Marcar como concluída (PATCH)
curl -X PATCH http://localhost:3000/tarefas/2 \
  -H "Content-Type: application/json" \
  -d '{"concluida": true}'

# Remover
curl -X DELETE http://localhost:3000/tarefas/2
```

## Código completo

```js
const express = require('express');
const app = express();

app.use(express.json());

let tarefas = [
  { id: 1, titulo: 'Estudar Node.js', concluida: false }
];
let proximoId = 2;

app.get('/tarefas', (req, res) => {
  res.json(tarefas);
});

app.get('/tarefas/:id', (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tarefa não encontrada.' } });
  }
  res.json(tarefa);
});

app.post('/tarefas', (req, res) => {
  const { titulo } = req.body;
  if (!titulo) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: "O campo 'titulo' é obrigatório." } });
  }
  const novaTarefa = { id: proximoId++, titulo, concluida: false };
  tarefas.push(novaTarefa);
  res.status(201).location(`/tarefas/${novaTarefa.id}`).json(novaTarefa);
});

app.put('/tarefas/:id', (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tarefa não encontrada.' } });
  }
  const { titulo, concluida } = req.body;
  if (!titulo) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: "O campo 'titulo' é obrigatório." } });
  }
  tarefa.titulo = titulo;
  tarefa.concluida = Boolean(concluida);
  res.json(tarefa);
});

app.patch('/tarefas/:id', (req, res) => {
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tarefa não encontrada.' } });
  }
  Object.assign(tarefa, req.body);
  res.json(tarefa);
});

app.delete('/tarefas/:id', (req, res) => {
  const indice = tarefas.findIndex(t => t.id === Number(req.params.id));
  if (indice === -1) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tarefa não encontrada.' } });
  }
  tarefas.splice(indice, 1);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: `Rota ${req.method} ${req.path} não existe.` }
  });
});

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
```

::: warning Isso é um exemplo didático
Guardar dados em um array na memória significa que tudo se perde quando o processo reinicia. Em uma API real, isso seria um banco de dados (ex.: PostgreSQL, MongoDB). O objetivo aqui é focar na modelagem das rotas e no formato das respostas.
:::

[Testar esta API ao vivo →](/apisMicrosservicos/exemplos-api)

---

**Próxima página:** [Aula 06: Exemplo Prático: Python + FastAPI →](/apisMicrosservicos/exemplo-python-fastapi)

<style scoped src="./shared.css"></style>
