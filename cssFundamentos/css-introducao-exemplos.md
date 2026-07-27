---
title: "Exemplos: Introdução ao CSS"
---

<script setup>
import { ref, computed } from 'vue'

// ---- Seletores ----
const elements = [
  { id: 'e1', tag: 'p', text: '<p id="intro">', classes: [], elId: 'intro' },
  { id: 'e2', tag: 'p', text: '<p class="destaque">', classes: ['destaque'] },
  { id: 'e3', tag: 'span', text: '<span class="destaque">', classes: ['destaque'] },
  { id: 'e4', tag: 'li', text: '<li>', classes: [] },
  { id: 'e5', tag: 'li', text: '<li class="destaque">', classes: ['destaque'] }
]
const selectorOptions = [
  { label: '*', selector: '*' },
  { label: 'p', selector: 'p' },
  { label: '.destaque', selector: '.destaque' },
  { label: '#intro', selector: '#intro' },
  { label: 'li.destaque', selector: 'li.destaque' }
]
const chosenSelector = ref('.destaque')

function matches(el, selector) {
  if (selector === '*') return true
  if (selector === 'p') return el.tag === 'p'
  if (selector === '.destaque') return el.classes.includes('destaque')
  if (selector === '#intro') return el.elId === 'intro'
  if (selector === 'li.destaque') return el.tag === 'li' && el.classes.includes('destaque')
  return false
}

const highlighted = computed(() => elements.map(el => matches(el, chosenSelector.value)))

// ---- Especificidade ----
const specPresets = [
  { label: 'div', selector: 'div', score: [0, 0, 1] },
  { label: '.card', selector: '.card', score: [0, 1, 0] },
  { label: 'div.card', selector: 'div.card', score: [0, 1, 1] },
  { label: '.card.featured', selector: '.card.featured', score: [0, 2, 0] },
  { label: '#unico', selector: '#unico', score: [1, 0, 0] },
  { label: '#unico.card', selector: '#unico.card', score: [1, 1, 0] }
]
const ruleAIndex = ref(1)
const ruleBIndex = ref(4)
const declaredLast = ref('B')

const ruleA = computed(() => specPresets[ruleAIndex.value])
const ruleB = computed(() => specPresets[ruleBIndex.value])

function compareScores(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  return 0
}

const winner = computed(() => {
  const cmp = compareScores(ruleA.value.score, ruleB.value.score)
  if (cmp > 0) return 'A'
  if (cmp < 0) return 'B'
  return declaredLast.value
})

// ---- Unidades ----
const rootSize = ref(16)
const pxSize = computed(() => 16)
const remSize = computed(() => 1.5 * rootSize.value)
const parentSize = computed(() => 1.5 * rootSize.value) // parent has font-size: 1.5em
const emSize = computed(() => 1.5 * parentSize.value)   // child has font-size: 1.5em relative to parent

// ---- Cores ----
const hue = ref(227)
const sat = ref(90)
const light = ref(63)
const hslString = computed(() => `hsl(${hue.value}, ${sat.value}%, ${light.value}%)`)

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0')
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}
const hexString = computed(() => hslToHex(hue.value, sat.value, light.value))

