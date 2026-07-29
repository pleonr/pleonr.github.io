---
title: APIs e Microsserviços
---

# APIs e Microsserviços

<p class="lesson-subtitle">Como sistemas conversam entre si: da API mais simples à arquitetura de microsserviços</p>

Esta seção reúne o material sobre APIs e microsserviços: o que são, os diferentes tipos de API, boas práticas de design, como documentar, e quatro exemplos práticos completos: a mesma API de cadastro de usuários (CRUD, autenticação JWT, banco SQLite) construída em Node.js/Express, Python/FastAPI, Go/Gin e Elixir/Phoenix.

<div class="prop-card highlight-card">
<h4>Aula 01: Introdução e Motivações</h4>
<p>O que é uma API, o que é um microsserviço, monólito × microsserviços, e as motivações (e os custos) de cada abordagem.</p>

[Ver conteúdo →](/apisMicrosservicos/introducao)

</div>

<div class="prop-card highlight-card">
<h4>Aula 02: Tipos de API</h4>
<p>REST, SOAP, GraphQL, gRPC, WebSockets e Webhooks: o que cada um resolve e quando escolher cada abordagem.</p>

[Ver conteúdo →](/apisMicrosservicos/tipos-de-api)

</div>

<div class="prop-card highlight-card">
<h4>Aula 03: Boas Práticas de Design de API</h4>
<p>Nomenclatura de recursos, verbos e status codes HTTP, versionamento, paginação, autenticação, rate limiting e tratamento de erros.</p>

[Ver conteúdo →](/apisMicrosservicos/boas-praticas)

</div>

<div class="prop-card highlight-card">
<h4>Aula 04: Documentação de APIs</h4>
<p>Por que documentar, a especificação OpenAPI/Swagger, ferramentas (Swagger UI, Redoc, Postman) e documentação como contrato vivo.</p>

[Ver conteúdo →](/apisMicrosservicos/documentacao)

</div>

<div class="prop-card highlight-card">
<h4>Aula 05: Exemplo Prático: Node.js + Express</h4>
<p>Construindo uma API de cadastro de usuários com Node.js e Express: arquitetura em camadas, SQLite, autenticação JWT e middleware de tratamento de erros.</p>

[Ver conteúdo →](/apisMicrosservicos/exemplo-node-express)

</div>

<div class="prop-card highlight-card">
<h4>Aula 06: Exemplo Prático: Python + FastAPI</h4>
<p>A mesma API de usuários, agora em Python com FastAPI: validação automática com Pydantic, autenticação via dependências e handlers de exceção globais.</p>

[Ver conteúdo →](/apisMicrosservicos/exemplo-python-fastapi)

</div>

<div class="prop-card highlight-card">
<h4>Aula 07: Exemplo Prático: Go + Gin</h4>
<p>A mesma API de usuários, agora em Go com Gin: tipagem estática, SQLite via database/sql e middlewares explícitos de autenticação e de erros.</p>

[Ver conteúdo →](/apisMicrosservicos/exemplo-golang-gin)

</div>

<div class="prop-card highlight-card">
<h4>Aula 08: Exemplo Prático: Elixir + Phoenix</h4>
<p>A mesma API de usuários, agora em Elixir com Phoenix: contexts e Ecto como "M", um Plug de autenticação e action_fallback como middleware de erros.</p>

[Ver conteúdo →](/apisMicrosservicos/exemplo-elixir-phoenix)

</div>

<div class="prop-card highlight-card">
<h4>API de Usuários (ao vivo)</h4>
<p>Documentação OpenAPI interativa da API de cadastro de usuários. Rode a implementação de qualquer uma das quatro aulas localmente e teste cada endpoint (incluindo os protegidos por JWT) direto pelo navegador, com um painel "Try it out".</p>

[Ver conteúdo →](/apisMicrosservicos/exemplos-api)

</div>


<style scoped src="./shared.css"></style>
