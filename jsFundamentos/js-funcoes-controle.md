---
title: "JavaScript Fundamentos: Aula 02"
---

[← Fundamentos JavaScript](/jsFundamentos/)

# Funções, Condicionais e Loops

<p class="lesson-subtitle">Declarar funções · Arrow functions · if/else/switch · for/while · Métodos de array</p>

Se variáveis guardam dados, **funções** guardam *comportamento*: um bloco de código reutilizável que recebe entradas (parâmetros) e devolve uma saída (retorno). Combinadas com condicionais e loops, elas são a base de qualquer lógica em JavaScript.

## 1. Declarando funções

Existem três formas principais de escrever uma função em JavaScript, e elas aparecem constantemente em código real:

```js
// 1. Declaração de função (function declaration)
function somar(a, b) {
  return a + b;
}

// 2. Função anônima guardada em uma variável (function expression)
const somar = function (a, b) {
  return a + b;
};

// 3. Arrow function: sintaxe curta, muito usada hoje
const somar = (a, b) => {
  return a + b;
};

// arrow function com corpo de uma linha: return implícito
const somar = (a, b) => a + b;
```

<div class="fn-anatomy">
  <div class="fn-anatomy-code"><span class="fa-kw">function</span> <span class="fa-name">somar</span><span class="fa-punc">(</span><span class="fa-param">a</span><span class="fa-punc">, </span><span class="fa-param">b</span><span class="fa-punc">) {</span><br/>&nbsp;&nbsp;<span class="fa-kw">return</span> <span class="fa-param">a</span> <span class="fa-punc">+</span> <span class="fa-param">b</span><span class="fa-punc">;</span><br/><span class="fa-punc">}</span></div>
  <div class="fn-anatomy-labels">
    <span class="fa-lbl-kw">palavra-chave</span>
    <span class="fa-lbl-name">nome da função</span>
    <span class="fa-lbl-param">parâmetros</span>
  </div>
</div>

::: tip Quando usar cada forma?
**Declaração de função** quando você quer que a função exista mesmo antes de ser definida no arquivo (*hoisting*). **Arrow function** para funções curtas, callbacks, e quando você quer preservar o `this` do contexto ao redor. É a forma mais comum em código moderno.
:::

Chamar (executar) uma função é diferente de defini-la:

```js
function somar(a, b) {
  return a + b;
}

somar(2, 3); // chamada da função → retorna 5. Sem os parênteses, você só está se referindo à função, não executando-a.
```

