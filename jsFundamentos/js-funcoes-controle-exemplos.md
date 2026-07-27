---
title: "Exemplos: Funções, Condicionais e Loops"
---

<script setup>
import { ref, computed } from 'vue'

// ---- Function playground ----
const fnA = ref(4)
const fnB = ref(7)
const fnOp = ref('soma')
const opSymbols = { soma: '+', subtracao: '-', multiplicacao: '*' }
const fnResult = computed(() => {
  const a = Number(fnA.value)
  const b = Number(fnB.value)
  if (fnOp.value === 'soma') return a + b
  if (fnOp.value === 'subtracao') return a - b
  return a * b
})

// ---- Condicionais ao vivo ----
const idade = ref(16)
const branch = computed(() => {
  if (idade.value >= 18) return 'maior'
  if (idade.value >= 12) return 'adolescente'
  return 'crianca'
})

// ---- Loop visualizer ----
const loopStart = ref(0)
const loopEnd = ref(5)
const loopStep = ref(1)
const iterations = computed(() => {
  const out = []
  const step = Number(loopStep.value) || 1
  let i = Number(loopStart.value)
  const end = Number(loopEnd.value)
  let guard = 0
  while (i < end && guard < 40) {
    out.push(i)
    i += step
    guard++
  }
  return out
})

// ---- Array method playground ----
const arrayInput = ref('1, 2, 3, 4, 5, 6')
const method = ref('map')
const parsedArray = computed(() =>
  arrayInput.value.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
)
const arrayResult = computed(() => {
  const arr = parsedArray.value
  if (method.value === 'map') return arr.map(n => n * 2)
  if (method.value === 'filter') return arr.filter(n => n % 2 === 0)
  if (method.value === 'reduce') return arr.reduce((acc, n) => acc + n, 0)
  return arr
})
const arrayCode = computed(() => {
  if (method.value === 'map') return `[${parsedArray.value.join(', ')}].map(n => n * 2)`
  if (method.value === 'filter') return `[${parsedArray.value.join(', ')}].filter(n => n % 2 === 0)`
  return `[${parsedArray.value.join(', ')}].reduce((acc, n) => acc + n, 0)`
})
const arrayResultDisplay = computed(() => Array.isArray(arrayResult.value) ? `[${arrayResult.value.join(', ')}]` : String(arrayResult.value))
</script>

# Exemplos: Funções, Condicionais e Loops

[← Voltar para a aula](/jsFundamentos/js-funcoes-controle)

## Função ao vivo {#funcoes}

Escolha os operandos e a operação: o resultado é calculado por uma arrow function:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>a</label>
      <input type="number" v-model="fnA" />
    </div>
    <div class="ctrl-group">
      <label>operação</label>
      <select v-model="fnOp">
        <option value="soma">soma</option>
        <option value="subtracao">subtração</option>
        <option value="multiplicacao">multiplicação</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>b</label>
      <input type="number" v-model="fnB" />
    </div>
  </div>

  <pre class="code-output"><code><span class="prop">const</span> calcular = (a, b) => a <span class="prop">{{ opSymbols[fnOp] }}</span> b<span class="punc">;</span>
calcular(<span class="val">{{ fnA }}</span>, <span class="val">{{ fnB }}</span>) <span class="punc">// →</span> <span class="val">{{ fnResult }}</span></code></pre>
</div>

## Condicional ao vivo {#condicionais}

Mova o controle de idade e veja qual ramo do `if/else if/else` seria executado:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>idade: {{ idade }}</label>
      <input type="range" min="0" max="80" v-model="idade" />
    </div>
  </div>

  <pre class="code-output"><code><span class="prop">if</span> (idade &gt;= 18) <span class="punc">{</span>
  <span :class="{ active: branch === 'maior' }" class="branch-line">'maior de idade'</span>
<span class="punc">} else if</span> (idade &gt;= 12) <span class="punc">{</span>
  <span :class="{ active: branch === 'adolescente' }" class="branch-line">'adolescente'</span>
<span class="punc">} else {</span>
  <span :class="{ active: branch === 'crianca' }" class="branch-line">'criança'</span>
<span class="punc">}</span></code></pre>
</div>

## Loop ao vivo {#loops}

Configure início, fim e passo, e veja exatamente quais valores o `for` percorreria:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>início</label>
      <input type="number" v-model="loopStart" />
    </div>
    <div class="ctrl-group">
      <label>fim (exclusivo)</label>
      <input type="number" v-model="loopEnd" />
    </div>
    <div class="ctrl-group">
      <label>passo</label>
      <input type="number" v-model="loopStep" min="1" />
    </div>
  </div>

  <pre class="code-output"><code><span class="prop">for</span> (<span class="val">let i = {{ loopStart }}</span>; <span class="val">i &lt; {{ loopEnd }}</span>; <span class="val">i += {{ loopStep }}</span>) {
  console.log(i);
}</code></pre>

  <div class="iteration-chips">
    <span v-for="(n, idx) in iterations" :key="idx" class="chip">{{ n }}</span>
    <span v-if="iterations.length === 0" class="chip chip-empty">(nenhuma iteração)</span>
  </div>
</div>

## Métodos de array ao vivo {#arrays}

Digite números separados por vírgula e escolha um método para transformar o array:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>array (separado por vírgula)</label>
      <input type="text" v-model="arrayInput" />
    </div>
    <div class="ctrl-group">
      <label>método</label>
      <select v-model="method">
        <option value="map">map (dobrar)</option>
        <option value="filter">filter (só pares)</option>
        <option value="reduce">reduce (somar tudo)</option>
      </select>
    </div>
  </div>

  <pre class="code-output"><code><span class="prop">{{ arrayCode }}</span>
<span class="punc">// →</span> <span class="val">{{ arrayResultDisplay }}</span></code></pre>
</div>

<style scoped src="./shared.css"></style>
<style scoped src="./js-funcoes-controle-exemplos.css"></style>
