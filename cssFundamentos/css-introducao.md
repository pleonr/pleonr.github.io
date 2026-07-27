---
title: "CSS Fundamentos: Aula 01"
---

[← Fundamentos CSS](/cssFundamentos/)

# Introdução ao CSS

<p class="lesson-subtitle">O que é CSS · Sintaxe · Seletores · Cascata e Especificidade · Boas práticas</p>

**CSS** (*Cascading Style Sheets*, ou Folhas de Estilo em Cascata) é a linguagem que descreve **como** o HTML deve ser apresentado: cores, espaçamentos, fontes, layout. O HTML cuida do *conteúdo e da estrutura*; o CSS cuida da *apresentação*. Manter essas duas responsabilidades separadas é o princípio mais importante para começar bem.

<div class="before-after">
  <div class="ba-card">
    <p class="ba-label">HTML sem CSS</p>
    <div class="ba-preview ba-plain">
      <strong class="ba-h">Título do artigo</strong>
      <span class="ba-p">Este é um parágrafo de exemplo mostrando como o navegador renderiza HTML puro, sem nenhuma folha de estilo aplicada.</span>
      <span class="ba-btn">Ler mais</span>
    </div>
  </div>
  <div class="ba-card">
    <p class="ba-label">O mesmo HTML, com CSS</p>
    <div class="ba-preview ba-styled">
      <strong class="ba-h">Título do artigo</strong>
      <span class="ba-p">Este é um parágrafo de exemplo mostrando como o navegador renderiza HTML puro, sem nenhuma folha de estilo aplicada.</span>
      <span class="ba-btn">Ler mais</span>
    </div>
  </div>
</div>

## 1. Como aplicar CSS ao HTML

Existem três formas de conectar CSS a um documento HTML:

<div class="prop-card">
<h4>1. CSS inline (evite)</h4>
<p>Escrito diretamente no atributo <code>style</code> do elemento. Tem a maior especificidade e é o mais difícil de manter.</p>

```html
<p style="color: red; font-size: 18px;">Texto em vermelho</p>
```
</div>

<div class="prop-card">
<h4>2. CSS interno</h4>
<p>Escrito dentro de uma tag <code>&lt;style&gt;</code> no <code>&lt;head&gt;</code> do documento. Útil para protótipos rápidos ou páginas únicas.</p>

```html
<head>
  <style>
    p { color: red; font-size: 18px; }
  </style>
</head>
```
</div>

<div class="prop-card highlight-card">
<h4>3. CSS externo (recomendado)</h4>
<p>Escrito em um arquivo <code>.css</code> separado e conectado via <code>&lt;link&gt;</code>. Permite reaproveitar o mesmo arquivo em várias páginas e o navegador faz cache dele.</p>

```html
<head>
  <link rel="stylesheet" href="estilos.css" />
</head>
```

```css
/* estilos.css */
p { color: red; font-size: 18px; }
```
</div>

| Método | Especificidade | Cache do navegador | Reutilização | Quando usar |
| --- | --- | --- | --- | --- |
| Inline | Muito alta | Não | Nenhuma | Nunca (ou só em e-mails HTML) |
| Interno | Normal | Não | Só na mesma página | Protótipos, exemplos isolados |
| Externo | Normal | Sim | Total | Projetos reais: **sempre prefira este** |

::: tip Boa prática
Separe sempre estrutura (HTML) de apresentação (CSS). Isso facilita manutenção, permite reaproveitar estilos entre páginas e deixa o HTML mais limpo e legível.
:::

## 2. Sintaxe do CSS

Uma regra CSS é composta por um **seletor** (o que será estilizado) e um **bloco de declarações** entre chaves (como será estilizado):

<div class="syntax-diagram">
  <div class="syntax-row">
    <span class="syn-selector">.card</span>
    <span class="syn-brace">{</span>
  </div>
  <div class="syntax-row syntax-indent">
    <span class="syn-prop">color</span><span class="syn-colon">:</span>
    <span class="syn-val">#3558e0</span><span class="syn-semi">;</span>
  </div>
  <div class="syntax-row"><span class="syn-brace">}</span></div>
  <div class="syntax-labels">
    <span class="syn-lbl syn-lbl-selector">seletor</span>
    <span class="syn-lbl syn-lbl-prop">propriedade</span>
    <span class="syn-lbl syn-lbl-val">valor</span>
  </div>
