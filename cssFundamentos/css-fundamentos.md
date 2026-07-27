---
title: "CSS Fundamentos: Aula 03"
---

[← Fundamentos CSS](/cssFundamentos/)

# CSS Fundamentos

<p class="lesson-subtitle">Box Model · Posicionamento · Display · <strong>Flexbox</strong></p>

Todo elemento HTML é tratado pelo browser como uma **caixa retangular**. Este material cobre os quatro pilares do layout em CSS clássico: a base necessária antes de partir para Grid ou frameworks utilitários.

**Aula anterior:** [Aula 02: Propriedades CSS](/cssFundamentos/css-propriedades)

## 1. Box Model

Todo elemento HTML é composto por quatro camadas concêntricas:

<div class="box-model-diagram">
  <div class="bm-margin">
    <span class="bm-label">margin</span>
    <div class="bm-border">
      <span class="bm-label">border</span>
      <div class="bm-padding">
        <span class="bm-label">padding</span>
        <div class="bm-content">
          <span class="bm-label">content</span>
        </div>
      </div>
    </div>
  </div>
</div>

| Camada | Descrição | Propriedade CSS |
| --- | --- | --- |
| `content` | Área do conteúdo (texto, imagem…) | `width` / `height` |
| `padding` | Espaço interno entre o conteúdo e a borda | `padding` |
| `border` | Linha ao redor do padding | `border` |
| `margin` | Espaço externo entre o elemento e os vizinhos | `margin` |

### box-sizing

Por padrão, `width` e `height` se referem apenas ao *content*. Usando `box-sizing: border-box`, **padding e border são incluídos** na dimensão declarada: comportamento muito mais previsível.

```css
/* Boa prática global */
*, *::before, *::after {
  box-sizing: border-box;
}

.caixa {
  width: 200px;     /* largura TOTAL inclui padding e border */
  padding: 20px;
  border: 2px solid #333;
  margin: 16px;
}
```

### Demonstração

<div class="demo-row">
  <div class="demo-box bm-content-box">
    <p>content-box</p>
    <small>width: 200px<br>+ padding: 20px<br>+ border: 4px<br>= <strong>248px</strong> no layout</small>
  </div>
  <div class="demo-box bm-border-box">
    <p>border-box</p>
    <small>width: 200px<br>padding e border<br>já estão incluídos<br>= <strong>200px</strong> no layout</small>
  </div>
</div>

::: tip Dica
Sempre use `box-sizing: border-box` globalmente. Isso evita surpresas de tamanho ao adicionar padding ou border.
:::

[Ver exemplos interativos de Box Model →](/cssFundamentos/css-exemplos-box-model)

## 2. Posicionamento

A propriedade `position` controla como um elemento é colocado no documento. As propriedades de deslocamento (`top`, `right`, `bottom`, `left`) só funcionam em elementos posicionados (qualquer valor diferente de `static`).

| Valor | Referência | Fluxo do documento |
| --- | --- | --- |
| `static` | Padrão. Segue o fluxo normal. | Permanece no fluxo |
| `relative` | Deslocado em relação à **sua posição original**. | Permanece no fluxo (ocupa espaço original) |
| `absolute` | Posicionado em relação ao **ancestral posicionado** mais próximo. | Removido do fluxo |
| `fixed` | Posicionado em relação à **viewport**. Não se move ao rolar. | Removido do fluxo |
| `sticky` | Relativo até atingir um limiar de scroll; então age como *fixed*. | Permanece no fluxo |

### Exemplos de código

```css
/* relative: desloca sem tirar do fluxo */
.destaque {
  position: relative;
  top: 10px;
  left: 20px;
}

/* absolute: dentro de um pai com position: relative */
.container { position: relative; }

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

/* fixed: barra de navegação sempre visível */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

/* sticky: cabeçalho que gruda no topo ao rolar */
.section-header {
  position: sticky;
  top: 0;
  background: #fff;
}
```

### Demonstração visual

<div class="pos-container">
  <div class="pos-box pos-static">static</div>
  <div class="pos-box pos-relative">relative<br><small>top:10 left:20</small></div>
  <div class="pos-box pos-static">static</div>
  <div class="pos-box pos-absolute">absolute<br><small>top:0 right:0</small></div>
