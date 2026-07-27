---
title: "Exemplos: Propriedades CSS"
---

<script setup>
import { ref, computed } from 'vue'

// ---- Tipografia ----
const fontSize = ref(18)
const lineHeight = ref(1.6)
const letterSpacing = ref(0)
const fontWeight = ref('400')
const textAlign = ref('left')

// ---- Sombras / raio ----
const shadowX = ref(0)
const shadowY = ref(8)
const shadowBlur = ref(20)
const shadowSpread = ref(0)
const shadowColor = ref('rgba(74, 108, 247, 0.35)')
const radius = ref(12)
const inset = ref(false)

const shadowValue = computed(() =>
  `${inset.value ? 'inset ' : ''}${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowSpread.value}px ${shadowColor.value}`
)
const shadowCardStyle = computed(() => ({
  borderRadius: radius.value + 'px',
  boxShadow: shadowValue.value
}))

// ---- Transform + transition ----
const translateX = ref(40)
const translateY = ref(0)
const rotate = ref(15)
const scale = ref(1.1)
const duration = ref(0.4)
const timingFunction = ref('ease')
const applied = ref(false)

const transformValue = computed(() =>
  applied.value
    ? `translate(${translateX.value}px, ${translateY.value}px) rotate(${rotate.value}deg) scale(${scale.value})`
    : 'none'
)
const transformBoxStyle = computed(() => ({
  transform: transformValue.value,
  transition: `transform ${duration.value}s ${timingFunction.value}`
}))

// ---- nth-child ----
const nthFormula = ref('even')
const nthOptions = [
  { label: 'todos', value: 'all' },
  { label: 'even (pares)', value: 'even' },
  { label: 'odd (ímpares)', value: 'odd' },
  { label: '3n (a cada 3)', value: '3n' },
  { label: 'first-child', value: 'first' },
  { label: 'last-child', value: 'last' }
]
const rows = [1, 2, 3, 4, 5, 6]
function nthMatches(n, formula) {
  if (formula === 'all') return true
  if (formula === 'even') return n % 2 === 0
  if (formula === 'odd') return n % 2 === 1
  if (formula === '3n') return n % 3 === 0
  if (formula === 'first') return n === 1
  if (formula === 'last') return n === rows.length
  return false
}

// ---- Variáveis / tema ----
const themes = [
  { label: 'Azul', value: '#4a6cf7' },
  { label: 'Verde', value: '#2f9e44' },
  { label: 'Rosa', value: '#e64980' },
  { label: 'Laranja', value: '#e8590c' }
]
const brand = ref('#4a6cf7')
</script>

# Exemplos: Propriedades CSS

[← Voltar para a aula](/cssFundamentos/css-propriedades)

## Tipografia {#tipografia}

Ajuste as propriedades e veja o texto reagir em tempo real:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>font-size: {{ fontSize }}px</label>
      <input type="range" min="12" max="40" v-model.number="fontSize" />
    </div>
    <div class="ctrl-group">
      <label>line-height: {{ lineHeight }}</label>
      <input type="range" min="1" max="2.4" step="0.1" v-model.number="lineHeight" />
    </div>
    <div class="ctrl-group">
      <label>letter-spacing: {{ letterSpacing }}em</label>
      <input type="range" min="-0.05" max="0.3" step="0.01" v-model.number="letterSpacing" />
    </div>
    <div class="ctrl-group">
      <label>font-weight</label>
      <select v-model="fontWeight">
        <option value="300">300 (light)</option>
        <option value="400">400 (normal)</option>
        <option value="600">600 (semibold)</option>
        <option value="700">700 (bold)</option>
        <option value="900">900 (black)</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>text-align</label>
      <select v-model="textAlign">
        <option value="left">left</option>
        <option value="center">center</option>
        <option value="right">right</option>
        <option value="justify">justify</option>
      </select>
    </div>
  </div>

  <div class="type-preview" :style="{ fontSize: fontSize + 'px', lineHeight: lineHeight, letterSpacing: letterSpacing + 'em', fontWeight: fontWeight, textAlign: textAlign }">
    O rápido cão marrom salta sobre a lebre preguiçosa. Ajuste os controles acima para ver o efeito de cada propriedade tipográfica neste parágrafo de exemplo.
  </div>

  <pre class="code-output"><code><span class="prop">font-size</span><span class="punc">:</span> <span class="val">{{ fontSize }}px</span><span class="punc">;</span>
<span class="prop">line-height</span><span class="punc">:</span> <span class="val">{{ lineHeight }}</span><span class="punc">;</span>
<span class="prop">letter-spacing</span><span class="punc">:</span> <span class="val">{{ letterSpacing }}em</span><span class="punc">;</span>
<span class="prop">font-weight</span><span class="punc">:</span> <span class="val">{{ fontWeight }}</span><span class="punc">;</span>
<span class="prop">text-align</span><span class="punc">:</span> <span class="val">{{ textAlign }}</span><span class="punc">;</span></code></pre>
</div>

## Bordas, raio e sombra {#sombras}

