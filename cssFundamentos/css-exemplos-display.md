---
title: "Exemplos: Display CSS"
---

<script setup>
import { ref } from 'vue'

const visible = ref(true)
</script>

# Exemplos: Display CSS

[← Voltar para a aula](/cssFundamentos/css-fundamentos#display)

## display: block

Elementos block ocupam **toda a largura disponível** e sempre começam em uma nova linha. Você pode definir `width`, `height`, `margin` e `padding` em todas as direções.

<div class="demo-area">
  <div class="ex-block">Elemento block: ocupa tudo</div>
  <div class="ex-block">Outro elemento block</div>
  <div class="ex-block" style="width:50%">width: 50%</div>
</div>

```css
div { display: block; } /* padrão para div, p, h1-h6 … */
```

## display: inline

Elementos inline ficam **na mesma linha** que o conteúdo ao redor. Eles só ocupam o espaço do conteúdo. **Não aceitam** `width` e `height`. As margens verticais são ignoradas.

<div class="demo-area">
  Texto comum
  <span class="ex-inline">inline A</span>
  mais texto
  <span class="ex-inline">inline B</span>
  e mais texto
  <span class="ex-inline">inline C</span>
</div>

**width e height são ignorados em elementos inline:**

<div class="demo-area">
  <span class="ex-inline-tentativa">width:200px e height:60px não funcionam aqui (inline)</span>
</div>

```css
span { display: inline; } /* padrão para span, a, strong … */

/* width e height são ignorados! */
span { width: 200px; height: 60px; } /* sem efeito */
```

## display: inline-block

Comporta-se como `inline` no fluxo (fica na mesma linha), mas aceita `width`, `height`, `padding` e `margin` verticais como um elemento block.

<div class="demo-area">
  <span class="ex-ib">inline-block</span>
  <span class="ex-ib">inline-block</span>
  <span class="ex-ib sized">inline-block<br><small>width:160 height:70</small></span>
  <span class="ex-ib">inline-block</span>
</div>

```css
.botao {
  display: inline-block;
  width: 160px;      /* agora funciona! */
  height: 40px;
  padding: 8px 16px;
  text-align: center;
}
```

## display: none × visibility: hidden

Ambos ocultam o elemento, mas de formas diferentes:

- `display: none`: remove o elemento do fluxo; não ocupa espaço.
- `visibility: hidden`: oculta visualmente, mas **mantém o espaço** no layout.

<div class="none-demo">
  <div class="vis-box">Visível</div>
  <div class="vis-box hidden-none">display: none (sumiu!)</div>
  <div class="vis-box vis-box-muted">Após none</div>
</div>
<div class="none-demo">
  <div class="vis-box">Visível</div>
  <div class="vis-box hidden-vis">visibility: hidden (espaço mantido)</div>
  <div class="vis-box vis-box-muted">Após hidden</div>
</div>

```css
.oculto-none { display: none; }      /* sem espaço no layout */
.oculto-vis  { visibility: hidden; } /* espaço mantido */
```

## Caso prático: lista de navegação

Transformando o `<ul>` de block → inline → inline-block:

**block (padrão)**

<ul class="nav-block">
  <li>Home</li><li>Sobre</li><li>Portfólio</li><li>Contato</li>
</ul>

**inline**

<ul class="nav-inline">
  <li>Home</li><li>Sobre</li><li>Portfólio</li><li>Contato</li>
</ul>

**inline-block** (com hover, padding vertical)

<ul class="nav-ib">
  <li>Home</li><li>Sobre</li><li>Portfólio</li><li>Contato</li>
</ul>

## Botões: block vs inline-block

**block**: ocupa toda a largura

<a href="#" class="btn-block" onclick="return false">Botão block</a>

**inline-block**: lado a lado

<a href="#" class="btn-ib" onclick="return false">Salvar</a>
<a href="#" class="btn-ib" style="background:#6abf6a" onclick="return false">Publicar</a>
<a href="#" class="btn-ib" style="background:#e07070" onclick="return false">Cancelar</a>

## Interativo: mostrar / ocultar com display: none

<div class="toggle-wrap">
  <button class="toggle-btn" @click="visible = !visible">{{ visible ? 'Ocultar elemento' : 'Mostrar elemento' }}</button>
  <div v-if="visible" class="toggle-target">
    Este elemento está visível. Clique no botão para ocultar com display: none!
  </div>
</div>

## Outros valores de display

<div class="other-values">
  <div class="ov-card" style="--clr:#eef2ff"><strong>flex</strong>Ativa o Flexbox. Filhos se tornam flex items.</div>
  <div class="ov-card" style="--clr:#f0fff4"><strong>grid</strong>Ativa o Grid Layout. Filhos se tornam grid items.</div>
  <div class="ov-card" style="--clr:#fff0f0"><strong>inline-flex</strong>Como flex, mas o container é inline.</div>
  <div class="ov-card" style="--clr:#fff8e7"><strong>table</strong>Simula comportamento de tabela HTML.</div>
  <div class="ov-card" style="--clr:#f5eeff"><strong>contents</strong>O container desaparece; filhos sobem para o pai.</div>
</div>

::: tip Resumo rápido
`block` → nova linha, aceita tudo.<br>
`inline` → na linha, não aceita width/height.<br>
`inline-block` → na linha + aceita width/height.<br>
`none` → invisível e sem espaço.<br>
`flex` / `grid` → modelos de layout modernos.
:::

<style scoped src="./shared.css"></style>
<style scoped src="./css-exemplos-display.css"></style>
