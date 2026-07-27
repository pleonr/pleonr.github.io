---
title: "Exemplos: Tags e Elementos"
---

<script setup>
import { ref, computed } from 'vue'

// ---- Headings ----
const headingText = ref('Título de exemplo')
const headingLevel = ref(2)
const headingTag = computed(() => 'h' + headingLevel.value)

// ---- Tabela ----
const rowCount = ref(3)
const colCount = ref(3)
const rowsArr = computed(() => Array.from({ length: rowCount.value }, (_, i) => i + 1))
const colsArr = computed(() => Array.from({ length: colCount.value }, (_, i) => i + 1))
const tableCode = computed(() => {
  let out = '<table>\n  <thead>\n    <tr>\n'
  for (const c of colsArr.value) out += `      <th>Coluna ${c}</th>\n`
  out += '    </tr>\n  </thead>\n  <tbody>\n'
  for (const r of rowsArr.value) {
    out += '    <tr>\n'
    for (const c of colsArr.value) out += `      <td>Linha ${r}, Col ${c}</td>\n`
    out += '    </tr>\n'
  }
  out += '  </tbody>\n</table>'
  return out
})

// ---- Formatação de texto ----
const inlineText = ref('HTML é divertido')
const inlineTags = [
  { tag: 'strong', desc: 'Importância (negrito por padrão).' },
  { tag: 'em', desc: 'Ênfase (itálico por padrão).' },
  { tag: 'mark', desc: 'Trecho evidenciado.' },
  { tag: 's', desc: 'Conteúdo desatualizado ou que não é mais relevante.' },
  { tag: 'sub', desc: 'Texto subscrito.' },
  { tag: 'sup', desc: 'Texto sobrescrito.' },
  { tag: 'code', desc: 'Trecho de código.' }
]
const chosenInlineTag = ref('strong')
const chosenInlineDesc = computed(() => inlineTags.find(t => t.tag === chosenInlineTag.value).desc)

// ---- Citações: <q> vs <blockquote> ----
const quoteText = ref('A simplicidade é o último grau de sofisticação.')
const quoteAuthor = ref('Leonardo da Vinci')

// ---- Imagem: <img> ----
const imgAlt = ref('Campus da UPF em 2009')
const imgWidth = ref(320)
const imgLazy = ref(false)
const imgBroken = ref(false)
const imgSrc = computed(() => imgBroken.value ? '/upf-arquivo-inexistente.jpg' : '/UPF2009.jpg')

// ---- Formulário: tipos de input ----
const inputTypes = [
  { type: 'text', desc: 'Texto livre de uma linha (o tipo mais genérico).' },
  { type: 'email', desc: 'Valida formato de e-mail e mostra teclado apropriado em celulares.' },
  { type: 'password', desc: 'Esconde os caracteres digitados.' },
  { type: 'number', desc: 'Aceita só números; mostra setas de incremento no desktop.' },
  { type: 'date', desc: 'Abre um seletor de data nativo do navegador.' },
  { type: 'range', desc: 'Um slider. Use com min, max e step.' },
  { type: 'color', desc: 'Abre um seletor de cor nativo do navegador.' },
  { type: 'checkbox', desc: 'Caixa de marcação; várias podem ficar marcadas ao mesmo tempo.' },
  { type: 'radio', desc: 'Botão de opção; só uma pode ficar marcada dentro do mesmo "name".' },
  { type: 'file', desc: 'Permite selecionar um arquivo do dispositivo.' }
]
const chosenType = ref('email')
const chosenDesc = computed(() => inputTypes.find(t => t.type === chosenType.value).desc)
</script>

# Exemplos: Tags e Elementos

[← Voltar para a aula](/htmlFundamentos/html-tags-elementos)

## Headings {#headings}

