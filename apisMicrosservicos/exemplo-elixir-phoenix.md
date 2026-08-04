---
title: "APIs e Microsserviços: Aula 08"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Exemplo Prático: Elixir + Phoenix

<p class="lesson-subtitle">A mesma API de usuários, agora em Elixir: o framework que já divide o código em Model, View e Controller para você</p>

Vamos fechar a série construindo a **mesma** API de cadastro de usuários das aulas anteriores ([Node/Express](/apisMicrosservicos/exemplo-node-express), [Python/FastAPI](/apisMicrosservicos/exemplo-python-fastapi), [Go/Gin](/apisMicrosservicos/exemplo-golang-gin)), agora em Elixir com o [Phoenix](https://www.phoenixframework.org/): mesmas rotas, mesmos códigos de erro, mesmo banco SQLite em arquivo, mesma autenticação por JWT.

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
mix archive.install hex phx_new
mix phx.new cadastro --no-html --no-assets --database sqlite3
cd cadastro
```

`--no-html --no-assets` pedem um projeto **só de API** (sem gerar páginas HTML, LiveView ou pipeline de assets); `--database sqlite3` já configura o `Ecto` para usar SQLite em arquivo em vez do Postgres padrão.

Adicione as duas dependências que faltam ao `mix.exs` (hashing de senha e JWT):

```elixir
# mix.exs
defp deps do
  [
    # ...dependências geradas pelo phx.new (ecto_sqlite3, phoenix, jason, etc.)
    {:bcrypt_elixir, "~> 3.0"},
    {:joken, "~> 2.6"}
  ]
end
```

```bash
mix deps.get
```

## Organizando o projeto: o Phoenix já é MVC

Diferente das três aulas anteriores, aqui não precisamos decidir a divisão de camadas: o gerador do Phoenix já separa o projeto em duas árvores, e essa separação **é** o M-V-C:

```
cadastro/
├── lib/
│   ├── cadastro/                          # "M": regras de negócio e acesso a dados
│   │   ├── accounts.ex                    # o *context*: API pública da camada de dados
│   │   ├── accounts/
│   │   │   └── usuario.ex                 # schema Ecto + changesets (validação)
│   │   └── repo.ex                        # gerado pelo phx.new
│   └── cadastro_web/                      # "V" + "C"
│       ├── controllers/
│       │   ├── auth_controller.ex         # "C": registrar/login
│       │   ├── auth_json.ex               # "V": serializa a resposta de auth
│       │   ├── usuario_controller.ex      # "C": CRUD de usuários
│       │   ├── usuario_json.ex            # "V": serializa usuários
│       │   ├── fallback_controller.ex     # middleware de tratamento de erros
│       │   └── error_json.ex              # gerado pelo phx.new, respostas 4xx/5xx padrão
│       ├── plugs/
│       │   └── auth.ex                    # middleware de autenticação (JWT)
│       ├── auth/
│       │   └── token.ex                   # geração/verificação do JWT
│       ├── error_helpers.ex               # resposta de erro compartilhada
│       ├── endpoint.ex                    # gerado pelo phx.new
│       └── router.ex                      # rotas + pipelines
└── priv/repo/migrations/
    └── ..._create_usuarios.exs
```

::: tip Context: o "M" com fronteira explícita
`Accounts` é o que o Phoenix chama de **context**: um módulo que expõe funções de negócio (`registrar_usuario/1`, `autenticar/2`...) e esconde os detalhes de `Ecto`/SQL de quem chama. Controllers nunca usam `Repo` diretamente, só o context. É o mesmo princípio do "model" nas outras três aulas, só que com um nome (e uma convenção de geração de código) próprios do Phoenix.
:::

## Schema e migration

```bash
mix ecto.gen.migration create_usuarios
```

```elixir
# priv/repo/migrations/..._create_usuarios.exs
defmodule Cadastro.Repo.Migrations.CreateUsuarios do
  use Ecto.Migration

  def change do
    create table(:usuarios) do
      add :nome, :string, null: false
      add :email, :string, null: false
      add :senha_hash, :string, null: false

      timestamps(inserted_at: :criado_em, updated_at: false, type: :utc_datetime)
    end

    create unique_index(:usuarios, [:email])
  end
end
```

```bash
mix ecto.create
mix ecto.migrate
```

`mix ecto.create` cria o arquivo `usuarios.db` (vazio); `mix ecto.migrate` roda a migration acima, criando a tabela.

```elixir
# lib/cadastro/accounts/usuario.ex
defmodule Cadastro.Accounts.Usuario do
  use Ecto.Schema
  import Ecto.Changeset

  schema "usuarios" do
    field :nome, :string
    field :email, :string
    field :senha_hash, :string
    field :senha, :string, virtual: true

    timestamps(inserted_at: :criado_em, updated_at: false, type: :utc_datetime)
  end

  @doc "Usado para criar (POST) e substituir (PUT): senha é obrigatória."
  def changeset(usuario, attrs) do
    usuario
    |> cast(attrs, [:nome, :email, :senha])
    |> validate_required([:nome, :email, :senha])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
    |> put_senha_hash()
  end

  @doc "Usado para atualizar parcialmente (PATCH): todos os campos são opcionais."
  def changeset_parcial(usuario, attrs) do
    usuario
    |> cast(attrs, [:nome, :email, :senha])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
    |> put_senha_hash()
  end

  defp put_senha_hash(changeset) do
    case get_change(changeset, :senha) do
      nil -> changeset
      senha -> put_change(changeset, :senha_hash, Bcrypt.hash_pwd_salt(senha))
    end
  end
end
```

`field :senha, :string, virtual: true` declara um campo que existe no changeset (para receber a senha em texto puro da requisição) mas **não** é uma coluna da tabela; `put_senha_hash/1` o transforma em `senha_hash` antes de qualquer `Repo.insert`/`Repo.update`, então a senha em texto puro nunca chega perto do banco.

## Context: a camada de negócio (`Accounts`)

```elixir
# lib/cadastro/accounts.ex
defmodule Cadastro.Accounts do
  alias Cadastro.Repo
  alias Cadastro.Accounts.Usuario

  def registrar_usuario(attrs) do
    %Usuario{}
    |> Usuario.changeset(attrs)
    |> Repo.insert()
  end

  def autenticar(email, senha) do
    usuario = Repo.get_by(Usuario, email: email)

    cond do
      usuario && Bcrypt.verify_pass(senha, usuario.senha_hash) ->
        {:ok, usuario}

      true ->
        Bcrypt.no_user_verify()
        {:error, :credenciais_invalidas}
    end
  end

  def listar_usuarios, do: Repo.all(Usuario)

  def buscar_usuario(id) do
    case Repo.get(Usuario, id) do
      nil -> {:error, :not_found}
      usuario -> {:ok, usuario}
    end
  end

  def substituir_usuario(id, attrs) do
    with {:ok, usuario} <- buscar_usuario(id) do
      usuario
      |> Usuario.changeset(attrs)
      |> Repo.update()
    end
  end

  def atualizar_usuario(id, attrs) do
    with {:ok, usuario} <- buscar_usuario(id) do
      usuario
      |> Usuario.changeset_parcial(attrs)
      |> Repo.update()
    end
  end

  def remover_usuario(id) do
    with {:ok, usuario} <- buscar_usuario(id) do
      Repo.delete(usuario)
    end
  end
end
```

`Bcrypt.no_user_verify()` executa um hash "de mentira" quando o e-mail não existe, gastando um tempo parecido com uma verificação real. Sem isso, um servidor responderia mais rápido para "e-mail não existe" do que para "senha errada", vazando (por *timing*) se um e-mail está cadastrado ou não.

Todas as funções que podem falhar devolvem `{:ok, valor}` ou `{:error, motivo}`: essa convenção é o que permite ao `with` nos controllers (a seguir) e ao `action_fallback` tratarem qualquer erro de forma genérica.

## Middleware de autenticação: um `Plug`

Em Phoenix (e no `Plug`, a especificação sobre a qual o Phoenix é construído), um middleware é um módulo com duas funções: `init/1` (configuração, roda uma vez) e `call/2` (roda a cada requisição, recebe e devolve uma `conn`):

```elixir
# lib/cadastro_web/plugs/auth.ex
defmodule CadastroWeb.Plugs.Auth do
  import Plug.Conn

  alias CadastroWeb.Auth.Token
  alias CadastroWeb.ErrorHelpers

  def init(opts), do: opts

  def call(conn, _opts) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
         {:ok, claims} <- Token.verificar(token) do
      assign(conn, :usuario_id, claims["sub"])
    else
      _ -> ErrorHelpers.send_error(conn, :unauthorized, "UNAUTHORIZED", "Token ausente ou inválido.")
    end
  end
end
```

```elixir
# lib/cadastro_web/auth/token.ex
defmodule CadastroWeb.Auth.Token do
  use Joken.Config

  @segredo "segredo-de-desenvolvimento"
  @signer Joken.Signer.create("HS256", @segredo)

  def token_config, do: default_claims(default_exp: 60 * 60) # 1 hora

  def gerar(usuario) do
    extra_claims = %{"sub" => usuario.id, "nome" => usuario.nome, "email" => usuario.email}
    {:ok, token, _claims} = generate_and_sign(extra_claims, @signer)
    token
  end

  def verificar(token), do: verify_and_validate(token, @signer)
end
```

`use Joken.Config` traz `generate_and_sign/2` e `verify_and_validate/2` prontos; `default_claims(default_exp: ...)` já adiciona e valida a expiração (`exp`) automaticamente.

## Middleware de tratamento de erros: `action_fallback`

Assim como o FastAPI resolve autenticação com `Depends` em vez de uma cadeia de middlewares, o Phoenix resolve o tratamento de erros com **`action_fallback`**: se uma ação do controller devolver qualquer coisa que não seja uma `conn` "concluída" (por exemplo, `{:error, :not_found}` vindo direto do `with`), o Phoenix repassa esse valor para o módulo declarado em `action_fallback`.

```elixir
# lib/cadastro_web/controllers/fallback_controller.ex
defmodule CadastroWeb.FallbackController do
  use CadastroWeb, :controller

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> json(%{error: %{code: "NOT_FOUND", message: "Usuário não encontrado."}})
  end

  def call(conn, {:error, :credenciais_invalidas}) do
    conn
    |> put_status(:unauthorized)
    |> json(%{error: %{code: "INVALID_CREDENTIALS", message: "E-mail ou senha inválidos."}})
  end

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    if email_ja_cadastrado?(changeset) do
      conn
      |> put_status(:conflict)
      |> json(%{error: %{code: "EMAIL_IN_USE", message: "Este e-mail já está cadastrado."}})
    else
      conn
      |> put_status(:bad_request)
      |> json(%{error: %{code: "VALIDATION_ERROR", message: primeira_mensagem(changeset)}})
    end
  end

  defp email_ja_cadastrado?(changeset) do
    Enum.any?(changeset.errors, fn {campo, {_msg, opts}} ->
      campo == :email && Keyword.get(opts, :constraint) == :unique
    end)
  end

  defp primeira_mensagem(changeset) do
    {campo, {msg, _opts}} = List.first(changeset.errors)
    "O campo '#{campo}' #{msg}."
  end
end
```

E cada controller declara qual fallback usar:

```elixir
action_fallback CadastroWeb.FallbackController
```

::: tip Por que o Plug de autenticação não usa o `action_fallback`?
`action_fallback` só entra em ação depois que uma *action* do controller roda. O `Plug` de autenticação roda **antes** disso, então uma falha ali precisa responder e encerrar a conexão (`halt/1`) por conta própria; por isso ele chama `ErrorHelpers.send_error/4` diretamente, em vez de devolver `{:error, ...}` para um controller que nunca vai rodar. É a mesma tensão entre "middleware de rota" e "handler de erro central" que apareceu no Gin: o middleware de autenticação registra o problema, mas quem devolve a resposta final por regra é uma única função.
:::

```elixir
# lib/cadastro_web/error_helpers.ex
defmodule CadastroWeb.ErrorHelpers do
  import Plug.Conn

  def send_error(conn, status, code, message) do
    conn
    |> put_status(status)
    |> Phoenix.Controller.json(%{error: %{code: code, message: message}})
    |> halt()
  end
end
```

Para erros verdadeiramente inesperados (uma exceção não prevista em algum lugar do código), o Phoenix já converte qualquer *crash* não tratado em uma resposta 500 automaticamente, renderizada pelo módulo `CadastroWeb.ErrorJSON` (gerado pelo `phx.new`). Ajustamos o dele para seguir o mesmo formato:

```elixir
# lib/cadastro_web/controllers/error_json.ex
defmodule CadastroWeb.ErrorJSON do
  def render(_template, _assigns) do
    %{error: %{code: "INTERNAL_ERROR", message: "Erro interno do servidor."}}
  end
end
```

## Controller de autenticação: registrar e login

```elixir
# lib/cadastro_web/controllers/auth_controller.ex
defmodule CadastroWeb.AuthController do
  use CadastroWeb, :controller

  alias Cadastro.Accounts
  alias CadastroWeb.Auth.Token

  action_fallback CadastroWeb.FallbackController

  def registrar(conn, params) do
    with {:ok, usuario} <- Accounts.registrar_usuario(params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", "/usuarios/#{usuario.id}")
      |> render(:usuario, usuario: usuario)
    end
  end

  def login(conn, %{"email" => email, "senha" => senha}) do
    with {:ok, usuario} <- Accounts.autenticar(email, senha) do
      render(conn, :token, token: Token.gerar(usuario))
    end
  end
end
```

```elixir
# lib/cadastro_web/controllers/auth_json.ex
defmodule CadastroWeb.AuthJSON do
  def usuario(%{usuario: usuario}) do
    %{id: usuario.id, nome: usuario.nome, email: usuario.email, criado_em: usuario.criado_em}
  end

  def token(%{token: token}), do: %{token: token}
end
```

## Controller de usuários: CRUD

```elixir
# lib/cadastro_web/controllers/usuario_controller.ex
defmodule CadastroWeb.UsuarioController do
  use CadastroWeb, :controller

  alias Cadastro.Accounts

  action_fallback CadastroWeb.FallbackController

  def index(conn, _params) do
    render(conn, :index, usuarios: Accounts.listar_usuarios())
  end

  def show(conn, %{"id" => id}) do
    with {:ok, usuario} <- Accounts.buscar_usuario(id) do
      render(conn, :usuario, usuario: usuario)
    end
  end

  def update(conn, %{"id" => id} = params) do
    with {:ok, usuario} <- Accounts.substituir_usuario(id, params) do
      render(conn, :usuario, usuario: usuario)
    end
  end

  def patch(conn, %{"id" => id} = params) do
    with {:ok, usuario} <- Accounts.atualizar_usuario(id, params) do
      render(conn, :usuario, usuario: usuario)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, _usuario} <- Accounts.remover_usuario(id) do
      send_resp(conn, :no_content, "")
    end
  end
end
```

```elixir
# lib/cadastro_web/controllers/usuario_json.ex
defmodule CadastroWeb.UsuarioJSON do
  def index(%{usuarios: usuarios}), do: for(usuario <- usuarios, do: data(usuario))

  def usuario(%{usuario: usuario}), do: data(usuario)

  defp data(usuario) do
    %{id: usuario.id, nome: usuario.nome, email: usuario.email, criado_em: usuario.criado_em}
  end
end
```

Repare que `data/1` nunca inclui `senha_hash`: o schema até carrega esse campo em memória (`Repo.get` traz a linha inteira), mas o módulo `*_JSON` é quem decide o que vira resposta, e ele simplesmente não lê esse campo.

## Rotas

```elixir
# lib/cadastro_web/router.ex
defmodule CadastroWeb.Router do
  use CadastroWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug CadastroWeb.Plugs.Auth
  end

  scope "/auth", CadastroWeb do
    pipe_through :api

    post "/registrar", AuthController, :registrar
    post "/login", AuthController, :login
  end

  scope "/usuarios", CadastroWeb do
    pipe_through [:api, :auth]

    get "/", UsuarioController, :index
    get "/:id", UsuarioController, :show
    put "/:id", UsuarioController, :update
    patch "/:id", UsuarioController, :patch
    delete "/:id", UsuarioController, :delete
  end
end
```

Uma `pipeline` é uma lista nomeada de plugs. `pipe_through [:api, :auth]` aplica as duas, na ordem, a todas as rotas do escopo `/usuarios`: o equivalente Phoenix do `router.use(auth)` do Express ou do `usuarios.Use(middlewares.Auth())` do Gin.

## Rodando e testando com `curl`

```bash
mix phx.server
```

```bash
# Registrar
curl -X POST http://localhost:4000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana Silva", "email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Login (guarde o token retornado)
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ana@exemplo.com", "senha": "senhaForte123"}'

# Listar usuários (rota protegida)
curl http://localhost:4000/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Atualizar parcialmente
curl -X PATCH http://localhost:4000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Ana S. Souza"}'

# Remover
curl -X DELETE http://localhost:4000/usuarios/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

::: tip Comparando as quatro implementações
Em todas as quatro linguagens, a mesma ideia se repete sob nomes diferentes: uma camada de acesso a dados isolada (model / model + Pydantic / model / context+schema), uma etapa transversal que valida o token antes da rota (middleware / dependência / middleware / plug), e um único lugar que decide o formato de qualquer resposta de erro (middleware de 4 argumentos / exception handlers / middleware que lê `c.Errors` / `action_fallback`). Nenhuma arquitetura é "mais MVC" que a outra; cada framework só escolheu um nome e uma sintaxe diferentes para o mesmo conjunto de responsabilidades.
:::

::: warning Isso é um exemplo didático
O segredo do JWT está fixo no código só para facilitar o teste local; em produção ele precisa vir de uma variável de ambiente/segredo gerenciado (ex.: via `config/runtime.exs`). Políticas de senha, renovação de token e *rate limiting* no login ficaram de fora para manter o foco na arquitetura.
:::

[Testar esta API ao vivo →](/apisMicrosservicos/exemplos-api)

---

**Próxima página:** [Aula 09: SOLID Aplicado a APIs →](/apisMicrosservicos/solid-apis)

<style scoped src="./shared.css"></style>
