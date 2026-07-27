---
title: "APIs e Microsserviços: Aula 06"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Exemplo Prático: Python + FastAPI

<p class="lesson-subtitle">A mesma API de tarefas, agora em Python: com validação automática e documentação gerada de graça</p>

Vamos construir a **mesma** API de tarefas da [Aula 05](/apisMicrosservicos/exemplo-node-express), agora com [FastAPI](https://fastapi.tiangolo.com/): um framework Python que gera validação de dados e documentação interativa automaticamente, a partir dos tipos declarados no próprio código.

## Configurando o projeto

```bash
mkdir api-tarefas-py
cd api-tarefas-py
python -m venv venv
source venv/bin/activate  # no Windows: venv\Scripts\activate

pip install fastapi uvicorn
```

O [Uvicorn](https://www.uvicorn.org/) é o servidor ASGI que efetivamente roda a aplicação FastAPI.

## Modelando os dados com Pydantic

Diferente do exemplo em Express, onde a validação de `req.body` era feita manualmente (`if (!titulo) ...`), o FastAPI usa **Pydantic**: você declara o formato esperado como uma classe Python com tipos, e a validação acontece sozinha.

```python
from pydantic import BaseModel


class NovaTarefa(BaseModel):
    titulo: str


class Tarefa(NovaTarefa):
    id: int
    concluida: bool = False


class AtualizarTarefa(BaseModel):
    titulo: str | None = None
    concluida: bool | None = None
```

Se uma requisição chegar sem o campo `titulo`, ou com o tipo errado, o FastAPI já responde `422 Unprocessable Entity` com os detalhes do erro, sem que você escreva uma linha de validação.

## Servidor básico

Crie um arquivo `main.py`:

```python
from fastapi import FastAPI

app = FastAPI(title="API de Tarefas")
```

## Os dados: uma "base" em memória

```python
tarefas: list[Tarefa] = [
    Tarefa(id=1, titulo="Estudar FastAPI", concluida=False)
]
proximo_id = 2
```

## Listando tarefas: `GET /tarefas`

```python
@app.get("/tarefas", response_model=list[Tarefa])
def listar_tarefas():
    return tarefas
```

`response_model=list[Tarefa]` documenta (e valida) o formato da resposta. Isso também alimenta a documentação automática.

## Buscando uma tarefa: `GET /tarefas/{id}`

```python
from fastapi import HTTPException


@app.get("/tarefas/{tarefa_id}", response_model=Tarefa)
def buscar_tarefa(tarefa_id: int):
    for tarefa in tarefas:
        if tarefa.id == tarefa_id:
            return tarefa
    raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
```

Note que `tarefa_id: int` já garante que só aceitamos números na URL: uma chamada para `/tarefas/abc` recebe `422` automaticamente, sem código extra.

## Criando uma tarefa: `POST /tarefas`

```python
from fastapi import Response


@app.post("/tarefas", response_model=Tarefa, status_code=201)
def criar_tarefa(nova_tarefa: NovaTarefa, response: Response):
    global proximo_id
    tarefa = Tarefa(id=proximo_id, titulo=nova_tarefa.titulo, concluida=False)
    tarefas.append(tarefa)
    proximo_id += 1

    response.headers["Location"] = f"/tarefas/{tarefa.id}"
    return tarefa
```

O parâmetro `nova_tarefa: NovaTarefa` já diz ao FastAPI para ler e validar o corpo da requisição como um `NovaTarefa`, o equivalente ao `req.body` do Express, mas validado antes mesmo de a função rodar.

## Atualizando uma tarefa: `PUT` e `PATCH`

```python
@app.put("/tarefas/{tarefa_id}", response_model=Tarefa)
def substituir_tarefa(tarefa_id: int, dados: NovaTarefa):
    for tarefa in tarefas:
        if tarefa.id == tarefa_id:
            tarefa.titulo = dados.titulo
            tarefa.concluida = False
            return tarefa
    raise HTTPException(status_code=404, detail="Tarefa não encontrada.")


@app.patch("/tarefas/{tarefa_id}", response_model=Tarefa)
def atualizar_tarefa(tarefa_id: int, dados: AtualizarTarefa):
    for tarefa in tarefas:
        if tarefa.id == tarefa_id:
            if dados.titulo is not None:
                tarefa.titulo = dados.titulo
            if dados.concluida is not None:
                tarefa.concluida = dados.concluida
            return tarefa
    raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
```

## Removendo uma tarefa: `DELETE /tarefas/{id}`

```python
@app.delete("/tarefas/{tarefa_id}", status_code=204)
def remover_tarefa(tarefa_id: int):
    for indice, tarefa in enumerate(tarefas):
        if tarefa.id == tarefa_id:
            tarefas.pop(indice)
            return
    raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
```

## Rodando o servidor

```bash
uvicorn main:app --reload
```

O `--reload` reinicia o servidor automaticamente a cada alteração no código, ótimo durante o desenvolvimento.

## Documentação automática

Aqui está a maior diferença em relação ao exemplo em Express: **sem escrever nenhuma linha a mais**, o FastAPI gera documentação interativa a partir dos tipos e modelos já declarados:

- `http://localhost:8000/docs`: Swagger UI, com botão "Try it out" para testar cada endpoint.
- `http://localhost:8000/redoc`: documentação em formato Redoc.
- `http://localhost:8000/openapi.json`: a especificação OpenAPI crua, gerada automaticamente (ver [Aula 04](/apisMicrosservicos/documentacao)).

::: tip Comparando com o exemplo em Node/Express
No Express, a validação (`if (!titulo) ...`) e a documentação (um arquivo OpenAPI separado) são duas tarefas manuais e independentes. É fácil uma ficar desatualizada em relação à outra. No FastAPI, o modelo Pydantic **é** ao mesmo tempo a validação e a fonte da documentação: as duas nunca podem divergir, porque são a mesma declaração.
:::

## Testando com `curl`

```bash
# Listar
curl http://localhost:8000/tarefas

# Criar
curl -X POST http://localhost:8000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Aprender FastAPI"}'

# Marcar como concluída (PATCH)
curl -X PATCH http://localhost:8000/tarefas/2 \
  -H "Content-Type: application/json" \
  -d '{"concluida": true}'

# Remover
curl -X DELETE http://localhost:8000/tarefas/2
```

## Código completo

```python
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel


class NovaTarefa(BaseModel):
    titulo: str


class Tarefa(NovaTarefa):
    id: int
    concluida: bool = False


class AtualizarTarefa(BaseModel):
    titulo: str | None = None
    concluida: bool | None = None


app = FastAPI(title="API de Tarefas")

tarefas: list[Tarefa] = [
    Tarefa(id=1, titulo="Estudar FastAPI", concluida=False)
]
proximo_id = 2


@app.get("/tarefas", response_model=list[Tarefa])
def listar_tarefas():
    return tarefas


@app.get("/tarefas/{tarefa_id}", response_model=Tarefa)
def buscar_tarefa(tarefa_id: int):
    for tarefa in tarefas:
        if tarefa.id == tarefa_id:
            return tarefa
    raise HTTPException(status_code=404, detail="Tarefa não encontrada.")


@app.post("/tarefas", response_model=Tarefa, status_code=201)
def criar_tarefa(nova_tarefa: NovaTarefa, response: Response):
    global proximo_id
    tarefa = Tarefa(id=proximo_id, titulo=nova_tarefa.titulo, concluida=False)
    tarefas.append(tarefa)
    proximo_id += 1
    response.headers["Location"] = f"/tarefas/{tarefa.id}"
    return tarefa


@app.put("/tarefas/{tarefa_id}", response_model=Tarefa)
def substituir_tarefa(tarefa_id: int, dados: NovaTarefa):
    for tarefa in tarefas:
        if tarefa.id == tarefa_id:
            tarefa.titulo = dados.titulo
            tarefa.concluida = False
            return tarefa
    raise HTTPException(status_code=404, detail="Tarefa não encontrada.")


@app.patch("/tarefas/{tarefa_id}", response_model=Tarefa)
def atualizar_tarefa(tarefa_id: int, dados: AtualizarTarefa):
    for tarefa in tarefas:
        if tarefa.id == tarefa_id:
            if dados.titulo is not None:
                tarefa.titulo = dados.titulo
            if dados.concluida is not None:
                tarefa.concluida = dados.concluida
            return tarefa
    raise HTTPException(status_code=404, detail="Tarefa não encontrada.")


@app.delete("/tarefas/{tarefa_id}", status_code=204)
def remover_tarefa(tarefa_id: int):
    for indice, tarefa in enumerate(tarefas):
        if tarefa.id == tarefa_id:
            tarefas.pop(indice)
            return
    raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
```

::: warning Isso é um exemplo didático
Assim como no exemplo em Express, os dados vivem em uma lista na memória do processo. Em uma API real, isso seria um banco de dados. Para deployar essa API dentro de um container, veja a [aula de Docker](/virtualizacao/docker).
:::

[Testar esta API ao vivo →](/apisMicrosservicos/exemplos-api)

---

Isso conclui a série de **APIs e Microsserviços**. Para aprofundar em comunicação entre serviços, consistência de dados e tolerância a falhas, veja a seção [Sistemas Distribuídos](/sistemasDistribuidos/).

<style scoped src="./shared.css"></style>
