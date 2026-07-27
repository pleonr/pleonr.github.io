---
title: "APIs e Microsserviços: Aula 04"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Documentação de APIs

<p class="lesson-subtitle">Por que documentar · OpenAPI/Swagger · Ferramentas · Documentação como contrato vivo</p>

## Por que documentar

Uma API sem documentação só pode ser usada por quem escreveu o código dela. Documentação é o que permite que:

- Outro time (ou você mesmo, seis meses depois) saiba quais endpoints existem, sem ler o código-fonte.
- Um novo desenvolvedor consiga integrar com a API no primeiro dia, sem perguntar em um chat.
- Ferramentas gerem automaticamente clientes HTTP, *mocks* para testes, e coleções prontas para explorar a API.
- O contrato entre times fique explícito. Mudanças acidentais que quebram clientes ficam mais fáceis de evitar.

## OpenAPI (Swagger)

**OpenAPI** (o nome atual do que era conhecido como *Swagger*) é a especificação mais usada para descrever APIs REST: um documento YAML ou JSON que descreve todos os endpoints, parâmetros, formatos de request/response e esquemas de autenticação.

```yaml
openapi: 3.1.0
info:
  title: API de Tarefas
  version: 1.0.0
  description: API simples para gerenciar uma lista de tarefas.

paths:
  /tarefas:
    get:
      summary: Lista todas as tarefas
      responses:
        '200':
          description: Lista de tarefas
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Tarefa'
    post:
      summary: Cria uma nova tarefa
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NovaTarefa'
      responses:
        '201':
          description: Tarefa criada

components:
  schemas:
    Tarefa:
      type: object
      properties:
        id:
          type: integer
        titulo:
          type: string
        concluida:
          type: boolean
    NovaTarefa:
      type: object
      required: [titulo]
      properties:
        titulo:
          type: string
```

Esse arquivo sozinho é suficiente para gerar automaticamente: uma interface visual navegável (Swagger UI / Redoc), *clients* HTTP prontos em várias linguagens, e validação de requisições.

::: tip Exemplo real neste site
Este blog usa exatamente esse mecanismo: o arquivo `public/openapi.json` descreve uma API de usuários, e o plugin `vitepress-openapi` renderiza a documentação interativa automaticamente a partir desse arquivo, sem escrever HTML manualmente para cada endpoint.
:::

## Ferramentas

| Ferramenta | Para que serve |
| --- | --- |
| **Swagger UI** | Gera uma página HTML interativa a partir de um arquivo OpenAPI, com botão "*Try it out*" para testar chamadas reais. |
| **Redoc** | Alternativa ao Swagger UI, focada em uma leitura mais limpa e navegável da documentação. |
| **Postman** / **Insomnia** | Clientes para explorar, testar e organizar chamadas de API em coleções. Também conseguem importar/exportar specs OpenAPI. |
| **Stoplight** | Editor visual para escrever a especificação OpenAPI sem editar YAML na mão. |

## Documentação como contrato vivo

O maior risco da documentação não é não existir: é **ficar desatualizada**. Um documento escrito à mão hoje, e nunca mais tocado, mente sobre a API real em poucos meses.

Algumas práticas ajudam a manter a documentação honesta:

- **Gerar a especificação a partir do código** (via anotações/decorators, como o FastAPI faz automaticamente, ver [Aula 06](/apisMicrosservicos/exemplo-python-fastapi)), em vez de escrevê-la à mão em um arquivo separado.
- **Testes de contrato** (*contract testing*): ferramentas como o [Pact](https://pact.io/) verificam que a API realmente cumpre o que o contrato promete, e quebram o build se o contrato for violado.
- **Validação automática contra a spec**: ferramentas como o [Dredd](https://dredd.org/) rodam a especificação OpenAPI como se fosse uma suíte de testes contra a API real.
- Manter a documentação **na mesma revisão de código** (*versionada junto*) que a implementação, nunca em uma wiki separada que ninguém lembra de atualizar.

---

**Próxima página:** [Aula 05: Exemplo Prático: Node.js + Express →](/apisMicrosservicos/exemplo-node-express)

<style scoped src="./shared.css"></style>