</div>

### z-index

Quando elementos se sobrepõem, `z-index` define a ordem no eixo Z. Valores maiores ficam na frente. **Só funciona em elementos posicionados.**

```css
.fundo  { position: absolute; z-index: 1; }
.frente { position: absolute; z-index: 10; } /* fica sobre .fundo */
```

[Ver exemplos interativos de Posicionamento →](/cssFundamentos/css-exemplos-posicionamento)

## 3. Display

A propriedade `display` define o *modelo de formatação* do elemento. É a propriedade CSS mais importante para controle de layout.

| Valor | Comportamento | Exemplos de elementos |
| --- | --- | --- |
| `block` | Ocupa toda a largura disponível. Começa em nova linha. | `div`, `p`, `h1`–`h6` |
| `inline` | Ocupa só o espaço do conteúdo. Não aceita width/height. | `span`, `a`, `strong` |
| `inline-block` | Inline no fluxo, mas aceita width/height/margin vertical. | Botões, ícones |
| `none` | Remove o elemento do fluxo e da renderização. | Elementos ocultos |
| `flex` | Ativa o Flexbox no container. Filhos tornam-se flex items. | Layouts 1D |
| `grid` | Ativa o Grid Layout no container. | Layouts 2D |

### Demonstração

<div class="display-demo">
  <span class="d-block">block</span>
  <span class="d-inline">inline</span>
  <span class="d-inline">inline</span>
  <span class="d-inline">inline</span>
  <span class="d-inline-block">inline-block<br>(200px)</span>
  <span class="d-inline-block">inline-block<br>(200px)</span>
</div>

[Ver exemplos interativos de Display →](/cssFundamentos/css-exemplos-display)

## 4. Flexbox

O **Flexible Box Layout** (Flexbox) é um modelo de layout *unidimensional*: trabalha em uma direção por vez (linha ou coluna). É ideal para alinhar, distribuir espaço e reordenar itens em um container, sem depender de floats ou posicionamento absoluto.

<div class="flex-axes-diagram">
  <div class="flex-axis-box">
    <div class="axis-main"><span>← eixo principal (main axis) →</span></div>
    <div class="axis-cross-label">↑<br>eixo<br>cruzado<br>(cross axis)<br>↓</div>
    <div class="axis-items">
      <div class="axis-item">1</div>
      <div class="axis-item">2</div>
      <div class="axis-item">3</div>
    </div>
  </div>
</div>

### 4.1 Propriedades do Container (`display: flex`)

Para ativar o Flexbox, aplique `display: flex` (ou `inline-flex`) no elemento pai. Todos os filhos diretos tornam-se **flex items**.

<div class="prop-card">
<h4><code>flex-direction</code></h4>
<p>Define a direção do eixo principal.</p>

```css
.container {
  display: flex;
  flex-direction: row;            /* padrão: esquerda → direita */
  /* flex-direction: row-reverse; */    /* direita → esquerda */
  /* flex-direction: column; */         /* cima → baixo */
  /* flex-direction: column-reverse; */ /* baixo → cima */
}
```

<div class="flex-demo-group">
  <div><p class="demo-label">row</p>
    <div class="fdemo fd-row"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
  <div><p class="demo-label">row-reverse</p>
    <div class="fdemo fd-row-reverse"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
  <div><p class="demo-label">column</p>
    <div class="fdemo fd-column"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
  <div><p class="demo-label">column-reverse</p>
    <div class="fdemo fd-column-reverse"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
</div>
</div>

<div class="prop-card">
<h4><code>flex-wrap</code></h4>
<p>Define se os itens podem quebrar para uma nova linha quando não há espaço suficiente.</p>

```css
.container {
  display: flex;
  flex-wrap: nowrap;       /* padrão: não quebra, comprime itens */
  flex-wrap: wrap;         /* quebra para a próxima linha */
  flex-wrap: wrap-reverse; /* quebra de baixo para cima */
}
```

