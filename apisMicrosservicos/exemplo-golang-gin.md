---
title: "APIs e Microsserviços: Aula 07"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Exemplo Prático: Go + Gin

<p class="lesson-subtitle">A mesma API de usuários, agora em Go: tipagem estática, middlewares explícitos e um binário único</p>

Vamos construir a **mesma** API de cadastro de usuários das aulas anteriores ([Node/Express](/apisMicrosservicos/exemplo-node-express), [Python/FastAPI](/apisMicrosservicos/exemplo-python-fastapi)), agora em Go com o [Gin](https://gin-gonic.com/): mesmas rotas, mesmos códigos de erro, mesmo banco SQLite em arquivo, mesma autenticação por JWT.

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

## Configurando o projeto

```bash
mkdir api-usuarios-go
cd api-usuarios-go
go mod init api-usuarios-go

go get github.com/gin-gonic/gin
go get modernc.org/sqlite
go get github.com/golang-jwt/jwt/v5
go get golang.org/x/crypto/bcrypt
```

- **gin**: framework web.
- **modernc.org/sqlite**: driver SQLite escrito em Go puro (sem precisar do compilador C/cgo para compilar o projeto), compatível com o pacote padrão `database/sql`.
- **golang-jwt/jwt**: geração e verificação de tokens JWT.
- **golang.org/x/crypto/bcrypt**: hashing de senha.

## Organizando o projeto

A mesma separação em camadas das aulas anteriores, em pacotes Go:

```
api-usuarios-go/
├── go.mod
├── main.go                              # monta o router, sobe o servidor
└── internal/
    ├── apierror/
    │   └── apierror.go                  # erro com status HTTP embutido
    ├── db/
    │   └── db.go                        # conexão SQLite + schema
    ├── models/
    │   └── usuario.go                   # queries SQL (camada "M")
    ├── controllers/
    │   ├── auth_controller.go           # registrar/login (camada "C")
    │   └── usuario_controller.go        # CRUD de usuários (camada "C")
    ├── middlewares/
    │   ├── auth.go                      # valida o JWT
    │   └── error_handler.go             # formata qualquer erro como JSON
    └── routes/
        └── routes.go                    # liga rotas a controllers
```

## Um erro com status HTTP embutido

```go
// internal/apierror/apierror.go
package apierror

type ApiError struct {
	StatusCode int
	Code       string
	Message    string
}

func (e *ApiError) Error() string {
	return e.Message
}

func New(statusCode int, code, message string) *ApiError {
	return &ApiError{StatusCode: statusCode, Code: code, Message: message}
}
```

Implementar o método `Error() string` é o que faz `*ApiError` satisfazer a interface `error` do Go, permitindo passá-lo para `c.Error(err)` como qualquer outro erro.

## Banco de dados: SQLite em arquivo

```go
// internal/db/db.go
package db

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func Conectar() {
	conexao, err := sql.Open("sqlite", "usuarios.db")
	if err != nil {
		log.Fatal(err)
	}

	schema := `
	CREATE TABLE IF NOT EXISTS usuarios (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		nome TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		senha_hash TEXT NOT NULL,
		criado_em TEXT NOT NULL DEFAULT (datetime('now'))
	)`

	if _, err := conexao.Exec(schema); err != nil {
		log.Fatal(err)
	}

	DB = conexao
}
```

O `import _ "modernc.org/sqlite"` registra o driver `"sqlite"` no pacote `database/sql` só pelo efeito colateral do import (por isso o `_`); é `sql.Open("sqlite", ...)` que efetivamente abre o arquivo.

## Model: acesso aos dados

```go
// internal/models/usuario.go
package models

import (
	"database/sql"

	"api-usuarios-go/internal/db"
)

type Usuario struct {
	ID       int64  `json:"id"`
	Nome     string `json:"nome"`
	Email    string `json:"email"`
	CriadoEm string `json:"criado_em"`
}

type UsuarioComSenha struct {
	Usuario
	SenhaHash string
}

func Criar(nome, email, senhaHash string) (*Usuario, error) {
	resultado, err := db.DB.Exec(
		"INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
		nome, email, senhaHash,
	)
	if err != nil {
		return nil, err
	}
	id, _ := resultado.LastInsertId()
	return BuscarPorID(id)
}

func Listar() ([]Usuario, error) {
	linhas, err := db.DB.Query("SELECT id, nome, email, criado_em FROM usuarios")
	if err != nil {
		return nil, err
	}
	defer linhas.Close()

	usuarios := []Usuario{}
	for linhas.Next() {
		var u Usuario
		if err := linhas.Scan(&u.ID, &u.Nome, &u.Email, &u.CriadoEm); err != nil {
			return nil, err
		}
		usuarios = append(usuarios, u)
	}
	return usuarios, nil
}

func BuscarPorID(id int64) (*Usuario, error) {
	var u Usuario
	err := db.DB.QueryRow(
		"SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?", id,
	).Scan(&u.ID, &u.Nome, &u.Email, &u.CriadoEm)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func BuscarPorEmail(email string) (*UsuarioComSenha, error) {
	var u UsuarioComSenha
	err := db.DB.QueryRow(
		"SELECT id, nome, email, criado_em, senha_hash FROM usuarios WHERE email = ?", email,
	).Scan(&u.ID, &u.Nome, &u.Email, &u.CriadoEm, &u.SenhaHash)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func buscarComSenhaPorID(id int64) (*UsuarioComSenha, error) {
	var u UsuarioComSenha
	err := db.DB.QueryRow(
		"SELECT id, nome, email, criado_em, senha_hash FROM usuarios WHERE id = ?", id,
	).Scan(&u.ID, &u.Nome, &u.Email, &u.CriadoEm, &u.SenhaHash)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func Atualizar(id int64, nome, email, senhaHash string) (*Usuario, error) {
	_, err := db.DB.Exec(
		"UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?",
		nome, email, senhaHash, id,
	)
	if err != nil {
		return nil, err
	}
	return BuscarPorID(id)
}

func AtualizarParcial(id int64, nome, email, senhaHash *string) (*Usuario, error) {
	atual, err := buscarComSenhaPorID(id)
	if err != nil || atual == nil {
		return nil, err
	}

	novoNome, novoEmail, novoHash := atual.Nome, atual.Email, atual.SenhaHash
	if nome != nil {
		novoNome = *nome
	}
	if email != nil {
		novoEmail = *email
	}
	if senhaHash != nil {
		novoHash = *senhaHash
	}

	_, err = db.DB.Exec(
		"UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?",
		novoNome, novoEmail, novoHash, id,
	)
	if err != nil {
		return nil, err
	}
	return BuscarPorID(id)
}

func Remover(id int64) (bool, error) {
	resultado, err := db.DB.Exec("DELETE FROM usuarios WHERE id = ?", id)
	if err != nil {
		return false, err
	}
	linhasAfetadas, _ := resultado.RowsAffected()
	return linhasAfetadas > 0, nil
}
```

`Usuario` nunca carrega `senha_hash` (por isso ele nunca aparece serializado em JSON); `UsuarioComSenha` existe só para as duas operações internas que precisam do hash: checar login e coalescer campos no `PATCH`.

## Middleware de autenticação (JWT)

Em Gin, um middleware é uma função que recebe `*gin.Context` e decide se chama `c.Next()` (segue para a próxima etapa) ou `c.Abort()` (interrompe ali):

```go
// internal/middlewares/auth.go
package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"api-usuarios-go/internal/apierror"
)

var JWTSecret = []byte("segredo-de-desenvolvimento")

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")

		if !strings.HasPrefix(header, "Bearer ") {
			c.Error(apierror.New(http.StatusUnauthorized, "UNAUTHORIZED", "Token ausente ou inválido."))
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(header, "Bearer ")

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return JWTSecret, nil
		})
		if err != nil || !token.Valid {
			c.Error(apierror.New(http.StatusUnauthorized, "UNAUTHORIZED", "Token ausente ou inválido."))
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		c.Set("usuarioID", int64(claims["sub"].(float64)))
		c.Next()
	}
}
```

`c.Error(err)` registra o erro na lista `c.Errors` do contexto **sem** escrever a resposta; quem lê essa lista e decide o que responder é o middleware de tratamento de erros, a seguir. `c.Set("usuarioID", ...)` deixa o id do usuário autenticado disponível para os controllers via `c.Get("usuarioID")`, caso precisem saber quem está fazendo a chamada.

## Middleware de tratamento de erros

Diferente do Express (onde o error handler é reconhecido pela assinatura de 4 argumentos), em Gin o padrão é um middleware normal que chama `c.Next()` primeiro, deixando o resto da cadeia (outros middlewares, o controller da rota) rodar, e só **depois** inspeciona `c.Errors` para decidir a resposta:

```go
// internal/middlewares/error_handler.go
package middlewares

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"api-usuarios-go/internal/apierror"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				log.Println("panic recuperado:", r)
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": gin.H{"code": "INTERNAL_ERROR", "message": "Erro interno do servidor."},
				})
				c.Abort()
			}
		}()

		c.Next() // roda os middlewares/controller seguintes

		if len(c.Errors) == 0 {
			return
		}

		err := c.Errors.Last().Err

		if apiErr, ok := err.(*apierror.ApiError); ok {
			c.JSON(apiErr.StatusCode, gin.H{
				"error": gin.H{"code": apiErr.Code, "message": apiErr.Message},
			})
			return
		}

		log.Println("erro não tratado:", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "INTERNAL_ERROR", "message": "Erro interno do servidor."},
		})
	}
}
```

O `defer`/`recover()` cobre **panics** (o equivalente Go a uma exceção não capturada, ex.: um índice fora dos limites); o código depois de `c.Next()` cobre erros que os controllers registraram explicitamente com `c.Error(err)`. Nos dois casos, o formato de resposta é o mesmo `{ "error": { "code", "message" } }`.

::: warning Ordem importa
Este middleware precisa ser o **primeiro** registrado no router (`router.Use(middlewares.ErrorHandler())`, antes de qualquer rota). Como ele funciona chamando `c.Next()` no meio da própria função, tudo que vier depois dele na cadeia roda "dentro" dele, e seus erros ficam visíveis em `c.Errors` quando o controle volta.
:::

## Controller de autenticação: registrar e login

```go
// internal/controllers/auth_controller.go
package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"api-usuarios-go/internal/apierror"
	"api-usuarios-go/internal/middlewares"
	"api-usuarios-go/internal/models"
)

type registrarEntrada struct {
	Nome  string `json:"nome"`
	Email string `json:"email"`
	Senha string `json:"senha"`
}

func Registrar(c *gin.Context) {
	var entrada registrarEntrada
	if err := c.ShouldBindJSON(&entrada); err != nil || entrada.Nome == "" || entrada.Email == "" || entrada.Senha == "" {
		c.Error(apierror.New(http.StatusBadRequest, "VALIDATION_ERROR", "Os campos 'nome', 'email' e 'senha' são obrigatórios."))
		return
	}

	existente, err := models.BuscarPorEmail(entrada.Email)
	if err != nil {
		c.Error(err)
		return
	}
	if existente != nil {
		c.Error(apierror.New(http.StatusConflict, "EMAIL_IN_USE", "Este e-mail já está cadastrado."))
		return
	}

	senhaHash, err := bcrypt.GenerateFromPassword([]byte(entrada.Senha), bcrypt.DefaultCost)
	if err != nil {
		c.Error(err)
		return
	}

	usuario, err := models.Criar(entrada.Nome, entrada.Email, string(senhaHash))
	if err != nil {
		c.Error(err)
		return
	}

	c.Header("Location", fmt.Sprintf("/usuarios/%d", usuario.ID))
	c.JSON(http.StatusCreated, usuario)
}

type loginEntrada struct {
	Email string `json:"email"`
	Senha string `json:"senha"`
}

func Login(c *gin.Context) {
	var entrada loginEntrada
	if err := c.ShouldBindJSON(&entrada); err != nil {
		c.Error(apierror.New(http.StatusUnauthorized, "INVALID_CREDENTIALS", "E-mail ou senha inválidos."))
		return
	}

	usuario, err := models.BuscarPorEmail(entrada.Email)
	if err != nil {
		c.Error(err)
		return
	}

	senhaValida := usuario != nil && bcrypt.CompareHashAndPassword([]byte(usuario.SenhaHash), []byte(entrada.Senha)) == nil
	if !senhaValida {
		c.Error(apierror.New(http.StatusUnauthorized, "INVALID_CREDENTIALS", "E-mail ou senha inválidos."))
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   usuario.ID,
		"nome":  usuario.Nome,
		"email": usuario.Email,
		"exp":   time.Now().Add(time.Hour).Unix(),
	})

	tokenAssinado, err := token.SignedString(middlewares.JWTSecret)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenAssinado})
}
```

Note o padrão repetido: em caso de erro, chamamos `c.Error(err)` e damos `return`, nunca escrevemos a resposta diretamente. Quem decide o status code e o corpo é sempre o `ErrorHandler`.

## Controller de usuários: CRUD

```go
// internal/controllers/usuario_controller.go
package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"api-usuarios-go/internal/apierror"
	"api-usuarios-go/internal/models"
)

func Listar(c *gin.Context) {
	usuarios, err := models.Listar()
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, usuarios)
}

func Buscar(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	usuario, err := models.BuscarPorID(id)
	if err != nil {
		c.Error(err)
		return
	}
	if usuario == nil {
		c.Error(apierror.New(http.StatusNotFound, "NOT_FOUND", "Usuário não encontrado."))
		return
	}
	c.JSON(http.StatusOK, usuario)
}

type substituirEntrada struct {
	Nome  string `json:"nome"`
	Email string `json:"email"`
	Senha string `json:"senha"`
}

func Substituir(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if atual, err := models.BuscarPorID(id); err != nil {
		c.Error(err)
		return
	} else if atual == nil {
		c.Error(apierror.New(http.StatusNotFound, "NOT_FOUND", "Usuário não encontrado."))
		return
	}

	var entrada substituirEntrada
	if err := c.ShouldBindJSON(&entrada); err != nil || entrada.Nome == "" || entrada.Email == "" || entrada.Senha == "" {
		c.Error(apierror.New(http.StatusBadRequest, "VALIDATION_ERROR", "Os campos 'nome', 'email' e 'senha' são obrigatórios."))
		return
	}

	outro, err := models.BuscarPorEmail(entrada.Email)
	if err != nil {
		c.Error(err)
		return
	}
	if outro != nil && outro.ID != id {
		c.Error(apierror.New(http.StatusConflict, "EMAIL_IN_USE", "Este e-mail já está cadastrado."))
		return
	}

	senhaHash, err := bcrypt.GenerateFromPassword([]byte(entrada.Senha), bcrypt.DefaultCost)
	if err != nil {
		c.Error(err)
		return
	}

	usuario, err := models.Atualizar(id, entrada.Nome, entrada.Email, string(senhaHash))
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, usuario)
}

type atualizarParcialEntrada struct {
	Nome  *string `json:"nome"`
	Email *string `json:"email"`
	Senha *string `json:"senha"`
}

func AtualizarParcial(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if atual, err := models.BuscarPorID(id); err != nil {
		c.Error(err)
		return
	} else if atual == nil {
		c.Error(apierror.New(http.StatusNotFound, "NOT_FOUND", "Usuário não encontrado."))
		return
	}

	var entrada atualizarParcialEntrada
	if err := c.ShouldBindJSON(&entrada); err != nil {
		c.Error(apierror.New(http.StatusBadRequest, "VALIDATION_ERROR", "Corpo da requisição inválido."))
		return
	}

	if entrada.Email != nil {
		outro, err := models.BuscarPorEmail(*entrada.Email)
		if err != nil {
			c.Error(err)
			return
		}
		if outro != nil && outro.ID != id {
			c.Error(apierror.New(http.StatusConflict, "EMAIL_IN_USE", "Este e-mail já está cadastrado."))
			return
		}
	}

	var senhaHash *string
	if entrada.Senha != nil {
		hash, err := bcrypt.GenerateFromPassword([]byte(*entrada.Senha), bcrypt.DefaultCost)
		if err != nil {
			c.Error(err)
			return
		}
		valor := string(hash)
		senhaHash = &valor
	}

	usuario, err := models.AtualizarParcial(id, entrada.Nome, entrada.Email, senhaHash)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, usuario)
}

func Remover(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	removido, err := models.Remover(id)
	if err != nil {
		c.Error(err)
		return
	}
	if !removido {
		c.Error(apierror.New(http.StatusNotFound, "NOT_FOUND", "Usuário não encontrado."))
		return
	}
	c.Status(http.StatusNoContent)
}
```

`Nome`, `Email` e `Senha` como ponteiros (`*string`) em `atualizarParcialEntrada` é como o Go representa "campo pode não ter vindo na requisição": um ponteiro `nil` significa "cliente não enviou este campo", diferente de uma string vazia (que significaria "cliente enviou, e mandou apagar o valor").

## Rotas

```go
// internal/routes/routes.go
package routes

import (
	"github.com/gin-gonic/gin"

	"api-usuarios-go/internal/controllers"
	"api-usuarios-go/internal/middlewares"
)

func Registrar(router *gin.Engine) {
	auth := router.Group("/auth")
	auth.POST("/registrar", controllers.Registrar)
	auth.POST("/login", controllers.Login)

	usuarios := router.Group("/usuarios")
	usuarios.Use(middlewares.Auth()) // exige token válido em todas as rotas deste grupo
	usuarios.GET("", controllers.Listar)
	usuarios.GET("/:id", controllers.Buscar)
	usuarios.PUT("/:id", controllers.Substituir)
	usuarios.PATCH("/:id", controllers.AtualizarParcial)
	usuarios.DELETE("/:id", controllers.Remover)
}
```

## Montando a aplicação

```go
// main.go
package main

import (
	"github.com/gin-gonic/gin"

	"api-usuarios-go/internal/db"
	"api-usuarios-go/internal/middlewares"
	"api-usuarios-go/internal/routes"
)

func main() {
	db.Conectar()

	router := gin.Default()
	router.Use(middlewares.ErrorHandler()) // primeiro middleware: envolve todos os outros

	routes.Registrar(router)

	router.Run(":8080")
}
```

## Rodando e testando com `curl`

```bash
go run main.go
```

```bash
# Registrar
curl -X POST http://localhost:8080/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Silva", "email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Login (guarde o token retornado)
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Listar usuários (rota protegida)
curl http://localhost:8080/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Atualizar parcialmente
curl -X PATCH http://localhost:8080/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana S. Souza"}'

# Remover
curl -X DELETE http://localhost:8080/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

::: tip Comparando com Node/Express e Python/FastAPI
A arquitetura observável de fora é idêntica nas três linguagens. A diferença está em como cada uma expressa "rodar algo antes/depois da rota" e "capturar qualquer erro": o Express usa uma função de 4 argumentos registrada por último; o FastAPI usa dependências (`Depends`) e handlers de exceção; o Gin usa um middleware que chama `c.Next()` e inspeciona `c.Errors` depois. Três formas diferentes de resolver o mesmo problema de transversalidade.
:::

::: warning Isso é um exemplo didático
O segredo do JWT está fixo no código só para facilitar o teste local; em produção ele precisa vir de uma variável de ambiente/segredo gerenciado. Este exemplo também não trata concorrência de escrita no SQLite sob alta carga nem *connection pooling* avançado, temas fora do escopo desta aula.
:::

[Testar esta API ao vivo →](/apisMicrosservicos/exemplos-api)

---

**Próxima página:** [Aula 08: Exemplo Prático: Elixir + Phoenix →](/apisMicrosservicos/exemplo-elixir-phoenix)

<style scoped src="./shared.css"></style>
