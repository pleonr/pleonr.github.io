---
title: "JavaScript Fundamentos: Aula 01"
---

[← Fundamentos JavaScript](/jsFundamentos/)

# Introdução ao JavaScript

<p class="lesson-subtitle">O que é JavaScript · Onde ele roda · Variáveis · Tipos de dados · Operadores · Template literals</p>

**JavaScript** (**JS**) é a linguagem de **programação** que dá comportamento à página web: reage a cliques, valida formulários, busca dados de um servidor, atualiza a tela sem recarregar. Diferente do HTML e do CSS, JavaScript tem lógica de verdade: variáveis, condicionais, loops, funções.

| Camada | Linguagem | Responsabilidade |
| --- | --- | --- |
| Estrutura | [HTML](/htmlFundamentos/) | O que é cada parte do conteúdo (título, lista, formulário...) |
| Apresentação | [CSS](/cssFundamentos/) | Como o conteúdo aparece (cores, layout, tipografia) |
| Comportamento | **JavaScript** | Como a página reage e interage |

::: tip Onde o JavaScript roda?
JavaScript nasceu para rodar **dentro do navegador**, mas hoje também roda fora dele, no servidor, através do **Node.js** (o mesmo motor V8 do Chrome, empacotado para executar JS fora de uma página). Este material foca em JS no navegador, mas a sintaxe da linguagem (variáveis, funções, loops) é a mesma nos dois ambientes.
:::

## 1. Como incluir JavaScript em uma página

Assim como o CSS, há três formas de associar JavaScript a um documento HTML:

### Inline (atributo)

```html
<button onclick="alert('Clicou!')">Clique aqui</button>
```

Funciona, mas mistura comportamento com estrutura e é difícil de manter. Evite fora de exemplos rápidos.

### Elemento `<script>`

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Minha página</h1>

    <script>
      console.log('Olá do JavaScript!');
    </script>
  </body>
</html>
```

### Arquivo externo

```html {all|6|all}
<!DOCTYPE html>
<html>
  <head>
    <title>Minha página</title>
  </head>
  <body>
    <script src="app.js" defer></script>
  </body>