<div class="flex-demo-group">
  <div><p class="demo-label">nowrap (comprime)</p>
    <div class="fdemo fd-nowrap">
      <div class="fi fi-w">Item 1</div><div class="fi fi-w">Item 2</div>
      <div class="fi fi-w">Item 3</div><div class="fi fi-w">Item 4</div>
      <div class="fi fi-w">Item 5</div>
    </div></div>
  <div><p class="demo-label">wrap</p>
    <div class="fdemo fd-wrap">
      <div class="fi fi-w">Item 1</div><div class="fi fi-w">Item 2</div>
      <div class="fi fi-w">Item 3</div><div class="fi fi-w">Item 4</div>
      <div class="fi fi-w">Item 5</div>
    </div></div>
</div>
</div>

<div class="prop-card">
<h4><code>justify-content</code></h4>
<p>Distribui os itens ao longo do <strong>eixo principal</strong>.</p>

```css
.container {
  display: flex;
  justify-content: flex-start;     /* padrão */
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between;  /* espaço entre (sem nas bordas) */
  justify-content: space-around;   /* espaço ao redor de cada item */
  justify-content: space-evenly;   /* espaços iguais em todos os lados */
}
```

<div class="jc-demos">
  <div><p class="demo-label">flex-start</p><div class="fdemo jc-flex-start"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
  <div><p class="demo-label">flex-end</p><div class="fdemo jc-flex-end"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
  <div><p class="demo-label">center</p><div class="fdemo jc-center"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
  <div><p class="demo-label">space-between</p><div class="fdemo jc-space-between"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
  <div><p class="demo-label">space-around</p><div class="fdemo jc-space-around"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
  <div><p class="demo-label">space-evenly</p><div class="fdemo jc-space-evenly"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
</div>
</div>

<div class="prop-card">
<h4><code>align-items</code></h4>
<p>Alinha os itens ao longo do <strong>eixo cruzado</strong> (perpendicular ao principal).</p>

```css
.container {
  display: flex;
  align-items: stretch;     /* padrão: estica para preencher */
  align-items: flex-start;  /* topo do container */
  align-items: flex-end;    /* fundo do container */
  align-items: center;      /* centralizado verticalmente */
  align-items: baseline;    /* alinha pela linha de base do texto */
}
```

<div class="ai-demos">
  <div><p class="demo-label">flex-start</p>
    <div class="fdemo ai-demo ai-flex-start"><div class="fi fi-s">A</div><div class="fi fi-m">B</div><div class="fi fi-l">C</div></div></div>
  <div><p class="demo-label">center</p>
    <div class="fdemo ai-demo ai-center"><div class="fi fi-s">A</div><div class="fi fi-m">B</div><div class="fi fi-l">C</div></div></div>
  <div><p class="demo-label">flex-end</p>
    <div class="fdemo ai-demo ai-flex-end"><div class="fi fi-s">A</div><div class="fi fi-m">B</div><div class="fi fi-l">C</div></div></div>
  <div><p class="demo-label">stretch</p>
    <div class="fdemo ai-demo ai-stretch"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
</div>
</div>