</div>

Cada par `propriedade: valor;` é uma **declaração**. Um conjunto de declarações entre chaves é um **bloco de declaração**. Seletor + bloco formam uma **regra** (*rule*).

## 3. Seletores básicos

| Seletor | Exemplo | Descrição |
| --- | --- | --- |
| Universal | `*` | Seleciona todos os elementos |
| Elemento (tag) | `p` | Seleciona todas as tags `<p>` |
| Classe | `.destaque` | Seleciona elementos com `class="destaque"` |
| ID | `#cabecalho` | Seleciona o elemento com `id="cabecalho"` (único por página) |
| Agrupamento | `h1, h2, h3` | Aplica a mesma regra a vários seletores |
| Descendente | `.card p` | Qualquer `<p>` dentro de `.card`, em qualquer nível |
| Filho direto | `.card > p` | Só `<p>` que é filho **direto** de `.card` |

```css
* { box-sizing: border-box; }        /* universal */
p { line-height: 1.6; }              /* elemento */
.destaque { color: #e07070; }        /* classe */
#cabecalho { font-weight: 700; }     /* id */
h1, h2, h3 { font-family: serif; }   /* agrupamento */
.card p { margin-bottom: 8px; }      /* descendente */
.card > p { margin-bottom: 8px; }    /* filho direto */
```

::: tip Boa prática
Prefira **classes** para estilizar. Um `id` é único na página e tem especificidade muito alta, o que dificulta sobrescrever a regra depois. Reserve `id` para âncoras (`#secao`) ou hooks de JavaScript.
:::