[Testar funções ao vivo →](/jsFundamentos/js-funcoes-controle-exemplos#funcoes)

## 2. Escopo

Uma variável só existe dentro do bloco (`{ }`) onde foi declarada com `let`/`const`, e dentro de qualquer bloco aninhado nele. Fora disso, ela não existe.

```js
function saudacao() {
  const mensagem = 'Olá!'; // existe só dentro da função
  console.log(mensagem);    // ok
}

saudacao();
console.log(mensagem); // erro! "mensagem" não existe aqui fora
```

## 3. Condicionais

### if / else / else if

```js
const idade = 16;

if (idade >= 18) {
  console.log('Maior de idade');
} else if (idade >= 12) {
  console.log('Adolescente');
} else {
  console.log('Criança');
}
```

### Operador ternário

Uma forma curta de `if/else` quando o resultado é um **valor** (não um bloco de comandos):

```js
const idade = 16;
const status = idade >= 18 ? 'maior' : 'menor';
```

### switch

Útil quando você compara a **mesma variável** com vários valores possíveis:

```js
const dia = 3;

switch (dia) {
  case 1:
    console.log('Segunda');
    break;
  case 2:
    console.log('Terça');
    break;
  case 3:
    console.log('Quarta');
    break;
  default:
    console.log('Outro dia');
}
```

::: tip Boa prática
Não esqueça o `break` em cada `case`: sem ele, a execução "cai" para o próximo `case` mesmo que não bata (*fall-through*), um erro clássico e silencioso.
:::

[Testar condicionais ao vivo →](/jsFundamentos/js-funcoes-controle-exemplos#condicionais)

## 4. Loops

### for

Ideal quando você sabe (ou controla) quantas vezes o laço deve repetir:

```js
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
```

<div class="for-anatomy">
  <div class="for-anatomy-code"><span class="fr-kw">for</span> <span class="fr-punc">(</span><span class="fr-part init">let i = 0</span><span class="fr-punc">; </span><span class="fr-part cond">i &lt; 5</span><span class="fr-punc">; </span><span class="fr-part step">i++</span><span class="fr-punc">) { ... }</span></div>
  <div class="for-anatomy-labels">
    <span class="fr-lbl init">inicialização: roda uma vez</span>
    <span class="fr-lbl cond">condição: testada antes de cada volta</span>
    <span class="fr-lbl step">incremento: roda depois de cada volta</span>
  </div>
</div>

### while

Ideal quando você não sabe de antemão quantas voltas serão necessárias: repete **enquanto** a condição for verdadeira:

```js
let tentativas = 0;

while (tentativas < 3) {
  console.log('Tentativa', tentativas);
  tentativas++;
}
```

### for...of (percorrer arrays)

```js
const frutas = ['maçã', 'banana', 'uva'];

for (const fruta of frutas) {
  console.log(fruta);
}
```

[Testar loops ao vivo →](/jsFundamentos/js-funcoes-controle-exemplos#loops)

## 5. Métodos de array mais usados

Arrays têm métodos prontos para transformar dados sem escrever loops manualmente, a forma mais idiomática de trabalhar com listas em JS moderno:

| Método | O que faz | Retorna |
| --- | --- | --- |
| `forEach` | Executa uma função para cada item | `undefined` (só efeito colateral) |
| `map` | Transforma cada item em outro valor | novo array, mesmo tamanho |
| `filter` | Mantém só os itens que passam um teste | novo array, tamanho ≤ original |
| `reduce` | Acumula todos os itens em um único valor | um valor (número, objeto...) |

```js
const numeros = [1, 2, 3, 4, 5];

numeros.forEach(n => console.log(n));           // imprime cada número

const dobrados = numeros.map(n => n * 2);        // [2, 4, 6, 8, 10]

const pares = numeros.filter(n => n % 2 === 0);  // [2, 4]

const soma = numeros.reduce((acc, n) => acc + n, 0); // 15
```

::: tip `map`/`filter`/`reduce` não alteram o array original
Todos os três criam um **novo** array (ou valor) e deixam o original intocado. Diferente de `push`/`pop`/`splice`, que modificam o array em que são chamados.
:::

[Testar métodos de array ao vivo →](/jsFundamentos/js-funcoes-controle-exemplos#arrays)

## 6. Boas práticas: resumo

- Prefira **arrow functions** para callbacks e funções curtas.
- Sempre use `===` dentro de condicionais, nunca `==`.
- Nunca esqueça o `break` em um `switch`.
- Prefira `for...of` a `for` clássico quando só precisar percorrer valores de um array.
- Prefira `map`/`filter`/`reduce` a loops manuais quando estiver **transformando** dados.

## 7. Exercícios

1. **Três formas**: Escreva a mesma função (que recebe um número e retorna seu dobro) como declaração de função, function expression e arrow function.
2. **Condicional**: Escreva uma função `classificar(nota)` que retorne `'aprovado'` se `nota >= 6`, senão `'reprovado'`.
3. **Loop**: Use um `for` para imprimir todos os números pares entre 1 e 20.
4. **Array**: Dado `const precos = [10, 25, 8, 40]`, use `filter` para pegar só os preços acima de 15, depois `reduce` para somar o resultado.
5. **Escopo**: Explique por que o código abaixo dá erro, e como corrigi-lo:
   ```js
   function calcular() {
     const resultado = 10;
   }
   console.log(resultado);
   ```

---

**Próxima aula:** [Aula 03: DOM, Eventos e Assincronismo →](/jsFundamentos/js-dom-eventos)

<style scoped src="./shared.css"></style>
<style scoped src="./js-funcoes-controle.css"></style>