</html>
```

::: tip Boa prática
Prefira **arquivo externo** e coloque o `<script>` com o atributo `defer`. Assim, o navegador continua carregando o HTML normalmente e só executa o JS depois que o documento estiver pronto, evitando erros de "elemento não encontrado".
:::

## 2. Variáveis: `let`, `const` e `var`

Uma variável é um espaço nomeado para guardar um valor que pode ser lido (e às vezes alterado) depois.

<div class="var-anatomy">
  <div class="var-anatomy-code"><span class="va-kw">let</span> <span class="va-id">idade</span> <span class="va-op">=</span> <span class="va-val">27</span><span class="va-punc">;</span></div>
  <div class="var-anatomy-labels">
    <span class="va-lbl-kw">palavra-chave</span>
    <span class="va-lbl-id">identificador (nome)</span>
    <span class="va-lbl-op">operador de atribuição</span>
    <span class="va-lbl-val">valor</span>
  </div>
</div>

Existem três palavras-chave para declarar variáveis, e a diferença entre elas é o que realmente importa:

<div class="var-compare">
  <div class="var-card">
    <h5><code>let</code></h5>
    <p>Pode ser <strong>reatribuída</strong>. Escopo de bloco (só existe dentro do <code>{'{ }'}</code> onde foi criada).</p>
    <code>let total = 10;<br/>total = 20; // ok</code>
  </div>
  <div class="var-card">
    <h5><code>const</code></h5>
    <p><strong>Não pode ser reatribuída.</strong> Escopo de bloco. Use como padrão. Só troque para <code>let</code> quando precisar reatribuir.</p>
    <code>const PI = 3.14;<br/>PI = 3; // erro!</code>
  </div>
  <div class="var-card">
    <h5><code>var</code></h5>
    <p>Forma antiga (pré-2015). Escopo de <strong>função</strong>, não de bloco (comportamento confuso). Evite em código novo.</p>
    <code>var x = 1;<br/>// funciona, mas evite</code>
  </div>
</div>

::: tip Boa prática
Use **`const` por padrão**. Só use `let` quando o valor de fato precisa mudar (um contador, um acumulador). Evite `var`: ele existe por compatibilidade histórica, mas seu escopo de função causa bugs sutis que `let`/`const` resolvem.
:::

`const` impede a **reatribuição** da variável, não a mutação do valor. Um objeto ou array guardado em `const` ainda pode ter seu conteúdo alterado:

```js
const usuario = { nome: 'Ana' };
usuario.nome = 'Bruna'; // ok: está mudando uma propriedade, não a variável
usuario = {};            // erro! isso É reatribuição
```

## 3. Tipos de dados primitivos

JavaScript tem tipagem **dinâmica**: a variável não tem tipo fixo, o valor que ela guarda sim. O operador `typeof` revela o tipo de um valor em tempo de execução.

| Tipo | Exemplo | `typeof` |
| --- | --- | --- |
| `string` | `"Olá"`, `'texto'` | `"string"` |
| `number` | `42`, `3.14`, `-7` | `"number"` |
| `boolean` | `true`, `false` | `"boolean"` |
| `undefined` | variável declarada sem valor | `"undefined"` |
| `null` | ausência intencional de valor | `"object"` *(pegadinha histórica)* |
| `object` | `{ nome: 'Ana' }`, arrays, funções | `"object"` (ou `"function"`) |

```js
typeof "Olá";      // "string"
typeof 42;          // "number"
typeof true;        // "boolean"
typeof undefined;   // "undefined"
typeof null;        // "object"  ← bug histórico da linguagem, conhecido e documentado
typeof [1, 2, 3];    // "object"  ← arrays são um tipo especial de objeto
```

[Testar tipos ao vivo →](/jsFundamentos/js-introducao-exemplos#tipos)

## 4. Operadores

| Categoria | Operadores | Exemplo |
| --- | --- | --- |
| Aritméticos | `+ - * / % **` | `10 % 3` → `1` (resto da divisão) |
| Comparação | `== === != !== > < >= <=` | `"5" === 5` → `false` |
| Lógicos | `&& \|\| !` | `idade >= 18 && temDocumento` |
| Atribuição | `= += -= *= /=` | `total += 10` equivale a `total = total + 10` |

::: tip `===` vs `==`
`==` compara valores **convertendo tipos** antes (`"5" == 5` é `true`). `===` compara **sem converter**: valor e tipo precisam ser iguais (`"5" === 5` é `false`). Use sempre `===`/`!==`; o `==` solto gera bugs difíceis de rastrear por conversões implícitas inesperadas.
:::

[Testar operadores ao vivo →](/jsFundamentos/js-introducao-exemplos#operadores)

## 5. Template literals

Strings entre crases (`` ` ``) permitem **interpolar** variáveis diretamente no texto com `${}`, sem concatenação manual:

```js
const nome = 'Ana';
const idade = 27;

// forma antiga, com concatenação
const antiga = 'Olá, ' + nome + '! Você tem ' + idade + ' anos.';

// template literal
const moderna = `Olá, ${nome}! Você tem ${idade} anos.`;

// também suporta múltiplas linhas
const bilhete = `Linha 1
Linha 2`;
```

[Montar um template literal ao vivo →](/jsFundamentos/js-introducao-exemplos#template)

## 6. Comentários

```js
// Comentário de uma linha

/*
  Comentário
  de várias linhas
*/

const total = 100; // comentário ao lado do código
```

## 7. Boas práticas: resumo

- Prefira `const`; use `let` só quando o valor precisar mudar; evite `var`.
- Use `===`/`!==`, nunca `==`/`!=`.
- Dê nomes **descritivos** às variáveis (`precoTotal`, não `pt` ou `x`).
- Prefira template literals a concatenação com `+`.
- Um `<script defer>` externo, não JS inline nos atributos HTML.

## 8. Exercícios

1. **Variáveis**: Declare uma `const` com seu nome e um `let` com sua idade. Tente reatribuir os dois e observe o erro no `const`.
2. **Tipos**: Escreva 5 valores diferentes e preveja o resultado de `typeof` para cada um antes de testar.
3. **Operadores**: Sem executar, calcule o resultado de `"10" == 10`, `"10" === 10` e `10 % 3`.
4. **Template literal**: Usando template literal, monte a frase `"Fulano tem X anos e mora em Y."` a partir de três variáveis.
5. **Mutação vs reatribuição**: Crie um objeto com `const` e altere uma de suas propriedades. Explique por que isso não gera erro.

---

**Próxima aula:** [Aula 02: Funções, Condicionais e Loops →](/jsFundamentos/js-funcoes-controle)

<style scoped src="./shared.css"></style>
<style scoped src="./js-introducao.css"></style>
