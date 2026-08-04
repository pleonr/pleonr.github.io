---
title: "APIs e Microsserviços: Aula 09"
---

[← APIs e Microsserviços](/apisMicrosservicos/)

# SOLID Aplicado a APIs

<p class="lesson-subtitle">Os cinco princípios de design orientado a objetos, traduzidos para as camadas de uma API: rotas, controllers, services e acesso a dados</p>

SOLID é um acrônimo para cinco princípios de design de software (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion), formulados para código orientado a objetos, mas que se aplicam igualmente bem a qualquer API organizada em camadas, mesmo em uma API "sem classes" como a que construímos em [Node.js/Express na Aula 05](/apisMicrosservicos/exemplo-node-express). O que muda entre linguagens é a sintaxe (classes, módulos, *closures*). A ideia por trás de cada princípio é a mesma.

## Por que isso importa em uma API

Uma API raramente é escrita uma vez e esquecida: ela ganha endpoints, troca de banco de dados, adiciona regras de negócio, e precisa ser testada sem depender de um banco real rodando. SOLID não é sobre "código bonito". É sobre reduzir o custo dessas mudanças:

- **Menos acoplamento** entre "o que a API faz" (regra de negócio) e "como ela faz" (framework HTTP, driver de banco, biblioteca de hashing).
- **Testes sem infraestrutura**: se a regra de negócio depende de uma *abstração* de acesso a dados em vez do banco real, um teste pode trocar essa abstração por uma versão em memória.
- **Evolução sem medo**: adicionar um endpoint, uma regra de validação ou trocar SQLite por Postgres não deveria obrigar a reescrever o que já funciona.

Na [Aula 10](/apisMicrosservicos/solid-refatoracao-node) vamos pegar exatamente a API construída na Aula 05 e refatorá-la aplicando cada um dos cinco princípios abaixo. Aqui, o foco é entender o que cada princípio significa e qual sintoma ele resolve.

## S: Single Responsibility Principle

**Um módulo deveria ter um, e só um, motivo para mudar.**

Numa API isso se traduz em separar claramente **por que** cada camada existe:

| Camada | Responsabilidade | Muda quando... |
| --- | --- | --- |
| Rota | Existe (mapeia método + URL para uma função) | Uma URL ou verbo HTTP muda |
| Controller | Traduz HTTP ↔ chamada de função (lê `req`, monta `res`) | O formato de entrada/saída HTTP muda |
| Service | Aplica regra de negócio | Uma regra de negócio muda |
| Repository/Model | Lê e grava dados | O banco ou a forma de consultá-lo muda |

O controller `registrar` da Aula 05 mistura pelo menos quatro motivos de mudança na mesma função: validação de campos obrigatórios, a regra "e-mail não pode repetir", o algoritmo de hash da senha e o formato da resposta HTTP:

```js
// src/controllers/authController.js (Aula 05)
export async function registrar(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {                       // 1. validação
    throw new ApiError(400, 'VALIDATION_ERROR', /* ... */);
  }
  if (usuarioModel.buscarPorEmail(email)) {               // 2. regra de negócio
    throw new ApiError(409, 'EMAIL_IN_USE', /* ... */);
  }

  const senhaHash = await bcrypt.hash(senha, 10);          // 3. detalhe de infraestrutura
  const usuario = usuarioModel.criar({ nome, email, senhaHash });

  res.status(201).location(`/usuarios/${usuario.id}`).json(usuario); // 4. formato HTTP
}
```

Nenhuma dessas quatro coisas é "errada" isoladamente, mas hoje elas só podem mudar juntas, no mesmo arquivo, na mesma função. Trocar a regra de validação exige mexer no mesmo lugar que formata a resposta HTTP. O sintoma clássico de violação de SRP é esse: uma função que só entendida por partes, cada parte falando de um assunto diferente.

## O: Open/Closed Principle

**Deveria ser possível estender o comportamento de um módulo sem modificar o código já existente e testado.**

Em uma API, os pontos de extensão mais comuns são:

