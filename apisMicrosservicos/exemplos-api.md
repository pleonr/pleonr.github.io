---
aside: false
title: API de Tarefas
search: false
---

[← APIs e Microsserviços](/apisMicrosservicos/)

<script setup>
import spec from '../public/openapi-tarefas.json'
</script>

<OAInfo :spec="spec" />

<OAServers :spec="spec" />

Rode localmente a API construída na [Aula 05 (Node.js + Express)](/apisMicrosservicos/exemplo-node-express) ou na [Aula 06 (Python + FastAPI)](/apisMicrosservicos/exemplo-python-fastapi). Ela precisa estar acessível em `http://localhost:3000` ou `http://localhost:8000`, conforme o servidor escolhido acima (ou informe sua própria URL, se estiver rodando em outra porta). Depois, escolha uma operação na barra lateral para ver seus parâmetros, os esquemas de request/response, e um painel "Try it out" para enviar uma requisição real ao seu servidor.
