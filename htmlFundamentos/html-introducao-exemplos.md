---
title: "Exemplos: Introdução ao HTML"
---

<script setup>
import { ref, computed } from 'vue'

// ---- Anatomia interativa ----
const part = ref('tag')
const explanations = {
  tag: 'A tag define o TIPO do elemento. Aqui, "p" diz ao navegador que isto é um parágrafo.',
  attr: 'O atributo "class" dá uma informação extra ao elemento (neste caso, um gancho para o CSS estilizar).',
  val: 'O valor do atributo vem sempre entre aspas, depois do sinal de igual.',
  content: 'O conteúdo é tudo que fica entre a tag de abertura e a tag de fechamento.'
}

// ---- Atributos ao vivo (link) ----
const href = ref('https://developer.mozilla.org')
const target = ref('_self')
const noopener = ref(true)

const relValue = computed(() => (target.value === '_blank' && noopener.value) ? ' rel="noopener noreferrer"' : '')
const linkCode = computed(() => `<a href="${href.value}" target="${target.value}"${relValue.value}>Documentação MDN</a>`)
const targetExplain = computed(() => {
  if (target.value === '_blank') return 'abre em uma NOVA aba/janela'
  if (target.value === '_self') return 'abre na MESMA aba (padrão)'
  if (target.value === '_parent') return 'abre no frame pai (uso raro hoje em dia)'
  return 'abre na aba de nível mais alto (uso raro hoje em dia)'
})

// ---- Árvore explorável ----
const nodes = [
  { id: 'html', tag: 'html', parent: null },
  { id: 'head', tag: 'head', parent: 'html' },
  { id: 'title', tag: 'title', parent: 'head' },
  { id: 'meta', tag: 'meta', parent: 'head', void: true },
  { id: 'body', tag: 'body', parent: 'html' },
  { id: 'header', tag: 'header', parent: 'body' },
  { id: 'nav', tag: 'nav', parent: 'header' },
  { id: 'main', tag: 'main', parent: 'body' },
  { id: 'section', tag: 'section', parent: 'main' },
  { id: 'p', tag: 'p', parent: 'section' },
  { id: 'img', tag: 'img', parent: 'section', void: true }
]
function depthOf(id) {
  let d = 0
  let cur = nodes.find(n => n.id === id)
  while (cur.parent) { d++; cur = nodes.find(n => n.id === cur.parent) }
  return d
}
const rows = nodes.map(n => ({ ...n, depth: depthOf(n.id) }))
const selected = ref('section')
const selectedNode = computed(() => nodes.find(n => n.id === selected.value))
const selectedChildren = computed(() => nodes.filter(n => n.parent === selected.value).map(n => n.tag))
const selectedParentTag = computed(() => {
  const p = selectedNode.value?.parent
  return p ? nodes.find(n => n.id === p).tag : '(é a raiz do documento)'
})
const selectedSiblings = computed(() => {
  const p = selectedNode.value?.parent
  return nodes.filter(n => n.parent === p && n.id !== selected.value).map(n => n.tag)
})
</script>

# Exemplos: Introdução ao HTML

[← Voltar para a aula](/htmlFundamentos/html-introducao)

## Anatomia de uma tag {#anatomia}

Clique em cada parte da tag para ver o que ela significa:

<div class="playground">
  <div class="anatomy-interactive">
<span class="ta-bracket">&lt;</span><span class="anatomy-part tag" :class="{ active: part === 'tag' }" @click="part = 'tag'">p</span> <span class="anatomy-part attr" :class="{ active: part === 'attr' }" @click="part = 'attr'">class</span><span class="ta-bracket">=</span><span class="anatomy-part val" :class="{ active: part === 'val' }" @click="part = 'val'">"destaque"</span><span class="ta-bracket">&gt;</span><span class="anatomy-part content" :class="{ active: part === 'content' }" @click="part = 'content'">Olá, mundo!</span><span class="ta-bracket">&lt;/</span><span class="anatomy-part tag" :class="{ active: part === 'tag' }" @click="part = 'tag'">p</span><span class="ta-bracket">&gt;</span>
  </div>
  <div class="anatomy-explain">{{ explanations[part] }}</div>
</div>

## Atributos ao vivo {#atributos}

Altere os atributos do link e veja o código e a explicação mudarem:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>href</label>
      <input type="text" v-model="href" />
    </div>
    <div class="ctrl-group">
      <label>target</label>
      <select v-model="target">
        <option value="_self">_self</option>
        <option value="_blank">_blank</option>
        <option value="_parent">_parent</option>
        <option value="_top">_top</option>
      </select>
    </div>
    <div class="ctrl-group ctrl-group-checkbox">
      <label><input type="checkbox" v-model="noopener" :disabled="target !== '_blank'" /> rel="noopener noreferrer"</label>
    </div>
  </div>

  <div class="link-preview-wrap">
    <div class="link-preview">
      <a :href="href" :target="target" @click.prevent>Documentação MDN</a>
    </div>
  </div>
  <p class="link-note">target="{{ target }}" → {{ targetExplain }}</p>

  <pre class="code-output"><code><span class="punc">&lt;</span><span class="prop">a</span> <span class="prop">href</span><span class="punc">=</span><span class="val">"{{ href }}"</span> <span class="prop">target</span><span class="punc">=</span><span class="val">"{{ target }}"</span><span v-if="relValue"> <span class="prop">rel</span><span class="punc">=</span><span class="val">"noopener noreferrer"</span></span><span class="punc">&gt;</span>Documentação MDN<span class="punc">&lt;/</span><span class="prop">a</span><span class="punc">&gt;</span></code></pre>
</div>

::: tip Por que rel="noopener"?
Quando `target="_blank"` abre uma nova aba, a página aberta ganha acesso (via `window.opener`) à aba original: um risco de segurança conhecido como *tabnabbing*. `rel="noopener"` bloqueia esse acesso; `noreferrer` também esconde a URL de origem.
:::

## Árvore de elementos {#arvore}

Clique em qualquer tag para ver seus pais, filhos e irmãos:

<div class="playground">
  <div class="tree-explorer">
    <div class="tree-rows">
      <div
        v-for="row in rows"
        :key="row.id"
        class="tree-row"
        :class="{ active: selected === row.id }"
        :style="{ paddingLeft: (row.depth * 20 + 8) + 'px' }"
        @click="selected = row.id"
      >&lt;{{ row.tag }}{{ row.void ? ' /' : '' }}&gt;</div>
    </div>
    <div class="tree-info">
      <p>Selecionado: <strong>&lt;{{ selectedNode.tag }}&gt;</strong></p>
      <p>Pai: <strong>&lt;{{ selectedParentTag }}&gt;</strong></p>
      <p>Irmãos: <strong>{{ selectedSiblings.length ? selectedSiblings.map(t => '<' + t + '>').join(', ') : 'nenhum' }}</strong></p>
      <p>Filhos: <strong>{{ selectedChildren.length ? selectedChildren.map(t => '<' + t + '>').join(', ') : 'nenhum (elemento folha)' }}</strong></p>
    </div>
  </div>
</div>

<style scoped src="./shared.css"></style>
<style scoped src="./html-introducao-exemplos.css"></style>