// ---- Cores: seletores por forma (hexágono / círculos) ----
function hslToRgbArr(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [0, 8, 4].map(n => Math.round(255 * f(n)))
}
function rgbToHex(rgbArr) {
  return '#' + rgbArr.map(x => x.toString(16).padStart(2, '0')).join('')
}
function markerPos(h, s) {
  const rad = (h - 90) * Math.PI / 180
  const r = s / 100
  return { left: (50 + r * 50 * Math.cos(rad)) + '%', top: (50 + r * 50 * Math.sin(rad)) + '%' }
}
// hRef/sRef are the refs themselves (not .value) so this one function can drive any of the wheels below
function pickOnWheel(event, wheelEl, hRef, sRef) {
  const rect = wheelEl.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const update = (e) => {
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const mathAngle = Math.atan2(dy, dx) * 180 / Math.PI
    hRef.value = Math.round((mathAngle + 90 + 360) % 360)
    sRef.value = Math.round(Math.min(Math.sqrt(dx * dx + dy * dy) / (rect.width / 2), 1) * 100)
  }
  update(event)
  const onMove = (e) => update(e)
  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

// Hexágono → Hex
const hexWheelEl = ref(null)
const hueHex = ref(227)
const satHex = ref(90)
const lightHex = ref(63)
const hexMarker = computed(() => markerPos(hueHex.value, satHex.value))
const hexPickValue = computed(() => rgbToHex(hslToRgbArr(hueHex.value, satHex.value, lightHex.value)))
function onHexWheelDown(e) { pickOnWheel(e, hexWheelEl.value, hueHex, satHex) }

// Círculo → RGB
const rgbWheelEl = ref(null)
const hueRgb = ref(142)
const satRgb = ref(60)
const lightRgb = ref(50)
const rgbMarker = computed(() => markerPos(hueRgb.value, satRgb.value))
const rgbArr = computed(() => hslToRgbArr(hueRgb.value, satRgb.value, lightRgb.value))
const rgbPickValue = computed(() => `rgb(${rgbArr.value.join(', ')})`)
function onRgbWheelDown(e) { pickOnWheel(e, rgbWheelEl.value, hueRgb, satRgb) }

// Círculo → RGBA
const rgbaWheelEl = ref(null)
const hueRgba = ref(340)
const satRgba = ref(80)
const lightRgba = ref(55)
const alphaRgba = ref(0.7)
const rgbaMarker = computed(() => markerPos(hueRgba.value, satRgba.value))
const rgbaArr = computed(() => hslToRgbArr(hueRgba.value, satRgba.value, lightRgba.value))
const rgbaPickValue = computed(() => `rgba(${rgbaArr.value.join(', ')}, ${alphaRgba.value})`)
function onRgbaWheelDown(e) { pickOnWheel(e, rgbaWheelEl.value, hueRgba, satRgba) }
</script>

# Exemplos: Introdução ao CSS

[← Voltar para a aula](/cssFundamentos/css-introducao)

## Seletores {#seletores}

Escolha um seletor e veja quais elementos do "documento" abaixo seriam afetados por ele:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>seletor</label>
      <select v-model="chosenSelector">
        <option v-for="opt in selectorOptions" :key="opt.selector" :value="opt.selector">{{ opt.label }}</option>
      </select>
    </div>
  </div>

  <div class="doc-canvas">
    <div v-for="(el, i) in elements" :key="el.id" class="doc-el" :class="{ 'doc-el-match': highlighted[i] }">
      {{ el.text }}
    </div>
  </div>

  <pre class="code-output"><code><span class="val">{{ chosenSelector }}</span> <span class="punc">{ </span><span class="prop">color</span><span class="punc">:</span> <span class="val">#4a6cf7</span><span class="punc">; }</span></code></pre>
</div>

## Especificidade {#especificidade}

Duas regras competem pela cor da mesma caixa. Escolha um seletor para cada uma e veja qual vence:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>Regra A</label>
      <select v-model.number="ruleAIndex">
        <option v-for="(p, i) in specPresets" :key="p.selector" :value="i">{{ p.label }}</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>Regra B</label>
      <select v-model.number="ruleBIndex">
        <option v-for="(p, i) in specPresets" :key="p.selector" :value="i">{{ p.label }}</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>declarada por último</label>
      <select v-model="declaredLast">
        <option value="A">Regra A</option>
        <option value="B">Regra B</option>
      </select>
    </div>
  </div>

  <div class="spec-cards">
    <div class="spec-card" :class="{ 'spec-card-win': winner === 'A' }">
      <p class="spec-selector"><code>{{ ruleA.selector }}</code></p>
      <p class="spec-score">especificidade: {{ ruleA.score.join('-') }}</p>
    </div>
    <div class="spec-vs">vs</div>
    <div class="spec-card" :class="{ 'spec-card-win': winner === 'B' }">
      <p class="spec-selector"><code>{{ ruleB.selector }}</code></p>
      <p class="spec-score">especificidade: {{ ruleB.score.join('-') }}</p>
    </div>
  </div>

  <div class="spec-result">Vence: <strong>Regra {{ winner }}</strong> ({{ winner === 'A' ? ruleA.selector : ruleB.selector }})</div>
</div>

## Unidades {#unidades}

Mova o slider para simular a mudança do tamanho de fonte **raiz** (`html { font-size }`) e observe como cada unidade reage:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>font-size da raiz (html): {{ rootSize }}px</label>
      <input type="range" min="10" max="30" v-model.number="rootSize" />
    </div>
  </div>

  <div class="units-demo">
    <div class="units-item">
      <div class="units-sample" :style="{ fontSize: pxSize + 'px' }">Aa</div>
      <p class="units-label"><code>font-size: 16px</code><br>sempre {{ pxSize }}px, <strong>fixo</strong></p>
    </div>
    <div class="units-item">
      <div class="units-sample" :style="{ fontSize: remSize + 'px' }">Aa</div>
      <p class="units-label"><code>font-size: 1.5rem</code><br>1.5 × raiz = {{ remSize.toFixed(1) }}px</p>
    </div>
    <div class="units-item">
      <div class="units-sample" :style="{ fontSize: emSize + 'px' }">Aa</div>
      <p class="units-label"><code>font-size: 1.5em</code><br>dentro de um pai com <code>1.5em</code>: 1.5 × 1.5 × raiz = {{ emSize.toFixed(1) }}px</p>
    </div>
  </div>
</div>

## Cores {#cores}

CSS aceita cor em vários formatos. Abaixo, um misturador por sliders (HSL) e três **seletores visuais com formas diferentes**: um hexágono que gera hexadecimal, e dois círculos que geram RGB e RGBA. Clique ou arraste dentro da forma para escolher matiz e saturação; o slider ao lado controla a luminosidade.

### Misturador HSL (sliders)

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>matiz (hue): {{ hue }}°</label>
      <input type="range" min="0" max="360" v-model.number="hue" />
    </div>
    <div class="ctrl-group">
      <label>saturação: {{ sat }}%</label>
      <input type="range" min="0" max="100" v-model.number="sat" />
    </div>
    <div class="ctrl-group">
      <label>luminosidade: {{ light }}%</label>
      <input type="range" min="0" max="100" v-model.number="light" />
    </div>
  </div>

  <div class="color-preview" :style="{ background: hslString }"></div>

  <pre class="code-output"><code><span class="prop">background</span><span class="punc">:</span> <span class="val">{{ hslString }}</span><span class="punc">;</span>
<span class="punc">/* equivalente a </span><span class="val">{{ hexString }}</span><span class="punc"> */</span></code></pre>
</div>

### Seletor hexagonal → Hexadecimal

<div class="playground">
  <div class="wheel-layout">
    <div class="wheel-wrap">
      <div class="wheel wheel-hex" ref="hexWheelEl" @pointerdown.prevent="onHexWheelDown">
        <div class="wheel-marker" :style="hexMarker"></div>
      </div>
    </div>
    <div class="wheel-info">
      <div class="ctrl-group">
        <label>luminosidade: {{ lightHex }}%</label>
        <input type="range" min="0" max="100" v-model.number="lightHex" />
      </div>
      <div class="wheel-swatch" :style="{ background: hexPickValue }"></div>
      <pre class="code-output"><code><span class="prop">color</span><span class="punc">:</span> <span class="val">{{ hexPickValue }}</span><span class="punc">;</span></code></pre>
      <p class="wheel-readout">H: {{ hueHex }}°  S: {{ satHex }}%  L: {{ lightHex }}%</p>
    </div>
  </div>
</div>

### Seletor circular → RGB

<div class="playground">
  <div class="wheel-layout">
    <div class="wheel-wrap">
      <div class="wheel wheel-circle" ref="rgbWheelEl" @pointerdown.prevent="onRgbWheelDown">
        <div class="wheel-marker" :style="rgbMarker"></div>
      </div>
    </div>
    <div class="wheel-info">
      <div class="ctrl-group">
        <label>luminosidade: {{ lightRgb }}%</label>
        <input type="range" min="0" max="100" v-model.number="lightRgb" />
      </div>
      <div class="wheel-swatch" :style="{ background: rgbPickValue }"></div>
      <pre class="code-output"><code><span class="prop">color</span><span class="punc">:</span> <span class="val">{{ rgbPickValue }}</span><span class="punc">;</span></code></pre>
      <p class="wheel-readout">H: {{ hueRgb }}°  S: {{ satRgb }}%  L: {{ lightRgb }}%</p>
    </div>
  </div>
</div>

### Seletor circular → RGBA

<div class="playground">
  <div class="wheel-layout">
    <div class="wheel-wrap">
      <div class="wheel wheel-circle" ref="rgbaWheelEl" @pointerdown.prevent="onRgbaWheelDown">
        <div class="wheel-marker" :style="rgbaMarker"></div>
      </div>
    </div>
    <div class="wheel-info">
      <div class="ctrl-group">
        <label>luminosidade: {{ lightRgba }}%</label>
        <input type="range" min="0" max="100" v-model.number="lightRgba" />
      </div>
      <div class="ctrl-group">
        <label>alfa (transparência): {{ alphaRgba }}</label>
        <input type="range" min="0" max="1" step="0.01" v-model.number="alphaRgba" />
      </div>
      <div class="wheel-swatch-alpha-bg"><div class="wheel-swatch-alpha" :style="{ background: rgbaPickValue }"></div></div>
      <pre class="code-output"><code><span class="prop">background</span><span class="punc">:</span> <span class="val">{{ rgbaPickValue }}</span><span class="punc">;</span></code></pre>
      <p class="wheel-readout">H: {{ hueRgba }}°  S: {{ satRgba }}%  L: {{ lightRgba }}%  A: {{ alphaRgba }}</p>
    </div>
  </div>
</div>

<style scoped src="./shared.css"></style>
<style scoped src="./css-introducao-exemplos.css"></style>
