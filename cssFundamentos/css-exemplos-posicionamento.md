---
title: "Exemplos: Posicionamento CSS"
---

<script setup>
import { ref } from 'vue'

const z1 = ref(1)
const z2 = ref(2)
const z3 = ref(3)
</script>

# Exemplos: Posicionamento CSS

[← Voltar para a aula](/cssFundamentos/css-fundamentos#posicionamento)

## position: fixed

Um elemento com `position: fixed` gruda em um ponto e não se move ao rolar. Para demonstrar isso com segurança dentro do artigo (sem grudar na janela inteira do navegador), o quadro abaixo usa `transform` no contêiner. Isso cria um novo *containing block*, então o `fixed` gruda ao contêiner em vez da viewport. Role o conteúdo interno:

<div class="fixed-demo-wrap">
  <div class="fixed-demo-navbar">
    <span class="fixed-demo-logo">WebLab</span>
    <span>position: fixed</span>
    <span class="fixed-demo-tag">↑ esta barra não rola</span>
  </div>
  <div class="fixed-demo-scroll">
    <p>Role esta área para baixo. A barra acima permanece fixa no topo do quadro.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <p>Fim do conteúdo de exemplo.</p>
  </div>
</div>

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100; /* fica sobre o conteúdo */
}
```

## position: static (padrão)

Todos os elementos HTML são `static` por padrão. Eles seguem o fluxo normal do documento. As propriedades `top`, `left`, etc. não têm efeito.

<div class="static-demo">
  <div class="bl">Bloco 1</div>
  <div class="bl">Bloco 2</div>
  <div class="bl">Bloco 3</div>
</div>

## position: relative

O elemento é deslocado **em relação à sua posição original**. Ele continua ocupando o espaço original no fluxo (note o "buraco" abaixo do item amarelo).

<div class="relative-demo">
  <div class="bl">Bloco 1</div>
  <div class="rel">relative<br><small>top:20 left:15</small></div>
  <div class="bl">Bloco 3</div>
</div>

```css
.rel {
  position: relative;
  top: 20px;
  left: 15px; /* desloca, mas ocupa o espaço original */
}
```

## position: absolute

O elemento é **removido do fluxo** e posicionado em relação ao **ancestral posicionado mais próximo** (aquele com position ≠ static). Se não houver nenhum, usa o viewport.

<div class="absolute-demo">
  <div class="normal">elemento normal (static)</div>
  <div class="abs">absolute<br>top:8 right:8</div>
  <div class="abs-bottom">absolute: bottom:8, centrado</div>
</div>

```css
.container {
  position: relative; /* cria o contexto de posicionamento */
}

.abs {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

## Caso prático: card com badge

Um uso clássico de `absolute` dentro de um container `relative`.

<div class="card-wrap">
  <div class="product-card">
    <span class="badge-novo">NOVO</span>
    <div class="img-placeholder"></div>
    <h4>Produto Alpha</h4>
    <p>R$ 199,00</p>
  </div>
  <div class="product-card">
    <span class="badge-off">-30%</span>
    <div class="img-placeholder"></div>
    <h4>Produto Beta</h4>
    <p><s class="preco-riscado">R$ 299,00</s> R$ 209,00</p>
  </div>
</div>

```css
.card { position: relative; } /* cria contexto */

.badge {
  position: absolute;
  top: 10px;
  right: 10px;
}
```

## position: sticky

O elemento comporta-se como `relative` até atingir o limiar de scroll definido; então gruda como se fosse `fixed`. Role a caixa abaixo:

<div class="sticky-demo-wrap">
  <div class="sticky-section">
    <div class="sticky-header">Seção A: gruda ao rolar ↓</div>
    <div class="sticky-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </div>
  </div>
  <div class="sticky-section">
    <div class="sticky-header">Seção B: gruda ao rolar ↓</div>
    <div class="sticky-content">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
    </div>
  </div>
  <div class="sticky-section">
    <div class="sticky-header">Seção C: gruda ao rolar ↓</div>
    <div class="sticky-content">
      Sunt in culpa qui officia deserunt mollit anim id est laborum.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Nulla ullamcorper, ante id commodo luctus, ante leo maximus leo, non viverra quam ligula quis eros.
    </div>
  </div>
</div>

```css
.section-header {
  position: sticky;
  top: 0;         /* gruda quando chegar a 0px do topo */
  background: #fff;
  z-index: 1;
}
```

## z-index: ordem de empilhamento

Quando elementos se sobrepõem, o `z-index` determina qual fica na frente. Valores maiores aparecem sobre os menores.

<div class="zindex-demo">
  <div class="z-box z1" :style="{ zIndex: z1 }">z-index: {{ z1 }}</div>
  <div class="z-box z2" :style="{ zIndex: z2 }">z-index: {{ z2 }}</div>
  <div class="z-box z3" :style="{ zIndex: z3 }">z-index: {{ z3 }}</div>
</div>

<div class="interactive-z">
  <p>Altere o z-index de cada caixa interativamente:</p>
  <label>Caixa Azul (z-index: {{ z1 }})
    <input type="range" min="-1" max="5" v-model.number="z1" />
  </label>
  <label>Caixa Amarela (z-index: {{ z2 }})
    <input type="range" min="-1" max="5" v-model.number="z2" />
  </label>
  <label>Caixa Vermelha (z-index: {{ z3 }})
    <input type="range" min="-1" max="5" v-model.number="z3" />
  </label>
</div>

::: tip Lembre-se
`z-index` só funciona em elementos com `position` diferente de `static` (`relative`, `absolute`, `fixed` ou `sticky`).
:::

<style scoped src="./shared.css"></style>
<style scoped src="./css-exemplos-posicionamento.css"></style>
