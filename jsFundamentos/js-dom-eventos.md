---
title: "JavaScript Fundamentos: Aula 03"
---

[← Fundamentos JavaScript](/jsFundamentos/)

# DOM, Eventos e Assincronismo

<p class="lesson-subtitle">O que é o DOM · Selecionar e manipular elementos · Eventos · Promises e async/await</p>

Até aqui, JavaScript existia isolado: variáveis, funções, loops. Nesta aula ele passa a **conversar com a página**: ler e alterar o HTML que já está na tela, reagir ao que o usuário faz, e buscar dados que ainda não chegaram.

## 1. O que é o DOM

O **DOM** (*Document Object Model*) é a representação do HTML da página como uma **árvore de objetos** que o JavaScript consegue ler e modificar em tempo real. Quando você altera o DOM, a tela atualiza sem recarregar a página.

| Camada | O que é |
| --- | --- |
| HTML (arquivo) | O código-fonte estático que o navegador recebeu |
| DOM (em memória) | A árvore de objetos viva, que o navegador renderiza e o JS manipula |

::: tip Relação com a Aula 01 de HTML
A [árvore de elementos](/htmlFundamentos/html-introducao#arvore) que você viu em HTML (pais, filhos, irmãos) é exatamente a estrutura que o DOM expõe para o JavaScript.
:::

## 2. Selecionando elementos

```js
// Por id: retorna um único elemento
const titulo = document.getElementById('titulo');

// Por seletor CSS: retorna o primeiro que casar
const primeiroItem = document.querySelector('.item');

// Por seletor CSS: retorna TODOS que casarem (NodeList)
const todosItens = document.querySelectorAll('.item');
```

::: tip Boa prática
Prefira `querySelector`/`querySelectorAll`: eles aceitam qualquer seletor CSS (classe, id, atributo, combinadores), então você reaproveita o que já sabe de CSS em vez de aprender uma API separada para cada caso.
:::

[Testar seletores ao vivo →](/jsFundamentos/js-dom-eventos-exemplos#selecao)

## 3. Manipulando HTML com JavaScript

### Texto e HTML interno

```js
const titulo = document.querySelector('h1');

titulo.textContent = 'Novo título';        // troca o texto (seguro contra HTML malicioso)
titulo.innerHTML = 'Novo <em>título</em>'; // troca o HTML interno (cuidado com dados de usuário!)
```

::: tip `textContent` vs `innerHTML`
Use `textContent` sempre que o conteúdo for texto puro. Só use `innerHTML` quando precisar inserir HTML de fato. Nunca use com texto vindo direto do usuário sem sanitização, ou você abre a porta para um ataque de **XSS** (o usuário poderia injetar `<script>` ou atributos como `onerror`).
:::

### Inserindo HTML em posições específicas

`innerHTML` sempre substitui o conteúdo inteiro. Quando você quer **adicionar** HTML sem apagar o que já existe, `insertAdjacentHTML` deixa escolher exatamente onde:

```js
const caixa = document.querySelector('.caixa');

caixa.insertAdjacentHTML('afterbegin', '<p>Primeiro parágrafo</p>');
caixa.insertAdjacentHTML('beforeend', '<p>Último parágrafo</p>');
```

<div class="insert-position">
  <div class="ip-outer">beforebegin
    <div class="ip-el">&lt;div class="caixa"&gt;
      <div class="ip-inner">afterbegin
        <div class="ip-content">...conteúdo existente...</div>
      afterend do último filho / beforeend</div>
    &lt;/div&gt;</div>
  afterend</div>
</div>

| Posição | Onde entra |
| --- | --- |
| `beforebegin` | antes do elemento, como irmão anterior |
| `afterbegin` | dentro do elemento, antes do primeiro filho |
| `beforeend` | dentro do elemento, depois do último filho |
| `afterend` | depois do elemento, como próximo irmão |

### Atributos: `setAttribute` × propriedade × `dataset`

```js
const link = document.querySelector('a');

link.setAttribute('href', '/nova-pagina'); // define um atributo genérico
link.getAttribute('href');                  // lê o valor de um atributo
link.hasAttribute('target');                // true/false
link.removeAttribute('target');             // remove o atributo

// atalho direto para atributos comuns (equivalente, mais lido)
link.href = '/nova-pagina';

// atributos data-* têm uma API própria: dataset
// HTML: <li data-id="42" data-categoria="frutas">
const item = document.querySelector('li');
item.dataset.id;         // "42"
item.dataset.categoria;  // "frutas"
item.dataset.novo = 'sim'; // cria data-novo="sim" no HTML
```

### Clonando e substituindo elementos

```js
const original = document.querySelector('.card');

const copia = original.cloneNode(true); // true = clona também os filhos
document.querySelector('.container').appendChild(copia);

// substituir um elemento inteiro por outro
const novoCard = document.createElement('div');
novoCard.textContent = 'Card atualizado';
original.replaceWith(novoCard);
```

[Testar manipulação de HTML ao vivo →](/jsFundamentos/js-dom-eventos-exemplos#manipulacao-html)

## 4. Criando, movendo e removendo elementos

### O padrão básico: criar → preencher → inserir

```js
const li = document.createElement('li');
li.textContent = 'Novo item';

const lista = document.querySelector('ul');
lista.appendChild(li);   // insere como último filho
lista.prepend(li);       // ou insere como primeiro filho
```

### Renderizando uma lista a partir de dados

Esse é o padrão mais comum na prática: transformar um array de dados em elementos reais na página.

```js
const frutas = ['maçã', 'banana', 'uva'];
const lista = document.querySelector('#lista-frutas');

lista.innerHTML = ''; // limpa o conteúdo anterior antes de re-renderizar

frutas.forEach((fruta) => {
  const li = document.createElement('li');
  li.textContent = fruta;
  li.classList.add('item-fruta');
  lista.appendChild(li);
});
```

::: tip `DocumentFragment` para inserir muitos elementos de uma vez
Cada `appendChild` direto na página pode forçar o navegador a recalcular o layout. Ao inserir muitos elementos, monte-os primeiro em um `DocumentFragment` (que não faz parte da página) e insira tudo de uma vez:

```js
const fragment = document.createDocumentFragment();

frutas.forEach((fruta) => {
  const li = document.createElement('li');
  li.textContent = fruta;
  fragment.appendChild(li);
});

lista.appendChild(fragment); // um único recálculo de layout
```
:::

### Removendo elementos

```js
const item = document.querySelector('.item');

item.remove();                       // forma moderna, direta
item.parentElement.removeChild(item); // forma antiga, ainda comum em código legado
```

[Testar renderização de listas ao vivo →](/jsFundamentos/js-dom-eventos-exemplos#manipulacao-html)

## 5. Manipulando CSS com JavaScript

Há três formas de alterar a aparência de um elemento via JavaScript, cada uma com seu uso ideal.

| Abordagem | Quando usar |
| --- | --- |
| `classList` | Padrão para a maioria dos casos: liga/desliga um conjunto de estilos já definido no CSS |
| `style` | Um valor calculado dinamicamente (posição de arrastar, cor escolhida pelo usuário) |
| Variáveis CSS via `style.setProperty` | Um valor dinâmico que afeta **vários** elementos ao mesmo tempo (tema, escala) |

### `classList`: a forma preferida

```js
const caixa = document.querySelector('.caixa');

caixa.classList.add('destaque');      // adiciona
caixa.classList.remove('escondido');  // remove
caixa.classList.toggle('ativo');      // alterna
caixa.classList.contains('ativo');    // true/false, sem alterar nada
```

::: tip Boa prática
Prefira `classList` a manipular `style` diretamente. Deixe o CSS decidir *como* cada estado parece (cores, bordas, animação) e deixe o JavaScript decidir só *quando* aplicar aquele estado, a mesma separação de responsabilidades vista na [Aula 01 de HTML](/htmlFundamentos/html-introducao#estrutura-basica-de-um-documento).
:::

### `style`: propriedades inline individuais

```js
const caixa = document.querySelector('.caixa');

caixa.style.color = 'white';          // propriedades em camelCase (background-color → backgroundColor)
caixa.style.backgroundColor = 'tomato';
caixa.style.padding = '1rem';

// definir várias de uma vez
caixa.style.cssText = 'color: white; background-color: tomato; padding: 1rem;';

// remover um estilo inline específico
caixa.style.color = '';
```

### Lendo o estilo realmente aplicado: `getComputedStyle`

`element.style` só enxerga estilos **inline**: não o que veio de um arquivo CSS ou de uma tag `<style>`. Para ler o valor final, depois de toda a cascata aplicada, use `getComputedStyle`:

```js
const caixa = document.querySelector('.caixa');

caixa.style.color; // '': vazio, se a cor veio de um arquivo CSS externo

const estilos = getComputedStyle(caixa);
estilos.color;                        // a cor realmente renderizada, ex: "rgb(255, 0, 0)"
estilos.getPropertyValue('font-size'); // "16px"
```

### Variáveis CSS (custom properties)

Variáveis CSS (`--nome-da-variavel`) definidas no CSS podem ser lidas e alteradas via JavaScript: ideal para temas, porque uma única mudança afeta todos os elementos que usam aquela variável:

```css
:root {
  --cor-primaria: #6366f1;
}
.botao {
  background: var(--cor-primaria);
}
```

```js
// ler o valor atual da variável
getComputedStyle(document.documentElement).getPropertyValue('--cor-primaria');

// alterar a variável: todo elemento que usa var(--cor-primaria) atualiza junto
document.documentElement.style.setProperty('--cor-primaria', '#22c55e');
```

### Exemplo prático: alternador de tema (dark mode)

Combinando `classList` com variáveis CSS: o padrão real usado por sites com alternância de tema:

```css
:root {
  --bg: white;
  --texto: black;
}
.dark {
  --bg: #1e1e2e;
  --texto: white;
}
body {
  background: var(--bg);
  color: var(--texto);
}
```

```js
const botaoTema = document.querySelector('#alternar-tema');

botaoTema.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});
```

### Injetando CSS dinamicamente

Para casos mais raros (gerar regras CSS que não existem de antemão), é possível criar uma tag `<style>` via JavaScript:

```js
const estilo = document.createElement('style');
estilo.textContent = `
  .destaque-dinamico {
    border: 2px solid orange;
    animation: pulsar 1s infinite;
  }
`;
document.head.appendChild(estilo);
```

[Testar manipulação de CSS ao vivo →](/jsFundamentos/js-dom-eventos-exemplos#manipulacao-css)

## 6. Eventos

Um evento é algo que **acontece** na página: um clique, uma tecla pressionada, um formulário enviado. `addEventListener` registra uma função para rodar quando esse evento ocorrer.

```js
const botao = document.querySelector('#meu-botao');

botao.addEventListener('click', function (event) {
  console.log('Botão clicado!');
  console.log(event.target); // o elemento que disparou o evento
});
```

| Evento | Ocorre quando... |
| --- | --- |
| `click` | o elemento é clicado |
| `input` | o valor de um campo muda, a cada tecla |
| `submit` | um `<form>` é enviado |
| `keydown` | uma tecla é pressionada |
| `DOMContentLoaded` | o HTML terminou de carregar (em `document`) |

### `preventDefault()`

Alguns elementos têm um comportamento padrão do navegador (um link navega, um form recarrega a página). `preventDefault()` cancela esse comportamento para você controlar o que acontece:

```js
const form = document.querySelector('form');

form.addEventListener('submit', function (event) {
  event.preventDefault(); // impede o recarregamento da página
  console.log('Formulário enviado sem recarregar!');
});
```

[Testar eventos ao vivo →](/jsFundamentos/js-dom-eventos-exemplos#eventos)

## 7. Assincronismo: código que espera algo

Buscar dados de um servidor, esperar um temporizador: essas operações não terminam instantaneamente. JavaScript lida com isso de forma **assíncrona**, sem travar o resto da página enquanto espera.

### `setTimeout` e a ordem de execução

```js
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

console.log('3');

// ordem real no console: 1, 3, 2
```

Mesmo com `0` milissegundos de espera, o `setTimeout` só executa **depois** que todo o código síncrono terminar. JavaScript processa uma coisa por vez (é *single-threaded*) e código assíncrono sempre espera sua vez na fila.

[Ver a ordem de execução ao vivo →](/jsFundamentos/js-dom-eventos-exemplos#async)

### Promises

Uma **Promise** representa um valor que vai existir *no futuro*: ela pode ser resolvida com sucesso (`resolve`) ou falhar (`reject`).

```js
function esperar(segundos) {
  return new Promise((resolve) => {
    setTimeout(() => resolve('Pronto!'), segundos * 1000);
  });
}

esperar(2).then((mensagem) => console.log(mensagem)); // 'Pronto!' depois de 2s
```

### async/await

`async`/`await` é uma forma de escrever código com Promises que **parece síncrono**, mais fácil de ler do que encadear vários `.then()`:

```js
async function buscarDados() {
  console.log('Buscando...');
  const resposta = await fetch('https://api.exemplo.com/dados');
  const dados = await resposta.json();
  console.log(dados);
}
```

`await` só pode ser usado dentro de uma função marcada como `async`, e ele **pausa** a execução daquela função (sem travar a página) até a Promise resolver.

::: tip Boa prática
Sempre trate erros de código assíncrono com `try/catch` (junto com `async/await`) ou `.catch()` (junto com `.then()`). Uma requisição de rede pode falhar, e código sem tratamento de erro quebra silenciosamente.
:::

```js
async function buscarDados() {
  try {
    const resposta = await fetch('https://api.exemplo.com/dados');
    const dados = await resposta.json();
    console.log(dados);
  } catch (erro) {
    console.error('Falhou:', erro);
  }
}
```

## 8. Boas práticas: resumo

- Prefira `querySelector`/`querySelectorAll` a `getElementById`/`getElementsByClassName`.
- Use `textContent` por padrão; só use `innerHTML` quando precisar de HTML de fato, nunca com dados de usuário sem sanitizar.
- Prefira `classList` a mexer em `style` diretamente: deixe o CSS decidir a aparência de cada estado.
- Use `getComputedStyle` para **ler** estilo aplicado; use `style`/`classList` para **alterar**.
- Ao inserir muitos elementos de uma vez, monte-os em um `DocumentFragment` antes de inserir na página.
- Sempre chame `preventDefault()` em formulários que você mesmo vai tratar via JS.
- Prefira `async/await` a encadear `.then()`, e sempre trate erros com `try/catch`.
- Lembre-se: código assíncrono sempre roda **depois** do código síncrono, mesmo com delay `0`.

## 9. Exercícios

1. **Seleção**: Dado um HTML com três `<li class="item">`, use `querySelectorAll` para selecioná-los e `forEach` para imprimir o texto de cada um.
2. **Manipulação de HTML**: Dado `<ul id="lista"></ul>`, use um array de nomes e `createElement`/`appendChild` (ou um `DocumentFragment`) para renderizar um `<li>` para cada nome.
3. **Atributos**: Em um elemento com `data-id="7"`, leia o valor via `dataset` e depois altere para `"8"`.
4. **Manipulação de CSS**: Escreva uma função `alternarTema()` que dá `toggle` na classe `dark` do `<html>` e leia, com `getComputedStyle`, a cor de fundo resultante.
5. **Variável CSS**: Defina `--cor-destaque` no CSS e escreva um código JS que a altera para um valor escolhido pelo usuário via `<input type="color">`.
6. **Evento**: Registre um `click` em um botão que alterna (`toggle`) uma classe `ativo` em um `<div>`.
7. **preventDefault**: Escreva o `addEventListener('submit', ...)` de um formulário que impede o recarregamento e imprime os dados no console.
8. **Async**: Escreva uma função `async` que aguarda 1 segundo (usando a função `esperar` do exemplo) e depois imprime `'Terminou!'`.

---

**Fim da série de Fundamentos JavaScript.** Próximo passo natural: praticar combinando DOM + eventos + fetch em um projeto pequeno (uma lista de tarefas, um buscador de CEP, um consumo de API pública).

<style scoped src="./shared.css"></style>
<style scoped src="./js-dom-eventos.css"></style>
