---
title: "Exemplos: Box Model"
---

<script setup>
import { ref, computed } from 'vue'

const padding = ref(20)
const contentBoxWidth = computed(() => 280 + padding.value * 2)
</script>

# Exemplos: Box Model

[← Voltar para a aula](/cssFundamentos/css-fundamentos#box-model)

## 1. Anatomia da caixa

Cada elemento HTML é uma caixa com quatro camadas. Observe as cores abaixo:

<div class="legenda">
  <span class="leg-item"><span class="leg-color" style="background:#fde68a"></span>margin</span>
  <span class="leg-item"><span class="leg-color" style="background:#f59e0b"></span>border</span>
  <span class="leg-item"><span class="leg-color" style="background:#bbf7d0"></span>padding</span>
  <span class="leg-item"><span class="leg-color" style="background:#93c5fd"></span>content</span>
</div>

<div class="demo-anatomia">
  <div class="borda">
    <div class="padding-area">
      <div class="conteudo">Sou o conteúdo!</div>
    </div>
  </div>
</div>

## 2. content-box × border-box

Ambas as caixas têm `width: 200px`, `padding: 20px` e `border: 6px`. Veja como o tamanho final difere:

<div class="comparacao">
  <div class="cb-box">
    <strong>content-box (padrão)</strong><br>
    width: 200px<br>
    padding: 20px (cada lado)<br>
    border: 6px (cada lado)<br>
    ─────────────────────<br>
    Largura total: <strong>252px</strong><br>
    <code>200 + 40 + 12 = 252</code>
  </div>
  <div class="bb-box">
    <strong>border-box</strong><br>
    width: 200px<br>
    padding: 20px (já incluído)<br>
    border: 6px (já incluído)<br>
    ─────────────────────<br>
    Largura total: <strong>200px</strong><br>
    <code>width inclui tudo!</code>
  </div>
</div>

::: tip Por que usar border-box?
Se você define `width: 50%` em dois elementos que dividem uma linha, com `content-box` eles vão ultrapassar os 100% assim que você adicionar qualquer padding ou border. Com `border-box` os 50% sempre serão respeitados.
:::

## 3. Colapso de margens (*margin collapse*)

Quando duas margens verticais se encontram, o CSS utiliza a **maior** delas, não a soma. O espaço entre os blocos abaixo é 30px (não 50px).

<div class="collapse-demo">
  <div class="bloco-a">Bloco A: margin-bottom: 30px</div>
  <div class="bloco-b">Bloco B: margin-top: 20px</div>
</div>

::: tip
Colapso acontece apenas em margens **verticais** entre elementos de *block*. Não ocorre com elementos flex/grid, nem em elementos com padding, border ou overflow diferente de visible.
:::

## 4. Shorthand de padding e margin

O shorthand segue a ordem **topo → direita → baixo → esquerda** (sentido horário). Valores omitidos espelham o oposto.

<div class="shorthand-grid">
  <div><code>padding: 32px</code><div class="sh-box p1">1 valor: todos os lados</div></div>
  <div><code>padding: 32px 8px</code><div class="sh-box p2">2 valores: vertical | horizontal</div></div>
  <div><code>padding: 32px 8px 4px</code><div class="sh-box p3">3 valores: top | horiz | bottom</div></div>
  <div><code>padding: 32px 8px 4px 24px</code><div class="sh-box p4">4 valores: ↑ → ↓ ←</div></div>
</div>

## 5. Controle interativo de padding

Ajuste o slider para ver como o padding afeta o tamanho da caixa em tempo real. A caixa abaixo usa `box-sizing: border-box`, então sua largura total **permanece fixa em 280px**: é o espaço de conteúdo interno que muda.

<div class="inspector-wrap">
  <div class="ex-box" :style="{ padding: padding + 'px' }">
    <div class="ex-box-fill"></div>
  </div>
  <label>padding: {{ padding }}px
    <input type="range" min="0" max="60" v-model.number="padding" />
  </label>
  <div class="size-readout">
    Largura no layout: 280px (border-box mantém o total fixo)<br>
    Se fosse content-box: 280 + 2×{{ padding }} = {{ contentBoxWidth }}px
  </div>
</div>

<style scoped src="./shared.css"></style>
<style scoped src="./css-exemplos-box-model.css"></style>