Monte um `box-shadow` peça por peça:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>offset-x: {{ shadowX }}px</label>
      <input type="range" min="-30" max="30" v-model.number="shadowX" />
    </div>
    <div class="ctrl-group">
      <label>offset-y: {{ shadowY }}px</label>
      <input type="range" min="-30" max="30" v-model.number="shadowY" />
    </div>
    <div class="ctrl-group">
      <label>blur: {{ shadowBlur }}px</label>
      <input type="range" min="0" max="60" v-model.number="shadowBlur" />
    </div>
    <div class="ctrl-group">
      <label>spread: {{ shadowSpread }}px</label>
      <input type="range" min="-20" max="20" v-model.number="shadowSpread" />
    </div>
    <div class="ctrl-group">
      <label>border-radius: {{ radius }}px</label>
      <input type="range" min="0" max="60" v-model.number="radius" />
    </div>
    <div class="ctrl-group ctrl-group-checkbox">
      <label><input type="checkbox" v-model="inset" /> inset</label>
    </div>
  </div>

  <div class="shadow-preview-wrap">
    <div class="shadow-preview" :style="shadowCardStyle"></div>
  </div>

  <pre class="code-output"><code><span class="prop">border-radius</span><span class="punc">:</span> <span class="val">{{ radius }}px</span><span class="punc">;</span>
<span class="prop">box-shadow</span><span class="punc">:</span> <span class="val">{{ shadowValue }}</span><span class="punc">;</span></code></pre>
</div>

## Transform + transition {#transform}

Ajuste o transform alvo e a transição, depois clique no botão para animar:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>translateX: {{ translateX }}px</label>
      <input type="range" min="-80" max="80" v-model.number="translateX" />
    </div>
    <div class="ctrl-group">
      <label>translateY: {{ translateY }}px</label>
      <input type="range" min="-80" max="80" v-model.number="translateY" />
    </div>
    <div class="ctrl-group">
      <label>rotate: {{ rotate }}deg</label>
      <input type="range" min="-180" max="180" v-model.number="rotate" />
    </div>
    <div class="ctrl-group">
      <label>scale: {{ scale }}</label>
      <input type="range" min="0.5" max="2" step="0.05" v-model.number="scale" />
    </div>
    <div class="ctrl-group">
      <label>transition-duration: {{ duration }}s</label>
      <input type="range" min="0" max="2" step="0.1" v-model.number="duration" />
    </div>
    <div class="ctrl-group">
      <label>timing-function</label>
      <select v-model="timingFunction">
        <option value="linear">linear</option>
        <option value="ease">ease</option>
        <option value="ease-in">ease-in</option>
        <option value="ease-out">ease-out</option>
        <option value="ease-in-out">ease-in-out</option>
        <option value="cubic-bezier(0.68, -0.55, 0.27, 1.55)">cubic-bezier (bounce)</option>
      </select>
    </div>
  </div>

  <div class="transform-preview-wrap">
    <div class="transform-preview" :style="transformBoxStyle">.box</div>
  </div>

  <button class="toggle-btn" @click="applied = !applied">{{ applied ? 'Voltar ao estado normal' : 'Aplicar transformação' }}</button>

  <pre class="code-output"><code><span class="prop">transition</span><span class="punc">:</span> <span class="val">transform {{ duration }}s {{ timingFunction }}</span><span class="punc">;</span>
<span class="prop">transform</span><span class="punc">:</span> <span class="val">{{ transformValue }}</span><span class="punc">;</span></code></pre>
</div>

## Pseudo-classes: nth-child {#pseudo}

Escolha uma fórmula e veja quais linhas seriam selecionadas:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>seletor</label>
      <select v-model="nthFormula">
        <option v-for="opt in nthOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>
  </div>

  <div class="nth-demo">
    <div v-for="n in rows" :key="n" class="nth-row" :class="{ 'nth-row-match': nthMatches(n, nthFormula) }">
      Linha {{ n }}
    </div>
  </div>

  <pre class="code-output"><code><span class="val">tr</span><span class="punc">:nth-child(</span><span class="val">{{ nthFormula === 'first' ? '1' : nthFormula === 'last' ? 'ultimo' : nthFormula }}</span><span class="punc">) { </span><span class="prop">background</span><span class="punc">:</span> <span class="val">#f8faff</span><span class="punc">; }</span></code></pre>

  <p class="pseudo-note">Passe o mouse sobre a caixa abaixo para ver <code>::after</code> em ação (usado para marcar campos obrigatórios):</p>
  <div class="tooltip-demo" data-tooltip="Este texto vem de content: attr(data-tooltip)">Passe o mouse aqui</div>
</div>

## Variáveis CSS {#variaveis}

Troque o tema clicando nas cores; tudo abaixo lê a mesma variável `--demo-brand`:

<div class="playground" :style="{ '--demo-brand': brand }">
  <div class="controls">
    <div class="ctrl-group">
      <label>--demo-brand</label>
      <div class="theme-buttons">
        <button
          v-for="t in themes"
          :key="t.value"
          class="theme-btn"
          :class="{ 'theme-btn-active': brand === t.value }"
          :style="{ background: t.value }"
          @click="brand = t.value"
          :title="t.label"
        ></button>
      </div>
    </div>
  </div>

  <div class="theme-preview">
    <div class="theme-preview-card">
      <strong>Cartão</strong>
      <p>usa <code>background: var(--demo-brand)</code></p>
    </div>
    <button class="theme-preview-btn">Botão com var(--demo-brand)</button>
  </div>

  <pre class="code-output"><code><span class="punc">:root {</span> <span class="prop">--demo-brand</span><span class="punc">:</span> <span class="val">{{ brand }}</span><span class="punc">; }</span>

<span class="punc">.card { </span><span class="prop">background</span><span class="punc">:</span> <span class="val">var(--demo-brand)</span><span class="punc">; }</span></code></pre>
</div>

<style scoped src="./shared.css"></style>
<style scoped src="./css-propriedades-exemplos.css"></style>
