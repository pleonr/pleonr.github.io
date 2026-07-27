---
title: "Exemplos: Organização e Pontos de Atenção"
---

<script setup>
import { ref, computed } from 'vue'

// ---- SEO preview ----
const seoTitle = ref('Padaria Pão Quente: Pães e Doces Artesanais')
const seoDesc = ref('Padaria artesanal no centro da cidade. Pães, bolos e doces frescos todos os dias, feitos com ingredientes selecionados.')
const seoUrl = ref('www.padariapaoquente.com.br')

const titleLen = computed(() => seoTitle.value.length)
const descLen = computed(() => seoDesc.value.length)
const titleOk = computed(() => titleLen.value <= 60)
const descOk = computed(() => descLen.value <= 160)

// ---- Outline checker ----
const levels = ref([1, 2, 3, 2, 4, 3])
const labels = ['Blog de Receitas', 'Sobremesas', 'Bolo de Chocolate', 'Massas', 'Lasanha (pulou um nível!)', 'Ingredientes']

function isSkip(i) {
  if (i === 0) return levels.value[i] !== 1
  return levels.value[i] > levels.value[i - 1] + 1
}
const anyWarning = computed(() => levels.value.some((_, i) => isSkip(i)))

// ---- Acessibilidade: label associado ----
const focusedGood = ref(false)
const focusedBad = ref(false)

// ---- Acessibilidade: alt text ----
const altText = ref('Gráfico de vendas crescendo 20% no último trimestre')
const showAlt = ref(true)
</script>

# Exemplos: Organização e Pontos de Atenção

[← Voltar para a aula](/htmlFundamentos/html-organizacao)

## Simulador de resultado de busca {#seo}

Edite o título e a descrição e veja como apareceriam em uma busca, e se estouram o limite recomendado:

<div class="playground">
  <div class="controls">
    <div class="ctrl-group">
      <label>&lt;title&gt;</label>
      <input type="text" v-model="seoTitle" />
    </div>
    <div class="ctrl-group">
      <label>meta description</label>
      <input type="text" v-model="seoDesc" />
    </div>
  </div>

  <div class="serp-preview">
    <p class="serp-url">{{ seoUrl }}</p>
    <p class="serp-title">{{ seoTitle }}</p>
    <p class="serp-desc">{{ seoDesc }}</p>
  </div>
  <p class="char-count" :class="titleOk ? 'ok' : 'warn'">title: {{ titleLen }}/60 caracteres {{ titleOk ? '✓' : '(muito longo, pode ser cortado)' }}</p>
  <p class="char-count" :class="descOk ? 'ok' : 'warn'">description: {{ descLen }}/160 caracteres {{ descOk ? '✓' : '(muito longa, pode ser cortada)' }}</p>
</div>

## Verificador de outline {#outline}

Ajuste o nível de cada heading: linhas em vermelho pulam um nível em relação à anterior:

<div class="playground">
  <div class="outline-rows">
    <div v-for="(lvl, i) in levels" :key="i" class="outline-row" :class="{ warn: isSkip(i) }">
      <select v-model.number="levels[i]">
        <option v-for="n in 6" :key="n" :value="n">h{{ n }}</option>
      </select>
      <div class="outline-bar" :style="{ marginLeft: (levels[i] - 1) * 16 + 'px' }">
        &lt;h{{ lvl }}&gt; {{ labels[i] }}
      </div>
    </div>
  </div>
  <p class="outline-summary" :class="anyWarning ? 'warn' : 'ok'">
    {{ anyWarning ? '⚠️ Existe pelo menos um pulo de nível. Corrija para manter a hierarquia contínua.' : '✓ Hierarquia correta: nenhum nível foi pulado.' }}
  </p>
</div>

## Acessibilidade {#acessibilidade}

<div class="playground">
  <div class="a11y-grid">
    <div class="a11y-card">
      <h5>✅ label associado (for/id)</h5>
      <form @submit.prevent>
        <label for="a11y-good">Nome</label>
        <input id="a11y-good" type="text" @focus="focusedGood = true" @blur="focusedGood = false" />
      </form>
      <p class="a11y-feedback" :class="{ ok: focusedGood }">Clique na palavra "Nome" acima: {{ focusedGood ? '✓ funcionou, o input recebeu foco!' : 'o navegador foca o campo automaticamente.' }}</p>
    </div>
    <div class="a11y-card">
      <h5>❌ label sem associação</h5>
      <form @submit.prevent>
        <label>Nome</label>
        <input type="text" @focus="focusedBad = true" @blur="focusedBad = false" />
      </form>
      <p class="a11y-feedback">Clique na palavra "Nome" acima: nada acontece, porque não há <code>for</code>/<code>id</code> ligando os dois.</p>
    </div>
  </div>

  <div class="a11y-card" style="margin-top: 1rem;">
    <h5>Texto alternativo (alt)</h5>
    <div class="ctrl-group" style="max-width: 320px;">
      <label>alt="..."</label>
      <input type="text" v-model="altText" style="width: 100%; padding: 6px 10px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1);" />
    </div>
    <label style="display:flex; align-items:center; gap:6px; margin-top:.5rem; font-weight:400;">
      <input type="checkbox" v-model="showAlt" style="width:auto;" /> simular imagem quebrada (mostra o alt no lugar dela)
    </label>
    <div class="alt-demo-img">{{ showAlt ? altText : '🖼️ (imagem carregada normalmente)' }}</div>
    <p class="a11y-feedback">Um leitor de tela sempre anuncia: <em>"{{ altText || '(sem texto alternativo, o leitor de tela não tem o que dizer!)' }}"</em></p>
  </div>
</div>

<style scoped src="./shared.css"></style>
<style scoped src="./html-organizacao-exemplos.css"></style>
