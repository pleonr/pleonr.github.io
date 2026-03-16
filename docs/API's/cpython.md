# API's REST com Python

Existem diversas bibliotecas(*ou frameworks*) no python para trabalhar com o API's REST, dentre elas podemos citar Django, Flask e FastAPI.

## FastAPI

O FastAPI é um framework popular para criação de APIs RESTful e serviços web em Python. Ele foi projetado para oferecer alta performance e facilidade de desenvolvimento, aproveitando os recursos assíncronos do Python (async/await) e a tipagem estática.


```bash
mkdir fastapi-dogceo && cd fastapi-dogceo
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install "fastapi[standard]" httpx
```

No arquivo main.py, o FastAPI é utilizado para criar a aplicação principal e definir os endpoints HTTP que respondem a requisições do cliente

```python
from fastapi import FastAPI, HTTPException

app = FastAPI(
    title="Api que consome API",
    description="Api que fornece cachorros!",
    version="0.0.1"
)
```

O objeto app representa a aplicação, e cada rota é criada com o uso de decoradores, como @app.get("/api/health") e @app.get("/api/cachorro"). Cada decorador indica ao FastAPI que determinada função será executada quando uma requisição for feita ao respectivo endpoint.

O FastAPI também se destaca pela documentação automática da API: ao executar o servidor, é possível acessar /docs (Swagger UI) e /redoc (ReDoc) para visualizar os endpoints, parâmetros e exemplos de resposta.

## httpx

Para consumir uma API externa vamos utilizar a biblioteca httpx, que é uma alternativa moderna e assíncrona ao tradicional requests.

Enquanto requests trabalha de forma síncrona (bloqueante), o httpx.AsyncClient permite que a aplicação realize chamadas HTTP sem interromper o fluxo de execução de outras tarefas, característica essencial em aplicações assíncronas como as criadas com FastAPI.

```python
@app.get("/api/cachorro")
async def get_cachorro():
    async with httpx.AsyncClient(timeout=1000) as client:
        response = await client.get(f"{URL_DOGCEO}/breeds/image/random")
        if response.status_code != 200:
            raise HTTPException(status_code=503, detail="DogCEO indisponível")
        data = response.json()
        return {data["message"]}
```

## Uvicorn

O Uvicorn é o servidor responsável por executar a aplicação FastAPI.

Diferente de servidores WSGI (como Gunicorn ou Flask), o Uvicorn é baseado em ASGI (Asynchronous Server Gateway Interface), um padrão projetado para suportar operações assíncronas nativamente.


```python
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

o Uvicorn inicializa o servidor e disponibiliza os endpoints definidos no código.
O parâmetro main:app indica que o servidor deve procurar o objeto app dentro do arquivo main.py.


## Dockerfile

```bash
FROM python:3.12-slim

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Makefile

```makefile
HOST ?= 0.0.0.0
PORT ?= 8000
VENV_DIR ?= .venv
IMAGE ?= api-cachorros
TAG ?= latest

.PHONY: install dev run test fmt docker-up docker-down
install:
	python -m venv .venv && . .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt

dev:
	uvicorn main:app --reload --port $(PORT)

run:
	uvicorn main:app --host 0.0.0.0 --port $(PORT)


.PHONY: health
health:
	@curl -fsS http://$(HOST):$(PORT)/api/health | jq . || curl -fsS http://$(HOST):$(PORT)/api/health

.PHONY: cachorro
cachorro:
	@curl -fsS http://$(HOST):$(PORT)/api/cachorro | jq . || curl -fsS http://$(HOST):$(PORT)/api/cachorro

.PHONY: docker-build
docker-build:
	@docker build -t $(IMAGE):$(TAG) .

.PHONY: docker-run
docker-run:
	@docker run --rm -p $(PORT):$(PORT) -e PORT=$(PORT) --name $(IMAGE)-ctr $(IMAGE):$(TAG)

.PHONY: docker-shell
docker-shell:
	@docker run --rm -it $(IMAGE):$(TAG) /bin/sh
```

## Teste

Para adicionar mais recursos podemos utilizar o pytest, para testes automatizados e ruff para lint do código.

Adicione as seguintes dependências no requirements.txt

```bash
pytest
pytest-cov
ruff
```

No Makefile adicione o alvo:

```python
.PHONY: test
test: install
	@echo "🔍 Executando testes..."
	@$(VENV_DIR)/bin/pytest -v --maxfail=1 --disable-warnings -q

.PHONY: lint
lint: install
	@$(VENV_DIR)/bin/ruff check .

.PHONY: coverage
coverage: install
	@$(VENV_DIR)/bin/pytest --cov=main --cov-report=term-missing

```

E crie a pasta para tests

```bash
├── tests/
│   ├── __init__.py
│   └── test_api.py
```

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_cachorro_endpoint():
    response = client.get("/api/cachorro")
    assert response.status_code == 200
    assert isinstance(response.json(), set) or isinstance(response.json(), dict)
```

Instale e rode:
```bash
pip install pytest pytest-asyncio
pytest -q
```

---

> main.py

```python
import httpx
from fastapi import FastAPI, HTTPException

app = FastAPI(
  title="Api que consome API",
  description="Api que fornece cachorros!",
  version="0.0.1"
)

URL_DOGCEO = "https://dog.ceo/api"

@app.get("/api/health")
async def health():
  return {"status": "ok"}

@app.get("/api/cachorro")
async def get_cachorro():
  async with httpx.AsyncClient(timeout=1000) as client:
    response = await client.get(f"{URL_DOGCEO}/breeds/image/random")
    if response.status_code != 200:
      print("A api de terceiro não retornou corretamente")
      raise HTTPException(status_code=503, detail="DogCEO indisponível")
    data = response.json()
    return {data["message"]}
```
