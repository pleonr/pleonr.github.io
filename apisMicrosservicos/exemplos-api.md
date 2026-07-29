---
aside: false
title: API de Usuários
search: false
---

[← APIs e Microsserviços](/apisMicrosservicos/)

<script setup>
import spec from '../public/openapi-usuarios.json'
</script>

<OAInfo :spec="spec" />

<OAServers :spec="spec" />

Rode localmente a API construída na [Aula 05 (Node.js + Express)](/apisMicrosservicos/exemplo-node-express), na [Aula 06 (Python + FastAPI)](/apisMicrosservicos/exemplo-python-fastapi), na [Aula 07 (Go + Gin)](/apisMicrosservicos/exemplo-golang-gin) ou na [Aula 08 (Elixir + Phoenix)](/apisMicrosservicos/exemplo-elixir-phoenix). Ela precisa estar acessível na porta correspondente ao servidor escolhido acima (ou informe sua própria URL, se estiver rodando em outra porta).

Escolha uma operação na barra lateral para ver seus parâmetros e os esquemas de request/response, e use o painel "Try it out" para enviar uma requisição real ao seu servidor. Para os endpoints protegidos (tudo em `/usuarios`), chame primeiro `POST /auth/login`, copie o `token` da resposta e clique em **Authorize** no topo da página para colá-lo antes de testar.