[Ver seletores em ação →](/cssFundamentos/css-introducao-exemplos#seletores)

## 4. Cascata, especificidade e herança

O "C" de CSS vem de *cascade* (cascata): quando várias regras se aplicam ao mesmo elemento, o navegador precisa decidir qual vence. Ele segue, nesta ordem:

1. **Importância e origem**: regras com `!important` vencem regras normais; estilos do autor vencem estilos padrão do navegador.
2. **Especificidade**: quanto mais específico o seletor, mais peso ele tem.
3. **Ordem no código**: em caso de empate, a última regra declarada vence.

### Calculando especificidade

Pense na especificidade como uma pontuação de três dígitos `(IDs, Classes, Elementos)`:

| Tipo de seletor | Peso |
| --- | --- |
| ID (`#exemplo`) | 1-0-0 |
| Classe, pseudo-classe, atributo (`.card`, `:hover`, `[type]`) | 0-1-0 |
| Elemento, pseudo-elemento (`div`, `::before`) | 0-0-1 |

```css
p               { color: blue; }   /* 0-0-1 */
.aviso           { color: orange; } /* 0-1-0: vence a de cima */
.card .aviso     { color: red; }    /* 0-2-0: vence as duas acima */
#unico           { color: green; }  /* 1-0-0: vence todas as anteriores */
```

::: tip Boa prática
Evite `!important` e evite empilhar muitas classes em um único seletor (`.a .b .c .d { }`). Especificidade alta e imprevisível é uma das maiores causas de "CSS que ninguém entende" em projetos grandes. Mantenha seletores curtos e a especificidade baixa e consistente.
:::

### Herança

Algumas propriedades são **herdadas** automaticamente pelos elementos filhos (tipografia, cor), outras **não** (box model, posicionamento):

| Herdadas | Não herdadas |
| --- | --- |
| `color`, `font-family`, `font-size`, `line-height`, `text-align` | `margin`, `padding`, `border`, `width`, `height`, `background`, `position` |

Você pode forçar herança com o valor especial `inherit`, por exemplo `border-color: inherit;`.

[Testar especificidade →](/cssFundamentos/css-introducao-exemplos#especificidade)

## 5. Unidades de medida

| Unidade | Tipo | Relativa a | Uso recomendado |
| --- | --- | --- | --- |
| `px` | Absoluta | N/A | Bordas finas, sombras: coisas que não devem escalar |
| `%` | Relativa | Elemento pai | Larguras fluidas |
| `em` | Relativa | `font-size` do elemento pai | Espaçamentos internos a um componente |
| `rem` | Relativa | `font-size` do elemento raiz (`html`) | **Tamanho de fonte, na maioria dos casos** |
| `vw` / `vh` | Relativa | Largura/altura da viewport | Elementos que ocupam proporção da tela |

```css
html { font-size: 16px; }        /* base para todo o rem da página */

.titulo   { font-size: 2rem; }    /* 32px, sempre relativo à raiz */
.card     { padding: 1.5em; }     /* relativo ao font-size do próprio .card */
.container{ width: 90%; }         /* relativo ao pai */
.hero     { height: 60vh; }       /* 60% da altura da viewport */
```

::: tip Boa prática
Prefira `rem` para `font-size`. Diferente de `px`, o `rem` respeita a configuração de tamanho de fonte do navegador do usuário, o que é importante para acessibilidade. Use `em` quando quiser que um espaçamento escale *junto* com o texto do próprio componente.
:::

[Comparar unidades →](/cssFundamentos/css-introducao-exemplos#unidades)

## 6. Cores

| Formato | Exemplo | Descrição |
| --- | --- | --- |
| Palavra-chave | `color: tomato;` | 147 nomes predefinidos, bom para protótipos |
| Hexadecimal | `color: #4a6cf7;` | `#RRGGBB`, o formato mais comum |
| RGB / RGBA | `color: rgba(74, 108, 247, 0.6);` | Vermelho, Verde, Azul + transparência opcional |
| HSL / HSLA | `color: hsl(227, 90%, 63%);` | Matiz, Saturação, Luminosidade: mais intuitivo para criar variações |

<div class="color-swatches">
  <div class="swatch" style="background:#4a6cf7">#4a6cf7</div>
  <div class="swatch" style="background:rgba(224,112,112,0.85)">rgba(224,112,112,.85)</div>
  <div class="swatch" style="background:hsl(142, 43%, 54%)">hsl(142 43% 54%)</div>
  <div class="swatch swatch-dark" style="background:tomato">tomato</div>
</div>

::: tip Boa prática
HSL é o formato mais fácil de raciocinar quando você precisa de variações de uma mesma cor (mais claro, mais escuro, mais saturado): basta ajustar um único número, a luminosidade.
:::

[Testar seletores de cor (hexágono e círculos) →](/cssFundamentos/css-introducao-exemplos#cores)

## 7. Comentários e organização

```css
/* Isto é um comentário: o navegador ignora este trecho */

/* ==========================
   Cabeçalho
   ========================== */
.header { ... }

/* ==========================
   Cartões de produto
   ========================== */
.card { ... }
```

Organize o arquivo CSS agrupando regras por componente ou seção da página, com comentários curtos separando os blocos. Isso facilita muito encontrar o que precisa ser alterado depois.

## 8. Boas práticas: resumo

- Sempre use CSS **externo**; evite `style="..."` inline.
- Prefira **classes** a `id` para estilização.
- Mantenha a **especificidade baixa** e evite `!important`.
- Use **rem** para tamanhos de fonte, **em** para espaçamentos internos ao componente.
- Nomeie classes de forma **descritiva e consistente** (`.card-titulo`, não `.ct1`).
- Agrupe e **comente** seções do CSS.
- Escreva seletores **curtos**; evite encadear mais de 2-3 níveis (`.a .b .c .d`).

## 9. Exercícios

1. **Três formas de CSS**: Crie uma página HTML simples e aplique a mesma cor de fundo a um parágrafo de três formas: inline, interna e externa. Compare no código qual é mais fácil de manter.
2. **Seletores**: Em uma lista com 5 itens `<li>`, use um seletor de classe para colorir apenas o terceiro item e um seletor universal para adicionar `box-sizing: border-box` a toda a página.
3. **Especificidade**: Escreva três regras que competem pela cor do mesmo parágrafo (uma por elemento, uma por classe, uma por id). Preveja qual vence antes de testar no navegador.
4. **Unidades**: Crie três caixas com a mesma largura declarada em `px`, `%` e `rem`. Redimensione a janela do navegador e observe qual se comporta de forma diferente.
5. **Cores**: Escolha uma cor em hexadecimal e escreva a mesma cor em `rgb()` e `hsl()`. Use uma ferramenta de conversão para conferir.

---

**Próxima aula:** [Aula 02: Propriedades CSS →](/cssFundamentos/css-propriedades)

<style scoped src="./shared.css"></style>
<style scoped src="./css-introducao.css"></style>
