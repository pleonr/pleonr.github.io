---
title: "Exemplos: Flexbox Interativo"
---

<script setup>
import { ref, computed } from 'vue'

const direction = ref('row')
const wrap = ref('nowrap')
const justify = ref('flex-start')
const align = ref('stretch')
const gap = ref('8px')
const itemCount = ref(4)

const colors = ['#4a6cf7','#6abf6a','#d6a84a','#e07070','#89dceb','#cba6f7','#f38ba8','#fab387','#a6e3a1','#89b4fa']

const items = computed(() => Array.from({ length: itemCount.value }, (_, i) => i + 1))

const canvasStyle = computed(() => ({
  flexDirection: direction.value,
  flexWrap: wrap.value,
  justifyContent: justify.value,
  alignItems: align.value,
  gap: gap.value,
  height: (direction.value === 'column' || direction.value === 'column-reverse') ? '300px' : '150px'
}))

const growA = ref(1)
const growB = ref(2)
const growC = ref(1)

const ordA = ref(0)
const ordB = ref(0)
const ordC = ref(0)
const ordD = ref(0)
</script>

# Exemplos Interativos: Flexbox

[← Voltar para a aula](/cssFundamentos/css-fundamentos#flexbox)

## Playground: Propriedades do Container

Altere as propriedades abaixo e observe o resultado em tempo real:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>flex-direction</label>
      <select v-model="direction">
        <option value="row">row</option>
        <option value="row-reverse">row-reverse</option>
        <option value="column">column</option>
        <option value="column-reverse">column-reverse</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>flex-wrap</label>
      <select v-model="wrap">
        <option value="nowrap">nowrap</option>
        <option value="wrap">wrap</option>
        <option value="wrap-reverse">wrap-reverse</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>justify-content</label>
      <select v-model="justify">
        <option value="flex-start">flex-start</option>
        <option value="flex-end">flex-end</option>
        <option value="center">center</option>
        <option value="space-between">space-between</option>
        <option value="space-around">space-around</option>
        <option value="space-evenly">space-evenly</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>align-items</label>
      <select v-model="align">
        <option value="stretch">stretch</option>
        <option value="flex-start">flex-start</option>
        <option value="flex-end">flex-end</option>
        <option value="center">center</option>
        <option value="baseline">baseline</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>gap</label>
      <select v-model="gap">
        <option value="0px">0px</option>
        <option value="8px">8px</option>
        <option value="16px">16px</option>
        <option value="24px">24px</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>N° de itens</label>
      <input type="number" min="1" max="10" v-model.number="itemCount" />
    </div>
  </div>

  <div class="flex-canvas" :style="canvasStyle">
    <div v-for="n in items" :key="n" class="flex-item" :style="{ background: colors[(n - 1) % colors.length] }">Item {{ n }}</div>
  </div>

  <pre class="code-output"><code><span class="punc">.container {</span>
  <span class="prop">display</span><span class="punc">:</span>          <span class="val">flex</span><span class="punc">;</span>
  <span class="prop">flex-direction</span><span class="punc">:</span>  <span class="val">{{ direction }}</span><span class="punc">;</span>
  <span class="prop">flex-wrap</span><span class="punc">:</span>       <span class="val">{{ wrap }}</span><span class="punc">;</span>
  <span class="prop">justify-content</span><span class="punc">:</span> <span class="val">{{ justify }}</span><span class="punc">;</span>
  <span class="prop">align-items</span><span class="punc">:</span>     <span class="val">{{ align }}</span><span class="punc">;</span>
  <span class="prop">gap</span><span class="punc">:</span>             <span class="val">{{ gap }}</span><span class="punc">;</span>
<span class="punc">}</span></code></pre>
</div>

## flex-grow interativo

Altere o `flex-grow` de cada item para ver como o espaço é distribuído:

<div class="grow-controls">
  <div class="grow-ctrl"><label>Item A (grow)</label><input type="number" min="0" max="5" v-model.number="growA" /></div>
  <div class="grow-ctrl"><label>Item B (grow)</label><input type="number" min="0" max="5" v-model.number="growB" /></div>
  <div class="grow-ctrl"><label>Item C (grow)</label><input type="number" min="0" max="5" v-model.number="growC" /></div>
</div>

<div class="grow-demo">
  <div class="grow-item" :style="{ flexGrow: growA }">A<br><small>grow:{{ growA }}</small></div>
  <div class="grow-item grow-item-b" :style="{ flexGrow: growB }">B<br><small>grow:{{ growB }}</small></div>
  <div class="grow-item" :style="{ flexGrow: growC }">C<br><small>grow:{{ growC }}</small></div>
</div>

## align-self: sobrescrevendo align-items por item

O container tem `align-items: center`. Cada item pode sobrescrever com `align-self`:

<div class="align-self-demo">
  <div class="as-item">center<br><small>(herda)</small></div>
  <div class="as-item start">flex-start<br><small>(align-self)</small></div>
  <div class="as-item">center<br><small>(herda)</small></div>
  <div class="as-item end">flex-end<br><small>(align-self)</small></div>
  <div class="as-item stretch">stretch<br><small>(align-self)</small></div>
</div>

```css
.container { display: flex; align-items: center; }

.start   { align-self: flex-start; }
.end     { align-self: flex-end; }
.stretch { align-self: stretch; }
```

## order: reordenação visual

Os itens aparecem na ordem do HTML, mas `order` altera a **ordem visual** sem mudar o markup:

<div class="ord-controls">
  <div class="ord-ctrl"><label>HTML 1 (order)</label><input type="number" min="-3" max="6" v-model.number="ordA" /></div>
  <div class="ord-ctrl"><label>HTML 2 (order)</label><input type="number" min="-3" max="6" v-model.number="ordB" /></div>
  <div class="ord-ctrl"><label>HTML 3 (order)</label><input type="number" min="-3" max="6" v-model.number="ordC" /></div>
  <div class="ord-ctrl"><label>HTML 4 (order)</label><input type="number" min="-3" max="6" v-model.number="ordD" /></div>
</div>

<div class="order-demo">
  <div class="ord-item" :style="{ order: ordA }">HTML: 1<br><small>order: {{ ordA }}</small></div>
  <div class="ord-item ord-item-b" :style="{ order: ordB }">HTML: 2<br><small>order: {{ ordB }}</small></div>
  <div class="ord-item ord-item-c" :style="{ order: ordC }">HTML: 3<br><small>order: {{ ordC }}</small></div>
  <div class="ord-item ord-item-d" :style="{ order: ordD }">HTML: 4<br><small>order: {{ ordD }}</small></div>
</div>

## Caso prático 1: Centralização perfeita

A técnica mais famosa do Flexbox: centralizar horizontal e verticalmente com apenas 3 linhas.

<div class="center-demo">
  <div class="box">
    Perfeitamente<br>centralizado
    <div class="center-demo-note">justify-content: center<br>align-items: center</div>
  </div>
</div>

```css
.container {
  display: flex;
  justify-content: center; /* eixo horizontal */
  align-items: center;     /* eixo vertical */
  height: 180px;
}
```

## Caso prático 2: Barra de navegação

Logo à esquerda, links no centro, botão à direita: layout clássico de navbar.

<nav class="ex-navbar">
  <span class="logo">MeuSite</span>
  <ul class="nav-links">
    <li><a href="#" onclick="return false">Home</a></li>
    <li><a href="#" onclick="return false">Sobre</a></li>
    <li><a href="#" onclick="return false">Blog</a></li>
  </ul>
  <a href="#" class="btn-login" onclick="return false">Login</a>
</nav>

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
}

.nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
}
```

## Caso prático 3: Layout completo com sidebar

Header, sidebar + conteúdo principal e footer: tudo com Flexbox.

<div class="ex-layout">
  <div class="header-bar">Header: display: flex + justify-content: center</div>
  <div class="main-area">
    <aside class="sidebar">
      <strong>Sidebar</strong>
      <ul>
        <li>Dashboard</li>
        <li>Artigos</li>
        <li>Usuários</li>
        <li>Config</li>
      </ul>
      <small class="sidebar-note">flex: 0 0 180px</small>
    </aside>
    <div class="content-area">
      <div class="article-card">
        <span>Artigo: Como usar Flexbox</span>
        <span class="status status-pub">Publicado</span>
      </div>
      <div class="article-card">
        <span>Artigo: CSS Grid na prática</span>
        <span class="status status-draft">Rascunho</span>
      </div>
      <div class="article-card">
        <span>Artigo: Box Model explicado</span>
        <span class="status status-pub">Publicado</span>
      </div>
      <small class="content-note">flex: 1: ocupa o espaço restante</small>
    </div>
  </div>
  <div class="footer-bar">Footer: text-align: center</div>
</div>

```css
.page    { display: flex; flex-direction: column; gap: 8px; }
.main    { display: flex; gap: 8px; }
.sidebar { flex: 0 0 180px; } /* largura fixa */
.content { flex: 1; }         /* ocupa tudo que sobrar */
```

## Caso prático 4: Grid de cards responsivo

Com `flex: 1 1 200px` e `flex-wrap: wrap`, os cards se reorganizam automaticamente ao redimensionar a janela:

<div class="cards-grid">
  <div class="card"><div class="card-icon card-icon-1">🎨</div><h4>Design</h4><p>Crie interfaces bonitas e acessíveis</p></div>
  <div class="card"><div class="card-icon card-icon-2">💻</div><h4>Código</h4><p>HTML, CSS e JavaScript modernos</p></div>
  <div class="card"><div class="card-icon card-icon-3">🚀</div><h4>Deploy</h4><p>Publique seu site de forma rápida</p></div>
  <div class="card"><div class="card-icon card-icon-4">📱</div><h4>Responsivo</h4><p>Layouts que funcionam em qualquer tela</p></div>
  <div class="card"><div class="card-icon card-icon-5">⚡</div><h4>Performance</h4><p>Sites rápidos e otimizados</p></div>
  <div class="card"><div class="card-icon card-icon-6">🔒</div><h4>Segurança</h4><p>Boas práticas de segurança web</p></div>
</div>

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 200px; /* base 200px, cresce e encolhe */
}
```

<style scoped src="./shared.css"></style>
<style scoped src="./css-exemplos-flexbox.css"></style>
