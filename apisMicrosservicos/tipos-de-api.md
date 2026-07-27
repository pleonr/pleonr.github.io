---
title: "APIs e Microsserviços: Aula 02"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Tipos de API

<p class="lesson-subtitle">REST · SOAP · GraphQL · gRPC · WebSockets · Webhooks</p>

Não existe um único jeito de construir uma API. Cada estilo resolve um problema diferente: a escolha certa depende de quem vai consumir a API, que tipo de dado está sendo trocado, e se a comunicação precisa ser em tempo real.

## REST (*Representational State Transfer*)

O estilo mais comum de API na web hoje. Não é um protocolo, mas um conjunto de princípios de arquitetura:

- **Recursos**: tudo é um recurso identificado por uma URL (`/usuarios/42`, `/pedidos/7/itens`).
- **Verbos HTTP**: a ação sobre o recurso é expressa pelo método HTTP (`GET`, `POST`, `PUT`, `DELETE`...), não pela URL.
- **Stateless**: cada requisição contém tudo que o servidor precisa para processá-la. O servidor não guarda estado de sessão entre requisições.
- **Uniform interface**: o mesmo formato de URL e verbos se aplica a qualquer recurso da API.

```http
GET /usuarios/42 HTTP/1.1
Host: api.exemplo.com
Accept: application/json
```

```json
{
  "id": 42,
  "nome": "Ana",
  "email": "ana@exemplo.com"
}
```

<div class="adv-grid">
<div>

#### Vantagens

- Simples de entender e usar: qualquer cliente HTTP funciona.
- Aproveita o cache HTTP nativamente.
- Enorme ecossistema de ferramentas (Postman, OpenAPI, etc.).

</div>
<div>

#### Desvantagens

- *Over-fetching*/*under-fetching*: o cliente recebe campos que não precisa, ou precisa fazer várias chamadas para montar uma tela.
- Não há um padrão rígido: cada API REST tem suas próprias convenções.

</div>
</div>

## SOAP (*Simple Object Access Protocol*)

Um protocolo mais antigo e rígido, baseado em XML, com um contrato formal descrito em **WSDL** (*Web Services Description Language*). Ainda é comum em sistemas bancários, governamentais e integrações corporativas legadas.

```xml
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Body>
    <ConsultarSaldoRequest xmlns="http://exemplo.com/banco">
      <NumeroConta>12345-6</NumeroConta>
    </ConsultarSaldoRequest>
  </soap:Body>
</soap:Envelope>
```

<div class="adv-grid">
<div>

#### Vantagens

- Contrato rígido e formal (WSDL): bom para integrações corporativas críticas.
- Suporte nativo a transações e segurança em nível de mensagem (WS-Security).

</div>
<div>

#### Desvantagens

- Verboso (XML tem muito mais "peso" que JSON).
- Curva de aprendizado maior, ferramental mais pesado.

</div>
</div>

## GraphQL

Uma linguagem de consulta para APIs, criada pelo Facebook. Em vez de vários endpoints fixos, o GraphQL expõe um **único endpoint**, e o cliente descreve exatamente quais campos quer receber.

```graphql
query {
  usuario(id: 42) {
    nome
    pedidos {
      id
      total
    }
  }
}
```

```json
{
  "data": {
    "usuario": {
      "nome": "Ana",
      "pedidos": [
        { "id": 7, "total": 150.0 }
      ]
    }
  }
}
```

<div class="adv-grid">
<div>

#### Vantagens

- Resolve *over-fetching*/*under-fetching*: o cliente pede exatamente o que precisa, numa única requisição.
- Um único endpoint, com *schema* fortemente tipado e autodocumentado.

</div>
<div>

#### Desvantagens

- Cache HTTP tradicional não funciona bem (tudo passa pelo mesmo endpoint).
- Mais complexo de implementar e de proteger contra consultas custosas no servidor.

</div>
</div>

## gRPC

Um framework de RPC (*Remote Procedure Call*) criado pelo Google, que usa **Protocol Buffers** (um formato binário compacto) sobre **HTTP/2**. Muito usado para comunicação **entre microsserviços** (serviço a serviço), onde performance importa mais do que legibilidade humana.

```protobuf
service UsuarioService {
  rpc BuscarUsuario (UsuarioRequest) returns (UsuarioResponse);
}

message UsuarioRequest {
  int32 id = 1;
}

message UsuarioResponse {
  int32 id = 1;
  string nome = 2;
}
```

<div class="adv-grid">
<div>

#### Vantagens

- Extremamente rápido: formato binário + HTTP/2 (multiplexação, streaming).
- Contrato fortemente tipado (`.proto`), gera código cliente/servidor automaticamente em várias linguagens.
- Suporta streaming bidirecional nativamente.

</div>
<div>

#### Desvantagens

- Não é legível por humanos (formato binário): mais difícil de debugar sem ferramentas.
- Suporte limitado direto no navegador (geralmente precisa de um proxy, ex: gRPC-Web).

</div>
</div>

## WebSockets

Diferente dos estilos anteriores (todos baseados em requisição-resposta), o WebSocket abre uma **conexão persistente e bidirecional** entre cliente e servidor. Qualquer um dos dois lados pode enviar uma mensagem a qualquer momento, sem esperar uma "pergunta".

Ideal para: chats, notificações em tempo real, dashboards ao vivo, jogos multiplayer.

```js
const socket = new WebSocket('wss://api.exemplo.com/chat');

socket.onmessage = (event) => {
  console.log('Nova mensagem:', event.data);
};

socket.send('Olá!');
```

## Webhooks

Uma espécie de "API invertida": em vez de o cliente perguntar periodicamente "já mudou alguma coisa?" (*polling*), o cliente registra uma URL própria, e o servidor **chama essa URL** quando um evento acontece.

Exemplo clássico: um gateway de pagamento chama seu endpoint `POST /webhooks/pagamento-confirmado` assim que um pagamento é aprovado, em vez de você ficar consultando o status a cada segundo.

```http
POST /webhooks/pagamento-confirmado HTTP/1.1
Host: minha-loja.com
Content-Type: application/json

{ "pedido_id": 7, "status": "aprovado" }
```

::: tip Boa prática
Endpoints de *webhook* devem validar a origem da chamada (ex: assinatura HMAC enviada pelo provedor). Como o endpoint é público, qualquer um poderia tentar chamá-lo forjando eventos falsos.
:::

## Comparativo

| Tipo | Formato | Estilo | Melhor para |
| --- | --- | --- | --- |
| REST | JSON (geralmente) | Requisição-resposta | APIs públicas de propósito geral |
| SOAP | XML | Requisição-resposta, com contrato rígido | Integrações corporativas/legadas |
| GraphQL | JSON | Consulta declarativa, um único endpoint | Telas que combinam muitos dados relacionados |
| gRPC | Protocol Buffers (binário) | RPC, com streaming | Comunicação interna entre microsserviços |
| WebSocket | Texto ou binário | Conexão persistente, bidirecional | Tempo real (chat, notificações, dashboards) |
| Webhook | JSON (geralmente) | Evento empurrado pelo servidor | Notificar sobre eventos assíncronos |

---

**Próxima página:** [Aula 03: Boas Práticas de Design de API →](/apisMicrosservicos/boas-praticas)

<style scoped src="./shared.css"></style>