<div class="prop-card">
<h4><code>align-content</code></h4>
<p>Alinha as <strong>linhas</strong> quando há múltiplas linhas (só tem efeito com <code>flex-wrap: wrap</code>).</p>

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-content: center;
  align-content: flex-end;
  align-content: space-between;
  align-content: space-around;
  align-content: stretch;   /* padrão */
}
```
</div>

<div class="prop-card">
<h4><code>gap</code></h4>
<p>Espaçamento entre os itens (substitui a necessidade de margin). Aceita dois valores: <code>gap: row-gap column-gap</code>.</p>

```css
.container {
  display: flex;
  gap: 16px;         /* mesmo gap em linha e coluna */
  gap: 10px 24px;    /* row-gap column-gap */
  row-gap: 10px;
  column-gap: 24px;
}
```

<div class="flex-demo-group">
  <div><p class="demo-label">gap: 8px</p><div class="fdemo gap-8"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
  <div><p class="demo-label">gap: 24px</p><div class="fdemo gap-24"><div class="fi">A</div><div class="fi">B</div><div class="fi">C</div></div></div>
</div>
</div>

### 4.2 Propriedades dos Itens

<div class="prop-card">
<h4><code>flex-grow</code></h4>
<p>Define a capacidade de um item <strong>crescer</strong> para ocupar o espaço restante. O valor é uma proporção: um item com <code>flex-grow: 2</code> cresce o dobro de um com <code>flex-grow: 1</code>.</p>

```css
.item-a { flex-grow: 1; } /* ocupa 1 parte do espaço livre */
.item-b { flex-grow: 2; } /* ocupa 2 partes do espaço livre */
.item-c { flex-grow: 1; } /* ocupa 1 parte do espaço livre */
```

<div class="fdemo fdemo-inline">
  <div class="fi" style="flex-grow:1; background:#6c8ebf">grow: 1</div>
  <div class="fi" style="flex-grow:2; background:#d6a84a">grow: 2</div>
  <div class="fi" style="flex-grow:1; background:#6c8ebf">grow: 1</div>
</div>
</div>

<div class="prop-card">
<h4><code>flex-shrink</code></h4>
<p>Define a capacidade de um item <strong>encolher</strong> quando o espaço é insuficiente. Padrão: <code>1</code>. Com <code>0</code>, o item não encolhe.</p>

```css
.item { flex-shrink: 1; } /* padrão: encolhe proporcionalmente */
.item { flex-shrink: 0; } /* não encolhe */
```
</div>

<div class="prop-card">
<h4><code>flex-basis</code></h4>
<p>Define o <strong>tamanho inicial</strong> de um item antes de o espaço livre ser distribuído. Pode ser um valor absoluto, percentual ou <code>auto</code> (padrão, usa width/height).</p>

```css
.item { flex-basis: auto; }   /* usa o tamanho do conteúdo */
.item { flex-basis: 200px; }  /* tamanho base de 200px */
.item { flex-basis: 30%; }    /* 30% do container */
```
</div>

<div class="prop-card highlight-card">
<h4><code>flex</code>: shorthand</h4>
<p>Combina <code>flex-grow</code>, <code>flex-shrink</code> e <code>flex-basis</code>. <strong>Prefira sempre o shorthand.</strong></p>

```css
/* flex: grow shrink basis */
.item { flex: 1; }          /* flex: 1 1 0: cresce e encolhe livremente */
.item { flex: auto; }       /* flex: 1 1 auto */
.item { flex: none; }       /* flex: 0 0 auto: tamanho fixo */
.item { flex: 0 1 200px; }  /* não cresce, pode encolher, base 200px */
```
</div>

<div class="prop-card">
<h4><code>align-self</code></h4>
<p>Sobrescreve o <code>align-items</code> do container para um item específico.</p>

```css
.container { display: flex; align-items: center; }

.item-especial {
  align-self: flex-end; /* vai para o fundo, ignorando o center do container */
}
```

<div class="fdemo ai-demo fdemo-inline">
  <div class="fi">normal</div>
  <div class="fi" style="align-self:flex-start">flex-start</div>
  <div class="fi" style="align-self:flex-end; background:#e07070">flex-end</div>
  <div class="fi" style="align-self:stretch">stretch</div>
</div>
</div>

<div class="prop-card">
<h4><code>order</code></h4>
<p>Controla a <strong>ordem visual</strong> dos itens sem alterar o HTML. Padrão: <code>0</code>. Itens com valor menor aparecem primeiro.</p>

```css
.item-1 { order: 3; } /* aparece por último */
.item-2 { order: 1; } /* aparece primeiro */
.item-3 { order: 2; } /* aparece segundo */
```

<div class="fdemo fdemo-inline">
  <div class="fi" style="order:3">HTML: 1<br><small>order: 3</small></div>
  <div class="fi" style="order:1; background:#6abf6a">HTML: 2<br><small>order: 1</small></div>
  <div class="fi" style="order:2">HTML: 3<br><small>order: 2</small></div>
</div>
</div>

### 4.3 Exemplos Práticos

<div class="prop-card highlight-card">
<h4>Centralização perfeita (horizontal + vertical)</h4>
<p>O truque mais famoso do Flexbox, antes muito difícil sem hacks.</p>

```css
.centralizado {
  display: flex;
  justify-content: center; /* eixo principal */
  align-items: center;     /* eixo cruzado */
  height: 200px;
}
```

<div class="center-example">
  <div class="fi center-example-item">Centralizado!</div>
</div>
</div>

<div class="prop-card">
<h4>Barra de navegação</h4>

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.nav-logo { font-weight: bold; }

.nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
}
```

