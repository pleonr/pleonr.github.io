# Adicionando Swagger e Docker a API

Vamos adicionar o swagger a API criada em aula com suporte aos frameworks **Gin**, **GORM**, **swaggo**, conexão ao banco **PostgreSQL**.

## 🔧 Pré-requisitos

- Go instalado ([instalar](https://go.dev/dl/))
- Api [api-singleton.zip](../../static/api-singleton.zip){:download="api-singleton"} ou
- Api [api-injection.zip](../../static/api-injection.zip){:download="api-injection"}
- PostgreSQL instalado ou em container (crie o banco `goapi`)
- Git (opcional)
- Postman, Insomnia, curl ou outra IDE para testar

## 📁 Estrutura do Projeto

```
go-api/
├── main.go                  # Inicializa a aplicação
├── config/
│   └── database.go          # Conexão com banco de dados e carregamento do .env
├── controllers/
│   └── item_controller.go   # Lida com as requisições HTTP
├── models/
│   └── item.go              # Define a estrutura da entidade (modelo)
├── routes/
│   └── routes.go            # Define as rotas da aplicação
├── services/
│   └── item_service.go      # Regras de negócio e acesso ao banco
├── .env                     # Variáveis de ambiente
└── go.mod                   # Dependências do projeto
```

## 1. Criar o banco PostgreSQL

Acesse o PostgreSQL e execute:

```sql
CREATE DATABASE goapi;
```

### 3. Configurar o `.env`

No arquivo `.env`, defina as credenciais do banco:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=goapi
DB_SSLMODE=disable
```

> ⚠️ Este arquivo não deve ser versionado em produção.

## 2. Instalar as dependências

```bash
go mod tidy
```

Isso baixa as dependências listadas em `go.mod`.

## 3. Executar o projeto

```bash
go run main.go
```

A aplicação ficará disponível em `http://localhost:8080`.

---

## Explicação por Arquivo

### `main.go`
Ponto de entrada. Conecta ao banco, realiza o `Migrate` e inicia o servidor com as rotas.

### `config/database.go`
- Carrega variáveis do `.env`
- Conecta ao PostgreSQL com GORM

### `models/item.go`
Define a estrutura da entidade `Item`. O `gorm.Model` adiciona campos como ID, timestamps etc.

### `services/item_service.go`
Implementa a lógica de negócio e interage diretamente com o banco (usando GORM).

### `controllers/item_controller.go`
Recebe as requisições HTTP, chama os serviços e retorna respostas JSON.

### `routes/routes.go`
Agrupa todas as rotas em um único lugar.

## Testando com curl

```bash
curl -X POST http://localhost:8080/items -H "Content-Type: application/json" -d '{"name":"Meu Item"}'
curl http://localhost:8080/items
```

## Adicionando o docker

Crie o arquivo Dockerfile na `raiz` do projeto

```dockerfile
FROM golang:1.21

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos para o container
COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./

# Compilar a aplicação
RUN go build -o main .

# Expor a porta padrão da aplicação
EXPOSE 8080

# Comando para rodar a aplicação
CMD ["./main"]
```

Vamos criar também o `docker-compose.yaml` que vai iniciar a api e um container com o postgres


```yaml
version: '3.9'

services:
  db:
    image: postgres:15
    container_name: goapi-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: goapi
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    container_name: goapi-app
    ports:
      - "8080:8080"
    depends_on:
      - db
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: goapi
      DB_SSLMODE: disable

volumes:
  postgres_data:
```

Para executar a API e banco vamos usar

```bash
docker-compose up --build
```

A API estará em: `http://localhost:8080`
O PostgreSQL estará em: `localhost:5432` (usuário: `postgres`, senha: `postgres`)


## Swagger

Originalmente, Swagger era tanto o nome da especificação de APIs quanto das ferramentas. Com o tempo, a especificação foi renomeada para OpenAPI Specification (OAS) e o nome Swagger ficou para o conjunto de ferramentas que implementa essa especificação.

```golang
go install github.com/swaggo/swag/cmd/swag@latest
go get -u github.com/swaggo/files
go get -u github.com/swaggo/gin-swagger
```

O primeiro comando instala a CLI swag, usada para gerar os arquivos de documentação.

### main.go

Em cima da função `main` adicione as seguintes anotações para a api

```go
// @title           API de Itens
// @version         1.0
// @description     Esta é uma API exemplo em Go com Swagger, Gin e GORM.
// @host            localhost:8080
// @BasePath        /
```

### item_controller.go

Depois adicione as anotações para os controllers, cada controller e handler deve ter suas anotações...
Faça isso para cada handler (POST, GET /:id, etc).

```go
package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "go-api/models"
    "go-api/services"
)

// GetItems godoc
// @Summary      Lista todos os itens
// @Description  Retorna todos os itens cadastrados
// @Tags         items
// @Produce      json
// @Success      200  {array}  models.Item
// @Router       /items [get]
func GetItems(c *gin.Context) {
    c.JSON(http.StatusOK, services.GetAllItems())
}

// GetItem godoc
// @Summary      Busca item por ID
// @Description  Retorna um item específico com base no ID fornecido
// @Tags         items
// @Produce      json
// @Param        id   path      int  true  "ID do Item"
// @Success      200  {object}  models.Item
// @Failure      404  {object}  map[string]string
// @Router       /items/{id} [get]
func GetItem(c *gin.Context) {
    id := c.Param("id")
    item := services.GetItemByID(id)
    if item == nil {
        c.JSON(http.StatusNotFound, gin.H{"message": "item not found"})
        return
    }
    c.JSON(http.StatusOK, item)
}

// CreateItem godoc
// @Summary      Cria um novo item
// @Description  Adiciona um novo item ao banco de dados
// @Tags         items
// @Accept       json
// @Produce      json
// @Param        item  body      models.Item  true  "Item a ser criado"
// @Success      201   {object}  models.Item
// @Failure      400   {object}  map[string]string
// @Router       /items [post]
func CreateItem(c *gin.Context) {
    var newItem models.Item
    if err := c.ShouldBindJSON(&newItem); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    item := services.AddItem(newItem)
    c.JSON(http.StatusCreated, item)
}

// UpdateItem godoc
// @Summary      Atualiza um item existente
// @Description  Atualiza os dados de um item existente com base no ID
// @Tags         items
// @Accept       json
// @Produce      json
// @Param        id    path      int          true  "ID do Item"
// @Param        item  body      models.Item  true  "Dados atualizados"
// @Success      200   {object}  models.Item
// @Failure      400   {object}  map[string]string
// @Failure      404   {object}  map[string]string
// @Router       /items/{id} [put]
func UpdateItem(c *gin.Context) {
    id := c.Param("id")
    var updatedItem models.Item
    if err := c.ShouldBindJSON(&updatedItem); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    success := services.UpdateItem(id, updatedItem)
    if !success {
        c.JSON(http.StatusNotFound, gin.H{"message": "item not found"})
        return
    }
    c.JSON(http.StatusOK, updatedItem)
}

// DeleteItem godoc
// @Summary      Remove um item
// @Description  Exclui um item com base no ID fornecido
// @Tags         items
// @Produce      json
// @Param        id   path      int  true  "ID do Item"
// @Success      200  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Router       /items/{id} [delete]
func DeleteItem(c *gin.Context) {
    id := c.Param("id")
    success := services.DeleteItem(id)
    if !success {
        c.JSON(http.StatusNotFound, gin.H{"message": "item not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "item deleted"})
}
```

### gerar documentação

Depois vamos usar a ferramenta do swagger para gerar a documentação com base nas anotações existentes.

```golang
swag init
```

Isso criará a pasta `docs` e dois arquivos: `docs/swagger.json` e `docs/swagger.yaml`.

### Integrar com o Gin

No arquivo `routes.go` precisamos adicionar o import  do `gin-swagger`

```go
import (
    ginSwagger "github.com/swaggo/gin-swagger"
    swaggerFiles "github.com/swaggo/files"
    _ "go-api-example/docs" // importa os docs gerados
)
```

Na função `SetupRoutes()`

```go
r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
```

### Acessando

A documentação deve estar disponível em `http://localhost:8080/swagger/index.html`

### Adicionando ao Dockerfile

Precisamos adicionar a cópia da pasta docs no dockerfile

```dockerfile
COPY ./docs ./docs
```

