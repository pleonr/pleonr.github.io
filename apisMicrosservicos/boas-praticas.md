---
title: "APIs e Microsserviços: Aula 03"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Boas Práticas de Design de API

<p class="lesson-subtitle">Nomenclatura · Verbos e status codes · Versionamento · Paginação · Autenticação · Erros · Confiabilidade</p>

## Nomenclatura de recursos

Em uma API REST, a URL identifica **o quê** (um recurso), e o verbo HTTP identifica **a ação**. URLs devem usar **substantivos no plural**, nunca verbos:

```
✅ GET  /usuarios
✅ GET  /usuarios/42
✅ GET  /usuarios/42/pedidos

❌ GET  /buscarUsuarios
❌ POST /criarUsuario
❌ GET  /usuario/deletar/42
```

Hierarquia expressa relação entre recursos: `/usuarios/42/pedidos` são os pedidos *do usuário 42*.

## Verbos HTTP e idempotência

| Verbo | Uso | Idempotente? |
| --- | --- | --- |
| `GET` | Ler um recurso | Sim |
| `POST` | Criar um novo recurso | Não |
| `PUT` | Substituir um recurso inteiro | Sim |
| `PATCH` | Atualizar parte de um recurso | Não (geralmente) |
| `DELETE` | Remover um recurso | Sim |

::: tip O que significa "idempotente"?
Uma operação é idempotente quando repeti-la várias vezes tem o **mesmo efeito** que executá-la uma única vez. Chamar `DELETE /usuarios/42` dez vezes deixa o sistema no mesmo estado que chamar uma vez (o usuário continua deletado). Já `POST /usuarios` dez vezes provavelmente cria dez usuários, por isso não é idempotente. Isso importa na prática: um cliente pode reenviar com segurança uma requisição idempotente que falhou por *timeout*, sem medo de duplicar o efeito.
:::

## Status codes HTTP

Use o código de status para comunicar o resultado: não force tudo a retornar `200` com um campo `"success": false` no corpo.

| Faixa | Significado | Exemplos comuns |
| --- | --- | --- |
| <span class="status-badge status-2xx">2xx</span> | Sucesso | `200 OK`, `201 Created`, `204 No Content` |
| <span class="status-badge status-3xx">3xx</span> | Redirecionamento | `301 Moved Permanently`, `304 Not Modified` |
| <span class="status-badge status-4xx">4xx</span> | Erro do cliente | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `429 Too Many Requests` |
| <span class="status-badge status-5xx">5xx</span> | Erro do servidor | `500 Internal Server Error`, `503 Service Unavailable` |

```http
POST /usuarios HTTP/1.1
Content-Type: application/json

{ "nome": "Ana", "email": "ana@exemplo.com" }
```

```http
HTTP/1.1 201 Created
Location: /usuarios/42

{ "id": 42, "nome": "Ana", "email": "ana@exemplo.com" }
```

## Versionamento

APIs evoluem, e clientes antigos não podem quebrar quando isso acontece. As formas mais comuns de versionar:

```
# Via URL: mais simples e explícito
GET /v1/usuarios
GET /v2/usuarios

# Via header: mantém a URL "limpa"
GET /usuarios
Accept: application/vnd.exemplo.v2+json
```

::: tip Boa prática
Prefira versionamento por URL (`/v1/`) para APIs públicas: é explícito, aparece nos logs, e qualquer desenvolvedor entende de cara. Reserve o versionamento por header para casos onde a URL do recurso realmente precisa ficar estável.
:::

## Paginação, filtros e ordenação

Nunca devolva uma lista inteira sem limites: isso não escala.

```
GET /usuarios?page=2&limit=20
GET /usuarios?cursor=eyJpZCI6NDJ9&limit=20
GET /usuarios?status=ativo&sort=-criado_em
```

- **Paginação por página/offset** (`page`/`limit`): simples, mas pode "pular" ou repetir itens se a lista mudar entre as chamadas.
- **Paginação por cursor**: usa um ponteiro opaco para o último item visto, mais estável em listas que mudam com frequência.

## Autenticação e autorização

- **API Key**: uma chave fixa enviada em um header (`X-API-Key`), simples, comum para integrações servidor-a-servidor.
- **OAuth 2.0**: padrão para delegar acesso ("app X pode agir em nome do usuário Y") sem compartilhar senha.
- **JWT** (*JSON Web Token*): um token assinado que carrega informações do usuário. O servidor valida a assinatura sem precisar consultar um banco a cada requisição.

```http
GET /usuarios/42 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

::: warning Autenticação × Autorização
São coisas diferentes: **autenticação** confirma *quem* está fazendo a requisição; **autorização** confirma *o que* essa identidade tem permissão de fazer. Um usuário autenticado ainda pode receber `403 Forbidden` ao tentar acessar um recurso que não é seu.
:::

## Rate limiting

Limitar quantas requisições um cliente pode fazer em um intervalo de tempo, protegendo o serviço contra abuso (intencional ou não).

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
```

## Tratamento de erros consistente

Toda resposta de erro deveria seguir o mesmo formato em toda a API, para que o cliente possa tratá-las de forma genérica:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "O campo 'email' é obrigatório.",
    "campo": "email"
  }
}
```

## Confiabilidade entre serviços

Em uma arquitetura de microsserviços, uma chamada de API pode atravessar vários serviços, e qualquer um deles pode estar lento ou fora do ar. Algumas práticas ajudam a conter o problema:

- **Timeouts**: nunca espere uma resposta indefinidamente. Defina um limite de tempo por chamada.
- **Retries com backoff**: tentar novamente após uma falha, aumentando o intervalo entre tentativas (e adicionando *jitter* para não sincronizar retentativas de vários clientes).
- **Circuit breaker**: depois de várias falhas seguidas para um serviço, "abra o circuito" e pare de tentar chamá-lo por um tempo, falhando rápido em vez de deixar o chamador travado esperando.
- **Health checks**: cada serviço expõe um endpoint (`GET /health`) que diz se está apto a receber tráfego, usado por *load balancers* e orquestradores (ver [Docker](/virtualizacao/docker) e Docker Swarm).
- **Comunicação assíncrona quando possível**: usar uma fila/*message broker* (ver [Comunicação em Sistemas Distribuídos](/sistemasDistribuidos/comunicacao)) em vez de uma chamada síncrona reduz o acoplamento temporal entre serviços.
- **Observabilidade**: logs estruturados, métricas e *tracing* distribuído (para acompanhar uma requisição que atravessa vários serviços) são essenciais para depurar problemas que só aparecem em produção.

::: tip Database per service
Cada microsserviço deve ser dono do seu próprio banco de dados, e nenhum outro serviço deve acessá-lo diretamente. Todo acesso passa pela API do serviço dono. Isso preserva a independência de deploy e escala, mas troca as transações locais (ACID) por desafios de consistência entre serviços (ver [Bancos de Dados Distribuídos](/sistemasDistribuidos/bancos-distribuidos)).
:::

---

**Próxima página:** [Aula 04: Documentação de APIs →](/apisMicrosservicos/documentacao)

<style scoped src="./shared.css"></style>
