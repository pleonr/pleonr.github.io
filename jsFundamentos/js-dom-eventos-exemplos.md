---
title: "Exemplos: DOM, Eventos e Assincronismo"
---

<script setup>
import { ref, computed } from 'vue'

// ---- Seletor de DOM explorável ----
const nodes = [
  { id: 'lista', tag: 'ul', elId: 'lista', classes: [] },
  { id: 'item1', tag: 'li', elId: 'primeiro', classes: ['item'] },
  { id: 'item2', tag: 'li', elId: null, classes: ['item'] },
  { id: 'item3', tag: 'li', elId: null, classes: ['item', 'destaque'] },
  { id: 'item4', tag: 'li', elId: null, classes: ['item'] }
]
const selector = ref('.item')
const selectorMethod = ref('querySelectorAll')
function matches(node, sel) {
  if (sel.startsWith('#')) return node.elId === sel.slice(1)
  if (sel.startsWith('.')) return node.classes.includes(sel.slice(1))
  return node.tag === sel
}
const matched = computed(() => nodes.filter(n => matches(n, selector.value)))
const activeMatched = computed(() =>
  selectorMethod.value === 'querySelector' ? matched.value.slice(0, 1) : matched.value
)
function nodeLabel(n) {
  let s = `<${n.tag}`
  if (n.elId) s += ` id="${n.elId}"`
  if (n.classes.length) s += ` class="${n.classes.join(' ')}"`
  return s + '>'
}

// ---- Renderizar lista a partir de dados (createElement/appendChild) ----
const novoItem = ref('')
const itensLista = ref(['maçã', 'banana', 'uva'])
function adicionarItem() {
  const texto = novoItem.value.trim()
  if (!texto) return
  itensLista.value.push(texto)
  novoItem.value = ''
}
function removerItem(idx) {
  itensLista.value.splice(idx, 1)
}

// ---- insertAdjacentHTML: posições ----
let insertCounter = 0
const insertSlots = ref({ beforebegin: [], afterbegin: [], beforeend: [], afterend: [] })
function inserir(posicao) {
  insertCounter++
  insertSlots.value[posicao].push(`#${insertCounter}`)
}
function limparInsercoes() {
  insertSlots.value = { beforebegin: [], afterbegin: [], beforeend: [], afterend: [] }
}

// ---- classList vs style ao vivo ----
const temDestaque = ref(false)
const corFundo = ref('#6366f1')
const corTexto = ref('#ffffff')

// ---- Variável CSS compartilhada ----
const corVariavel = ref('#f97316')

// ---- Alternador de tema (dark mode) ----
const temaEscuro = ref(false)

// ---- Eventos: contador de cliques + toggle de classe ----
const clickLog = ref([])
let clickCount = 0
function registrarClique(tipo) {
  clickCount++
  const hora = new Date().toLocaleTimeString()
  clickLog.value.unshift({ n: clickCount, tipo, hora })
  if (clickLog.value.length > 6) clickLog.value.pop()
}
const ativo = ref(false)

// ---- preventDefault demo ----
const usarPreventDefault = ref(true)
const formLog = ref('')
function enviarForm() {
  formLog.value = usarPreventDefault.value
    ? 'submit interceptado: event.preventDefault() chamado, página NÃO recarregou.'
    : '⚠️ sem preventDefault(), a página tentaria recarregar agora.'
}

// ---- Ordem de execução assíncrona (real) ----
const asyncLog = ref([])
let running = false
async function rodarOrdem() {
  if (running) return
  running = true
  asyncLog.value = []
  const push = (msg) => asyncLog.value.push(msg)

  push('1: síncrono (console.log direto)')
  setTimeout(() => { push('4: setTimeout (fila de tarefas / macrotask)') }, 0)
  Promise.resolve().then(() => { push('3: Promise.then (fila de microtasks)') })
  push('2: síncrono (console.log direto)')

  await new Promise(r => setTimeout(r, 50))
  running = false
}
</script>

# Exemplos: DOM, Eventos e Assincronismo

[← Voltar para a aula](/jsFundamentos/js-dom-eventos)

## Seletores ao vivo {#selecao}

