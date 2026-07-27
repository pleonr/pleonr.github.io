---
title: "Exemplos: Introdução ao JavaScript"
---

<script setup>
import { ref, computed } from 'vue'

// ---- Anatomia interativa da variável ----
const part = ref('kw')
const explanations = {
  kw: 'A palavra-chave diz ao motor JS que uma nova variável está sendo criada, e qual é o seu comportamento (let, const ou var).',
  id: 'O identificador é o nome pelo qual você vai se referir a esse valor no resto do código.',
  op: 'O sinal de igual aqui NÃO é "igual a". É o operador de atribuição: "guarde o valor da direita dentro do nome da esquerda".',
  val: 'O valor é o dado que está sendo guardado: pode ser um número, texto, booleano, objeto, array...'
}

// ---- Playground de tipos (typeof) ----
const rawValue = ref('42')
const parsedInfo = computed(() => {
  const v = rawValue.value.trim()
  if (v === '') return { value: 'undefined', type: 'undefined' }
  if (v === 'true' || v === 'false') return { value: v, type: 'boolean' }
  if (v === 'null') return { value: 'null', type: 'object (bug histórico)' }
  if (!isNaN(Number(v)) && v !== '') return { value: v, type: 'number' }
  return { value: `"${v}"`, type: 'string' }
})

// ---- Operadores ao vivo ----
const opA = ref('5')
const opB = ref('5')
const operator = ref('===')
function coerce(s) {
  if (s === 'true') return true
  if (s === 'false') return false
  if (!isNaN(Number(s)) && s.trim() !== '') return Number(s)
  return s
}
const opResult = computed(() => {
  const a = opA.value
  const b = opB.value
  const ca = coerce(a)
  const cb = coerce(b)
  switch (operator.value) {
    case '==': return ca == cb
    case '===': return ca === cb
    case '!=': return ca != cb
    case '!==': return ca !== cb
    case '>': return ca > cb
    case '<': return ca < cb
    default: return null
  }
})
const opExplain = computed(() => {
  if (operator.value === '==' || operator.value === '!=') {
    return 'Operador solto: os valores são convertidos para o mesmo tipo antes de comparar.'
  }
  if (operator.value === '===' || operator.value === '!==') {
    return 'Operador estrito: compara valor E tipo, sem converter nada.'
  }
  return 'Comparação numérica/alfabética direta.'
})

// ---- Template literal builder ----
const tlNome = ref('Ana')
const tlIdade = ref('27')
const tlCidade = ref('Recife')
const templateOutput = computed(() => `Olá, ${tlNome.value}! Você tem ${tlIdade.value} anos e mora em ${tlCidade.value}.`)
const concatOutput = computed(() => 'Olá, ' + tlNome.value + '! Você tem ' + tlIdade.value + ' anos e mora em ' + tlCidade.value + '.')
</script>

# Exemplos: Introdução ao JavaScript

[← Voltar para a aula](/jsFundamentos/js-introducao)

## Anatomia de uma variável {#anatomia}

Clique em cada parte da declaração para ver o que ela significa:

<div class="playground">
  <div class="anatomy-interactive">
<span class="anatomy-part kw" :class="{ active: part === 'kw' }" @click="part = 'kw'">let</span> <span class="anatomy-part id" :class="{ active: part === 'id' }" @click="part = 'id'">idade</span> <span class="anatomy-part op" :class="{ active: part === 'op' }" @click="part = 'op'">=</span> <span class="anatomy-part val" :class="{ active: part === 'val' }" @click="part = 'val'">27</span><span class="va-punc">;</span>
  </div>
  <div class="anatomy-explain">{{ explanations[part] }}</div>
</div>

## Tipos ao vivo (`typeof`) {#tipos}

Digite um valor e veja como o JavaScript o interpretaria:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>valor digitado</label>
      <input type="text" v-model="rawValue" placeholder='ex: 42, true, "texto", null' />
    </div>
  </div>

  <pre class="code-output"><code><span class="prop">typeof</span> {{ parsedInfo.value }} <span class="punc">// →</span> <span class="val">"{{ parsedInfo.type }}"</span></code></pre>

  <p class="link-note">Experimente digitar: <code>42</code>, <code>true</code>, <code>null</code>, <code>alguma coisa</code>, ou deixar vazio.</p>
</div>

## Operadores ao vivo {#operadores}

Compare dois valores com operadores diferentes e veja o resultado mudar:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>operando A</label>
      <input type="text" v-model="opA" />
    </div>
    <div class="ctrl-group">
      <label>operador</label>
      <select v-model="operator">
        <option value="==">==</option>
        <option value="===">===</option>
        <option value="!=">!=</option>
        <option value="!==">!==</option>
        <option value=">">&gt;</option>
        <option value="<">&lt;</option>
      </select>
    </div>
    <div class="ctrl-group">
      <label>operando B</label>
      <input type="text" v-model="opB" />
    </div>
  </div>

  <pre class="code-output"><code><span class="val">{{ opA }}</span> <span class="prop">{{ operator }}</span> <span class="val">{{ opB }}</span> <span class="punc">// →</span> <span class="val">{{ String(opResult) }}</span></code></pre>
  <p class="link-note">{{ opExplain }}</p>
</div>

::: tip Experimente
Compare `5` com `"5"` usando `==` e depois `===`. O resultado muda porque `==` converte o texto `"5"` para número antes de comparar.
:::

## Template literal builder {#template}

Preencha os campos e veja a diferença entre concatenação e template literal:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>nome</label>
      <input type="text" v-model="tlNome" />
    </div>
    <div class="ctrl-group">
      <label>idade</label>
      <input type="text" v-model="tlIdade" />
    </div>
    <div class="ctrl-group">
      <label>cidade</label>
      <input type="text" v-model="tlCidade" />
    </div>
  </div>

  <pre class="code-output"><code><span class="punc">// template literal</span>
<span class="prop">const</span> frase = <span class="val">`{{ templateOutput }}`</span>

<span class="punc">// concatenação (forma antiga)</span>
<span class="prop">const</span> frase = <span class="val">'{{ concatOutput }}'</span></code></pre>
</div>

<style scoped src="./shared.css"></style>
<style scoped src="./js-introducao-exemplos.css"></style>