- **Regras de validação**: se cada campo obrigatório é um `if` dentro do controller, adicionar uma regra nova (ex: senha com no mínimo 8 caracteres) significa editar uma função que já funciona, arriscando quebrar o que já estava certo. Se validação é uma **lista de regras compostas**, uma regra nova é só mais um item na lista. O código que já existia nem é tocado.
- **Middlewares**: o próprio Express já é "aberto para extensão" nesse sentido: `app.use(novoMiddleware)` adiciona comportamento transversal (log, rate limiting, uma nova política de CORS) sem editar as rotas existentes.
- **Novas versões de endpoint**: `/v2/usuarios` convivendo com `/v1/usuarios` (ver [Versionamento na Aula 03](/apisMicrosservicos/boas-praticas#versionamento)) é OCP aplicado a contratos HTTP: o código antigo continua rodando, intocado, enquanto o novo é adicionado ao lado.

O oposto de OCP é o "efeito cascata": uma mudança pequena (uma regra de validação a mais) que obriga a editar uma função grande e já testada, com risco de quebrar um comportamento que não tinha nada a ver com a mudança.

## L: Liskov Substitution Principle

**Uma implementação deveria poder substituir outra sem quebrar quem a utiliza, desde que ambas sigam o mesmo contrato.**

Isso aparece com força na camada de acesso a dados. Se o "contrato" de um repositório de usuários é *"`buscarPorId` retorna o usuário ou `undefined` se não existir"*, então **qualquer** implementação desse contrato (SQLite em produção, um objeto em memória em um teste, um mock que sempre retorna o mesmo usuário) precisa respeitar exatamente essa regra. Se uma implementação decidir lançar uma exceção quando não encontra, e outra retornar `null` em vez de `undefined`, o código que consome esse repositório (o service) passa a ter que conhecer detalhes de qual implementação está por trás, o que anula a vantagem de ter uma abstração.

Na prática, LSP é o que torna possível escrever:

```js
// em produção
const usuarioRepository = criarUsuarioRepository(db); // SQLite de verdade

// em um teste
const usuarioRepository = criarUsuarioRepositoryFake([...usuariosDeTeste]); // em memória
```

...e usar `usuarioService` sem alterar uma linha sequer dele: as duas implementações são substituíveis porque seguem o mesmo contrato de entrada/saída.

## I: Interface Segregation Principle

**Nenhum módulo deveria ser forçado a depender de métodos que não usa.**

O padrão `import * as usuarioModel from '../models/usuarioModel.js'` da Aula 05 é conveniente, mas viola ISP de forma sutil: o `authController` só precisa de `criar` e `buscarPorEmail`, mas importa o módulo inteiro, incluindo `atualizarParcial` e `remover`, que nunca usa. Isso não quebra nada em uma API pequena, mas cresce mal: quanto maior o módulo de dados, mais cada consumidor arrasta dependências que não lhe dizem respeito, e mais difícil fica saber, só olhando os imports de um arquivo, do que ele realmente depende.

A correção não é criar uma interface para cada função (isso seria exagero). É fazer cada camada **receber explicitamente só o que usa**, geralmente via injeção de dependência, como veremos na próxima seção.

## D: Dependency Inversion Principle

**Módulos de alto nível (regra de negócio) não deveriam depender de módulos de baixo nível (bibliotecas, drivers). Ambos deveriam depender de uma abstração.**

Este é o princípio que amarra os outros quatro. Hoje, o controller de autenticação da Aula 05 importa `bcrypt` e `jsonwebtoken` diretamente: a regra de negócio "como validar um login" está *soldada* a duas bibliotecas concretas:

```js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
```

Isso tem dois custos: trocar `jsonwebtoken` por outra biblioteca de token exige editar a regra de negócio, e testar a regra de negócio sem gerar um hash bcrypt de verdade (lento, de propósito) é praticamente impossível.

A inversão de dependência propõe o oposto: o service depende de uma abstração ("algo que sabe gerar hash e comparar senha", "algo que sabe emitir e verificar um token"), e é o **ponto de composição da aplicação** (em uma API Express, geralmente `app.js`) quem decide, uma única vez, qual implementação concreta preencher essa abstração:

```
authService  ──depende de──▶  hashService (abstração)
                                     ▲
                                     │ implementado por
                                     │
                              bcrypt concreto (só em app.js)
```

Esse é exatamente o padrão de *composition root*: em vez de cada módulo escolher suas próprias dependências, existe um único lugar na aplicação onde as peças concretas se encontram.

## Resumo

| Princípio | Pergunta que ele responde | Sintoma quando violado |
| --- | --- | --- |
| **S**RP | Este módulo tem um motivo só para mudar? | Função que mistura validação, regra de negócio e formatação de resposta |
| **O**CP | Dá para estender sem editar o que já existe? | Toda regra nova exige editar uma função já testada |
| **L**SP | Duas implementações do mesmo contrato são intercambiáveis? | Repositório de teste se comporta diferente do repositório real |
| **I**SP | Cada módulo depende só do que usa? | `import * as model` quando só duas funções são usadas |
| **D**IP | A regra de negócio depende de abstrações, ou de bibliotecas concretas? | `bcrypt`/`jwt`/driver de banco importados dentro do service |

::: tip SOLID não é um checklist obrigatório
Aplicar os cinco princípios ao pé da letra em uma API de três endpoints pode ser *over-engineering*: mais arquivos, mais indireção, para um ganho que ninguém vai sentir. SOLID é uma bússola para decidir *para onde* refatorar quando uma API cresce e a dor de mudar código já existente aparece, não uma lista de camadas obrigatórias desde o primeiro commit.
:::

Na próxima aula, aplicamos os cinco princípios, um de cada vez, na API de usuários em Node.js/Express da Aula 05, com o antes/depois de cada arquivo e o porquê de cada mudança.

---

**Próxima página:** [Aula 10: Refatorando a API Node.js para SOLID →](/apisMicrosservicos/solid-refatoracao-node)

<style scoped src="./shared.css"></style>