Escolha um seletor e o método: veja quais elementos da lista seriam retornados:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>método</label>
      <select v-model="selectorMethod">
        <option value="querySelector">querySelector (1º só)</option>
        <option value="querySelectorAll">querySelectorAll (todos)</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>seletor</label>
      <select v-model="selector">
        <option value="#primeiro">#primeiro</option>
        <option value=".item">.item</option>
        <option value=".destaque">.destaque</option>
        <option value="li">li</option>
        <option value="ul">ul</option>
      </select>
    </div>
  </div>

  <pre class="code-output"><code><span class="prop">document</span>.<span class="prop">{{ selectorMethod }}</span>(<span class="val">'{{ selector }}'</span>)</code></pre>

  <div class="dom-list">
    <div
      v-for="n in nodes"
      :key="n.id"
      class="dom-node"
      :class="{ matched: activeMatched.includes(n) }"
    >{{ nodeLabel(n) }}</div>
  </div>
  <p class="link-note">{{ activeMatched.length }} elemento(s) retornado(s).</p>
</div>

## Manipulação de HTML ao vivo {#manipulacao-html}

### Renderizar uma lista a partir de dados

Digite um item e clique em "Adicionar": isso simula o padrão `createElement` + `textContent` + `appendChild` visto na aula:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>novo item</label>
      <input type="text" v-model="novoItem" placeholder="ex: morango" @keyup.enter="adicionarItem" />
    </div>
  </div>
  <button class="demo-btn" @click="adicionarItem">+ Adicionar</button>

  <pre class="code-output"><code><span class="punc">lista.innerHTML = '';</span>
frutas.forEach((fruta) => {
  <span class="prop">const</span> li = document.createElement('li');
  li.textContent = fruta;
  lista.appendChild(li);
});</code></pre>

  <ul class="demo-ul">
    <li v-for="(item, idx) in itensLista" :key="idx">
      {{ item }}
      <button class="remove-btn" @click="removerItem(idx)">×</button>
    </li>
  </ul>
  <p v-if="itensLista.length === 0" class="link-note">Lista vazia. Adicione um item acima.</p>
</div>

### `insertAdjacentHTML`: escolha a posição

Clique nos botões para inserir um item em cada posição possível e veja onde ele aparece em relação ao conteúdo existente:

<div class="playground">
  <div class="insert-demo">
    <div class="insert-row">
      <span v-for="chip in insertSlots.beforebegin" :key="chip" class="chip">{{ chip }}</span>
      <span v-if="insertSlots.beforebegin.length === 0" class="insert-hint">beforebegin</span>
    </div>
    <div class="insert-box">
      <div class="insert-row">
        <span v-for="chip in insertSlots.afterbegin" :key="chip" class="chip">{{ chip }}</span>
        <span v-if="insertSlots.afterbegin.length === 0" class="insert-hint">afterbegin</span>
      </div>
      <div class="insert-existing">conteúdo existente</div>
      <div class="insert-row">
        <span v-for="chip in insertSlots.beforeend" :key="chip" class="chip">{{ chip }}</span>
        <span v-if="insertSlots.beforeend.length === 0" class="insert-hint">beforeend</span>
      </div>
    </div>
    <div class="insert-row">
      <span v-for="chip in insertSlots.afterend" :key="chip" class="chip">{{ chip }}</span>
      <span v-if="insertSlots.afterend.length === 0" class="insert-hint">afterend</span>
    </div>
  </div>
  <div class="insert-buttons">
    <button class="demo-btn small" @click="inserir('beforebegin')">beforebegin</button>
    <button class="demo-btn small" @click="inserir('afterbegin')">afterbegin</button>
    <button class="demo-btn small" @click="inserir('beforeend')">beforeend</button>
    <button class="demo-btn small" @click="inserir('afterend')">afterend</button>
    <button class="demo-btn small ghost" @click="limparInsercoes">limpar</button>
  </div>
</div>

## Manipulação de CSS ao vivo {#manipulacao-css}

### `classList` × `style`

Alterne a classe `destaque` ou defina cores diretamente via `style`; repare como o código muda junto:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group ctrl-group-checkbox">
      <label><input type="checkbox" v-model="temDestaque" /> classList.toggle('destaque')</label>
    </div>
    <div class="ctrl-group">
      <label>style.backgroundColor</label>
      <input type="color" v-model="corFundo" />
    </div>
    <div class="ctrl-group">
      <label>style.color</label>
      <input type="color" v-model="corTexto" />
    </div>
  </div>

  <div class="css-demo-box" :class="{ destaque: temDestaque }" :style="{ backgroundColor: corFundo, color: corTexto }">
    caixa.style.backgroundColor / caixa.classList
  </div>

  <pre class="code-output"><code>caixa.classList.toggle('destaque'); <span class="punc">// → {{ temDestaque }}</span>
