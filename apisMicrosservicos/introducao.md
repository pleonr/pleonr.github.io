---
title: "APIs e Microsserviços: Aula 01"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# Introdução e Motivações

<p class="lesson-subtitle">O que é uma API · O que é um microsserviço · Monólito × microsserviços · Quando usar cada abordagem</p>

## O que é uma API

**API** (*Application Programming Interface*) é um contrato: um conjunto de regras que permite que dois sistemas conversem entre si sem que um precise conhecer os detalhes internos do outro. Quem consome a API só precisa saber **o que** pode pedir e **como** pedir. Não importa como aquilo é implementado por trás.

::: tip Uma analogia
Pense em um restaurante. Você (o cliente) não entra na cozinha para preparar seu próprio prato: você olha o **menu** (o contrato da API), faz um pedido em um formato que o garçom entende, e recebe de volta um prato pronto. A cozinha pode mudar de fornecedor, trocar de chef ou reorganizar o processo inteiro, e para você, cliente, nada muda: o menu (a API) continua o mesmo.
:::

Esse tipo de API (a que se comunica pela rede, geralmente sobre HTTP) é o foco desta seção. Vale notar que "API" é um termo mais amplo: uma biblioteca de código também tem uma API (as funções públicas que ela expõe), mesmo sem rede envolvida. Aqui, quando falamos em API, estamos falando de **Web APIs**.

| Camada | Exemplo |
| --- | --- |
| API de biblioteca | Os métodos públicos de uma lib JavaScript, ex: `array.map()` |
| **Web API** | Um endpoint HTTP como `GET /api/usuarios/42` |

## O que é um microsserviço

Um **microsserviço** é uma forma de organizar um sistema: em vez de um único programa gigante (o *monólito*) que faz tudo, o sistema é dividido em vários serviços pequenos e independentes, cada um responsável por uma parte específica do negócio (pedidos, pagamentos, usuários, notificações...), que se comunicam entre si, normalmente através de APIs.

```
Monólito                          Microsserviços

┌─────────────────-────┐           ┌──────────┐  ┌──────────┐
│                      │           │ Usuários │  │ Pedidos  │
│   Um único processo  │           └────┬─────┘  └────┬─────┘
│   Usuários           │                │             │
│   Pedidos            │                └──────┬──────┘
│   Pagamentos         │                        │
│   Notificações       │                 ┌──────┴──────┐
│                      │                 │ Pagamentos  │
└──────────┬───────────┘                 └──────┬──────┘
           │                                     │
     ┌─────┴─────┐                       ┌───────┴───────┐
     │ Um banco  │                       │ Notificações  │
     │ de dados  │                       └───────┬───────┘
     └───────────┘                                │
                                            ┌──────┴──────┐
                                            │ Um banco por│
                                            │ serviço     │
                                            └─────────────┘
```

Cada microsserviço, idealmente, tem seu **próprio banco de dados** e pode ser desenvolvido, implantado e escalado de forma independente dos demais.

## Monólito × Microsserviços

| Aspecto | Monólito | Microsserviços |
| --- | --- | --- |
| Deploy | Um único deploy para o sistema inteiro | Cada serviço tem seu próprio ciclo de deploy |
| Escalabilidade | Escala o sistema inteiro, mesmo que só uma parte precise | Escala só o serviço que está sob carga |
| Times | Um time (ou vários) no mesmo código-base | Times autônomos, cada um dono de um serviço |
| Tecnologia | Uma stack única para tudo | Cada serviço pode usar a linguagem/banco mais adequado |
| Complexidade | Concentrada no código | Distribuída na comunicação entre serviços |
| Falhas | Uma falha grave pode derrubar o sistema inteiro | Falha isolada: os demais serviços podem continuar no ar |
| Consistência de dados | Transações locais, mais simples (ACID) | Dados espalhados entre bancos: exige coordenação (ver [Sistemas Distribuídos](/sistemasDistribuidos/bancos-distribuidos)) |

## Motivações para usar APIs

- **Desacoplamento**: o frontend não precisa saber como o backend é implementado, só o contrato da API.
- **Múltiplos clientes**: a mesma API pode alimentar um app web, um app mobile e integrações de terceiros ao mesmo tempo.
- **Reutilização**: uma funcionalidade exposta como API pode ser consumida por vários sistemas, sem duplicar lógica.
- **Interoperabilidade**: sistemas escritos em linguagens diferentes conseguem se comunicar através de um formato comum (JSON, XML...).
- **Abstração de complexidade**: quem consome a API não precisa entender o banco de dados, a infraestrutura ou as regras de negócio internas.

## Motivações para microsserviços

- **Escalabilidade independente**: se só o serviço de "pagamentos" está sob alta carga, escale apenas ele.
- **Deploys independentes**: um time pode lançar uma nova versão do seu serviço sem coordenar um deploy do sistema inteiro.
- **Autonomia de times**: cada time pode possuir um serviço de ponta a ponta. Essa divisão espelha a estrutura organizacional (conhecida como Lei de Conway).
- **Isolamento de falhas**: um bug ou pico de carga em um serviço não necessariamente derruba os demais (com os devidos cuidados, ver [circuit breakers](/apisMicrosservicos/boas-praticas#confiabilidade-entre-servicos)).
- **Liberdade tecnológica**: cada serviço pode escolher a linguagem, framework e banco de dados mais adequados ao seu problema.

::: warning Microsserviços não são grátis
Trocar chamadas de função dentro de um único processo por chamadas de rede entre serviços introduz **latência**, **falhas parciais** (ver [Dependabilidade e Falhas](/sistemasDistribuidos/dependabilidade-falhas)) e **complexidade operacional**: cada serviço precisa de monitoramento, versionamento de contrato e um pipeline de deploy próprio. Manter consistência entre bancos de dados separados também é bem mais difícil do que uma transação local (ver [2PC/3PC](/sistemasDistribuidos/bancos-distribuidos)).

Um **monólito modular** (um único deploy, mas com fronteiras internas bem definidas entre módulos) costuma ser o ponto de partida certo para a maioria dos projetos. Migrar para microsserviços faz mais sentido quando a dor de escalar times ou partes específicas do sistema já apareceu na prática, não antes.
:::

## Resumo

- Uma API é um contrato de comunicação entre sistemas: o consumidor não precisa saber como o provedor implementa o que está por trás.
- Microsserviços são uma forma de organizar um sistema em partes pequenas e independentes, que se comunicam via APIs.
- A escolha entre monólito e microsserviços é uma troca: simplicidade e consistência de um lado, escalabilidade e autonomia de times do outro.
- As próximas aulas cobrem os tipos de API disponíveis, boas práticas de design, documentação, e dois exemplos práticos completos.

---

**Próxima página:** [Aula 02: Tipos de API →](/apisMicrosservicos/tipos-de-api)

<style scoped src="./shared.css"></style>