Escolha o nível e veja o resultado. Headings maiores (h1) têm mais peso visual e semântico:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>texto</label>
      <input type="text" v-model="headingText" />
    </div>
    <div class="ctrl-group">
      <label>nível: h{{ headingLevel }}</label>
      <input type="range" min="1" max="6" v-model.number="headingLevel" />
    </div>
  </div>

  <div class="heading-preview">
    <component :is="headingTag">{{ headingText }}</component>
  </div>

  <pre class="code-output"><code><span class="punc">&lt;</span><span class="prop">{{ headingTag }}</span><span class="punc">&gt;</span><span class="val">{{ headingText }}</span><span class="punc">&lt;/</span><span class="prop">{{ headingTag }}</span><span class="punc">&gt;</span></code></pre>
</div>

## Formatação de texto {#texto}

Escolha uma tag e veja como ela muda o mesmo trecho de texto:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>texto</label>
      <input type="text" v-model="inlineText" />
    </div>
    <div class="ctrl-group">
      <label>tag</label>
      <select v-model="chosenInlineTag">
        <option v-for="t in inlineTags" :key="t.tag" :value="t.tag">&lt;{{ t.tag }}&gt;</option>
      </select>
    </div>
  </div>

  <div class="heading-preview">
    <p>Isto é um texto com <component :is="chosenInlineTag">{{ inlineText }}</component> no meio da frase.</p>
  </div>
  <p class="input-type-note">{{ chosenInlineDesc }}</p>

  <pre class="code-output"><code>&lt;p&gt;Isto é um texto com <span class="punc">&lt;</span><span class="prop">{{ chosenInlineTag }}</span><span class="punc">&gt;</span><span class="val">{{ inlineText }}</span><span class="punc">&lt;/</span><span class="prop">{{ chosenInlineTag }}</span><span class="punc">&gt;</span> no meio da frase.&lt;/p&gt;</code></pre>
</div>

## Citações: `<q>` vs `<blockquote>` {#citacoes}

Os dois marcam citações, mas em contextos diferentes. Edite a citação e o autor e compare o resultado:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>citação</label>
      <input type="text" v-model="quoteText" />
    </div>
    <div class="ctrl-group">
      <label>autor</label>
      <input type="text" v-model="quoteAuthor" />
    </div>
  </div>

  <div class="quote-compare">
    <div class="quote-panel">
      <p class="quote-panel-label">&lt;q&gt;: em linha, aspas automáticas</p>
      <div class="heading-preview">
        <p>Como dizia {{ quoteAuthor }}: <q>{{ quoteText }}</q></p>
      </div>
      <pre class="code-output"><code>&lt;p&gt;Como dizia {{ quoteAuthor }}: <span class="punc">&lt;</span><span class="prop">q</span><span class="punc">&gt;</span><span class="val">{{ quoteText }}</span><span class="punc">&lt;/</span><span class="prop">q</span><span class="punc">&gt;</span>&lt;/p&gt;</code></pre>
    </div>
    <div class="quote-panel">
      <p class="quote-panel-label">&lt;blockquote&gt;: em bloco, com atribuição</p>
      <div class="heading-preview">
        <blockquote>
          <p>{{ quoteText }}</p>
          <footer>{{ quoteAuthor }}</footer>
        </blockquote>
      </div>
      <pre class="code-output"><code><span class="punc">&lt;</span><span class="prop">blockquote</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="prop">p</span><span class="punc">&gt;</span><span class="val">{{ quoteText }}</span><span class="punc">&lt;/</span><span class="prop">p</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="prop">footer</span><span class="punc">&gt;</span><span class="val">{{ quoteAuthor }}</span><span class="punc">&lt;/</span><span class="prop">footer</span><span class="punc">&gt;</span>
<span class="punc">&lt;/</span><span class="prop">blockquote</span><span class="punc">&gt;</span></code></pre>
    </div>
  </div>
</div>