caixa.style.backgroundColor = <span class="val">'{{ corFundo }}'</span>;
caixa.style.color = <span class="val">'{{ corTexto }}'</span>;</code></pre>
</div>

### Variável CSS compartilhada

Uma única variável aplicada a **vários** elementos ao mesmo tempo; mude a cor e observe todos atualizarem juntos:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>--cor-destaque</label>
      <input type="color" v-model="corVariavel" />
    </div>
  </div>

  <pre class="code-output"><code>document.documentElement.style.setProperty(<span class="val">'--cor-destaque'</span>, <span class="val">'{{ corVariavel }}'</span>);</code></pre>

  <div class="var-demo-row">
    <button class="var-demo-el" :style="{ background: corVariavel }">Botão</button>
    <span class="var-demo-el badge" :style="{ borderColor: corVariavel, color: corVariavel }">Badge</span>
    <div class="var-demo-el bar" :style="{ background: corVariavel }"></div>
  </div>
</div>

### Alternador de tema (dark mode)

Combina `classList.toggle` com variáveis CSS, o mesmo padrão usado em sites reais:

<div class="playground">
  <button class="demo-btn" @click="temaEscuro = !temaEscuro">
    {{ temaEscuro ? '☀️ Tema claro' : '🌙 Tema escuro' }}
  </button>

  <pre class="code-output"><code>document.documentElement.classList.toggle('dark'); <span class="punc">// → {{ temaEscuro }}</span></code></pre>

  <div class="theme-demo" :class="{ dark: temaEscuro }">
    <strong>Prévia do tema</strong>
    <p>--bg: {{ temaEscuro ? '#1e1e2e' : '#ffffff' }} · --texto: {{ temaEscuro ? '#ffffff' : '#111111' }}</p>
  </div>
</div>

## Eventos ao vivo {#eventos}

Clique de verdade nos elementos abaixo; os eventos são reais (`@click` do Vue por baixo é a mesma API de `addEventListener`):

<div class="playground">
  <div class="event-demo">
    <button class="demo-btn" @click="registrarClique('click')">Clique aqui</button>
    <div class="toggle-box" :class="{ ativo }" @click="ativo = !ativo; registrarClique('toggle')">
      classList.toggle('ativo') → {{ ativo ? 'ativo' : 'inativo' }}
    </div>
  </div>
  <div class="event-log">
    <p v-if="clickLog.length === 0" class="link-note">Nenhum evento ainda. Clique em algo acima.</p>
    <div v-for="e in clickLog" :key="e.n" class="event-row">
      <span class="event-n">#{{ e.n }}</span> <span class="prop">{{ e.tipo }}</span> disparado às <span class="val">{{ e.hora }}</span>
    </div>
  </div>
</div>

## preventDefault ao vivo {#preventdefault}

<div class="playground">
  <div class="controls">
    <div class="ctrl-group ctrl-group-checkbox">
      <label><input type="checkbox" v-model="usarPreventDefault" /> chamar event.preventDefault()</label>
    </div>
  </div>
  <form class="demo-form" @submit.prevent="enviarForm">
    <input type="text" placeholder="digite algo..." />
    <button type="submit">Enviar</button>
  </form>
  <p v-if="formLog" class="link-note">{{ formLog }}</p>
</div>

## Ordem de execução assíncrona {#async}

Clique em "Rodar" e observe a ordem real em que as linhas aparecem, síncrono primeiro, depois microtasks (`Promise`), depois macrotasks (`setTimeout`):

<div class="playground">
  <button class="demo-btn" @click="rodarOrdem">▶ Rodar</button>
  <pre class="code-output"><code><span class="punc">console.log('1')</span><br/><span class="punc">setTimeout(() => console.log('4'), 0)</span><br/><span class="punc">Promise.resolve().then(() => console.log('3'))</span><br/><span class="punc">console.log('2')</span></code></pre>
  <div class="async-output">
    <div v-if="asyncLog.length === 0" class="link-note">(aguardando execução)</div>
    <div v-for="(line, idx) in asyncLog" :key="idx" class="async-line">{{ line }}</div>
  </div>
</div>

<style scoped src="./shared.css"></style>
<style scoped src="./js-dom-eventos-exemplos.css"></style>
