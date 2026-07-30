# Exemplos: API de Cadastro de Usuários

Implementações **funcionais** da API de cadastro de usuários ensinada em [APIs e Microsserviços](https://pleonr.github.io/apisMicrosservicos/) (Aulas 05 e 06). As duas pastas implementam exatamente a mesma API (mesmas rotas, mesmos códigos de erro, mesmo banco SQLite em arquivo, mesma autenticação por JWT) em linguagens/frameworks diferentes, para comparação.

- [`api-node/`](./api-node): Node.js + Express
- [`api-python/`](./api-python): Python + FastAPI

Cada pasta tem seu próprio `README.md` com instruções de instalação e execução.

## Contrato da API

| Método | Rota | Autenticado? | Descrição |
| --- | --- | --- | --- |
| `POST` | `/auth/registrar` | Não | Cria um novo usuário (senha criptografada) |
| `POST` | `/auth/login` | Não | Valida credenciais e devolve um token JWT |
| `GET` | `/usuarios` | Sim | Lista todos os usuários |
| `GET` | `/usuarios/:id` | Sim | Busca um usuário pelo id |
| `PUT` | `/usuarios/:id` | Sim | Substitui nome, e-mail e senha |
| `PATCH` | `/usuarios/:id` | Sim | Atualiza só os campos enviados |
| `DELETE` | `/usuarios/:id` | Sim | Remove um usuário |

Rotas protegidas exigem o header `Authorization: Bearer <token>`, obtido em `POST /auth/login`. Erros sempre seguem o formato:

```json
{ "error": { "code": "NOT_FOUND", "message": "Usuário não encontrado." } }
```

Códigos possíveis: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `INVALID_CREDENTIALS` (401), `NOT_FOUND` (404), `EMAIL_IN_USE` (409), `INTERNAL_ERROR` (500).

## Testando ao vivo

Com qualquer uma das duas implementações rodando, você pode testar todos os endpoints direto pelo navegador (com um painel "Try it out") na página [API de Usuários (ao vivo)](https://pleonr.github.io/apisMicrosservicos/exemplos-api).

::: warning Isso é um exemplo didático
Os segredos (JWT) vêm com um valor padrão só para facilitar rodar localmente. **Nunca** use um segredo fixo em produção.
:::