<nav class="navbar-example">
  <span class="navbar-example-logo">MeuSite</span>
  <ul class="navbar-example-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">Sobre</a></li>
    <li><a href="#">Contato</a></li>
  </ul>
</nav>
</div>

<div class="prop-card">
<h4>Grid de Cards responsivo</h4>

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 250px; /* cresce, pode encolher, base 250px */
  padding: 16px;
  border-radius: 8px;
  background: #f5f5f5;
}
```

<div class="cards-example">
  <div class="cards-example-item" style="border-left-color:#6c8ebf"><strong>Card A</strong><p>Conteúdo do card A</p></div>
  <div class="cards-example-item" style="border-left-color:#d6a84a"><strong>Card B</strong><p>Conteúdo do card B</p></div>
  <div class="cards-example-item" style="border-left-color:#6abf6a"><strong>Card C</strong><p>Conteúdo do card C</p></div>
</div>
</div>

<div class="prop-card">
<h4>Layout de página com sidebar</h4>

```css
.pagina {
  display: flex;
  gap: 24px;
  min-height: 400px;
}

.sidebar {
  flex: 0 0 220px; /* largura fixa, não cresce nem encolhe */
}

.conteudo-principal {
  flex: 1; /* ocupa todo o espaço restante */
}
```

<div class="sidebar-example">
  <div class="sidebar-example-side"><strong>Sidebar</strong><br><small>flex: 0 0 120px</small></div>
  <div class="sidebar-example-main"><strong>Conteúdo Principal</strong><br><small>flex: 1: ocupa o resto</small></div>
</div>
</div>

### Resumo de todas as propriedades

**Propriedades do Container**

| Propriedade | Valores principais | Padrão |
| --- | --- | --- |
| `flex-direction` | row, row-reverse, column, column-reverse | row |
| `flex-wrap` | nowrap, wrap, wrap-reverse | nowrap |
| `flex-flow` | shorthand: direction + wrap | row nowrap |
| `justify-content` | flex-start, flex-end, center, space-between, space-around, space-evenly | flex-start |
| `align-items` | stretch, flex-start, flex-end, center, baseline | stretch |
| `align-content` | flex-start, flex-end, center, space-between, space-around, stretch | stretch |
| `gap` | valor / row-gap column-gap | 0 |

**Propriedades dos Itens**

| Propriedade | Valores principais | Padrão |
| --- | --- | --- |
| `flex-grow` | número (proporção) | 0 |
| `flex-shrink` | número (proporção) | 1 |
| `flex-basis` | auto, tamanho, % | auto |
| `flex` | grow shrink basis (shorthand) | 0 1 auto |
| `align-self` | auto, flex-start, flex-end, center, stretch, baseline | auto |
| `order` | número inteiro | 0 |

[Ver exemplos interativos de Flexbox →](/cssFundamentos/css-exemplos-flexbox)

## 5. Exercícios

1. **Box Model**: Crie um `<div>` com `width: 300px`, `padding: 20px`, `border: 3px solid red` e `margin: 40px`. Compare o tamanho final usando `box-sizing: content-box` versus `border-box`. Use as DevTools do browser (F12) para inspecionar.
2. **Posicionamento**: Crie um card com imagem e um badge "NOVO" no canto superior direito. Use `position: relative` no card e `position: absolute` no badge.
3. **Display**: Transforme uma lista `<ul>` horizontal usando `display: inline` nos `<li>`. Depois mude para `inline-block` e adicione `padding` e `width`. Observe a diferença.
4. **Flexbox: Navbar**: Crie uma barra de navegação com logo à esquerda, links no centro e um botão "Login" à direita usando apenas Flexbox.
5. **Flexbox: Layout completo**: Monte um layout de página completo com: header, navbar horizontal, área principal (sidebar + conteúdo), e footer. Use **somente Flexbox** para o posicionamento.
6. **Flexbox: Grid de cards responsivo**: Crie 6 cards com `flex: 1 1 200px` e `flex-wrap: wrap`. Observe como eles se reorganizam ao redimensionar a janela.

<style scoped src="./shared.css"></style>
<style scoped src="./css-fundamentos.css"></style>