::: tip Por que `<q>` não precisa de aspas digitadas
O navegador insere as aspas ao redor do conteúdo de `<q>` automaticamente, via CSS. Se você digitar aspas manualmente dentro de `<q>`, elas aparecem em dobro. `<blockquote>` não recebe aspas automáticas: por ser um elemento de bloco, a citação já se destaca do texto ao redor, e a fonte costuma ser indicada com `<footer><cite>`.
:::

## Propriedades de imagem {#imagem}

Ajuste os atributos de `<img>` sobre a foto do campus da UPF e veja o resultado, incluindo o que acontece quando a imagem falha ao carregar:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>alt</label>
      <input type="text" v-model="imgAlt" />
    </div>
    <div class="ctrl-group">
      <label>width: {{ imgWidth }}px</label>
      <input type="range" min="120" max="480" step="20" v-model.number="imgWidth" />
    </div>
    <div class="ctrl-group ctrl-group-checkbox">
      <label><input type="checkbox" v-model="imgLazy" /> loading="lazy"</label>
    </div>
    <div class="ctrl-group ctrl-group-checkbox">
      <label><input type="checkbox" v-model="imgBroken" /> simular falha ao carregar</label>
    </div>
  </div>

  <div class="heading-preview img-preview-wrap">
    <img :src="imgSrc" :alt="imgAlt" :width="imgWidth" :loading="imgLazy ? 'lazy' : 'eager'" />
  </div>
  <p class="input-type-note" v-if="imgBroken">A imagem "quebrou" de propósito (src inválido). Repare que o texto de <code>alt</code> aparece no lugar dela: é exatamente para isso que ele existe.</p>

  <pre class="code-output"><code><span class="punc">&lt;</span><span class="prop">img</span> <span class="prop">src</span><span class="punc">=</span><span class="val">"{{ imgSrc }}"</span> <span class="prop">alt</span><span class="punc">=</span><span class="val">"{{ imgAlt }}"</span> <span class="prop">width</span><span class="punc">=</span><span class="val">"{{ imgWidth }}"</span><span v-if="imgLazy"> <span class="prop">loading</span><span class="punc">=</span><span class="val">"lazy"</span></span> <span class="punc">/&gt;</span></code></pre>
</div>

## Montar uma tabela {#tabela}

Ajuste linhas e colunas e observe a estrutura `<thead>`/`<tbody>` gerada:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>linhas: {{ rowCount }}</label>
      <input type="range" min="1" max="6" v-model.number="rowCount" />
    </div>
    <div class="ctrl-group">
      <label>colunas: {{ colCount }}</label>
      <input type="range" min="1" max="5" v-model.number="colCount" />
    </div>
  </div>

  <div class="table-builder-wrap">
    <table class="table-builder">
      <thead>
        <tr><th v-for="c in colsArr" :key="c">Coluna {{ c }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in rowsArr" :key="r">
          <td v-for="c in colsArr" :key="c">Linha {{ r }}, Col {{ c }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <pre class="code-output"><code>{{ tableCode }}</code></pre>
</div>

## Tipos de input {#formulario}

Escolha um `type` e veja como o navegador renderiza o campo nativamente:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>type</label>
      <select v-model="chosenType">
        <option v-for="t in inputTypes" :key="t.type" :value="t.type">{{ t.type }}</option>
      </select>
    </div>
  </div>

  <div class="form-preview">
    <label for="demo-input">Campo de exemplo</label>
    <input id="demo-input" :type="chosenType" />
  </div>
  <p class="input-type-note">{{ chosenDesc }}</p>

  <pre class="code-output"><code><span class="punc">&lt;</span><span class="prop">input</span> <span class="prop">type</span><span class="punc">=</span><span class="val">"{{ chosenType }}"</span> <span class="prop">id</span><span class="punc">=</span><span class="val">"demo-input"</span> <span class="punc">/&gt;</span></code></pre>
</div>

<style scoped src="./shared.css"></style>
<style scoped src="./html-tags-elementos-exemplos.css"></style>
