---
title: "CSS Fundamentos: Aula 02"
---

[← Fundamentos CSS](/cssFundamentos/)

# Propriedades CSS

<p class="lesson-subtitle">Tipografia · Cores e Fundos · Bordas e Sombras · Transições e Transforms · Pseudo-classes · Variáveis</p>

Com a sintaxe e os seletores da [Aula 01](/cssFundamentos/css-introducao) em mãos, esta aula percorre as propriedades que você mais vai usar no dia a dia para estilizar texto, cores, bordas e criar pequenas animações: a base visual antes de entrar em layout (Box Model, Flexbox) na [Aula 03](/cssFundamentos/css-fundamentos).

## 1. Tipografia

| Propriedade | Função | Exemplo |
| --- | --- | --- |
| `font-family` | Define a fonte, com uma lista de fallback | `font-family: 'Segoe UI', system-ui, sans-serif;` |
| `font-size` | Tamanho do texto | `font-size: 1.125rem;` |
| `font-weight` | Peso/espessura | `font-weight: 700;` (ou `normal`, `bold`) |
| `font-style` | Itálico | `font-style: italic;` |
| `line-height` | Altura da linha | `line-height: 1.6;` |
| `text-align` | Alinhamento horizontal | `text-align: center;` |
| `text-decoration` | Sublinhado, tachado | `text-decoration: underline;` |
| `text-transform` | Maiúsculas/minúsculas | `text-transform: uppercase;` |
| `letter-spacing` | Espaço entre letras | `letter-spacing: 0.05em;` |

```css
.artigo {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; /* fallback stack */
  font-size: 1.125rem;
  line-height: 1.7;         /* sem unidade = múltiplo do font-size, escala melhor */
  color: #1a1a2e;
  max-width: 65ch;          /* ch = largura do caractere "0"; controla legibilidade */
}

.artigo h2 {
  font-weight: 700;
  letter-spacing: -0.01em;  /* aperta um pouco em títulos grandes */
}
```

<div class="type-demo">
  <p class="type-h">Título de exemplo</p>
  <p class="type-p">Este parágrafo usa <code>line-height: 1.7</code> e <code>max-width: 65ch</code>, valores que tornam blocos de texto confortáveis de ler: nem linhas muito longas, nem muito apertadas.</p>
</div>

::: tip Boas práticas
Use `line-height` **sem unidade** (ex: `1.6`, não `24px`); assim ele escala proporcionalmente se o `font-size` mudar. Limite a largura de blocos de texto a ~65-75 caracteres (`max-width: 65ch`) para manter a leitura confortável. Prefira `rem` para `font-size`, como visto na Aula 01.
:::

[Ajustar tipografia ao vivo →](/cssFundamentos/css-propriedades-exemplos#tipografia)

## 2. Cores e fundos

| Propriedade | Função |
| --- | --- |
| `color` | Cor do texto |
| `background-color` | Cor de fundo |
| `background-image` | Imagem ou gradiente de fundo |
| `background-size` | Tamanho da imagem de fundo (`cover`, `contain`, valores) |
| `background-position` | Posição da imagem de fundo |
| `background-repeat` | Se a imagem repete (`no-repeat`, `repeat-x`...) |

```css
.hero {
  background-color: #1e1e2e; /* usado como fallback enquanto a imagem carrega */
  background-image: linear-gradient(135deg, #4a6cf7, #89dceb);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* shorthand: mesma ideia em uma linha */
.hero {
  background: #1e1e2e linear-gradient(135deg, #4a6cf7, #89dceb) center / cover no-repeat;
}
```

<div class="bg-demo-row">
  <div class="bg-demo bg-solid">background-color</div>
  <div class="bg-demo bg-gradient">linear-gradient()</div>
  <div class="bg-demo bg-radial">radial-gradient()</div>
</div>

## 3. Bordas, raios e sombras

```css
.card {
  border: 1px solid #e2e8f0;          /* shorthand: largura estilo cor */
  border-radius: 10px;                /* cantos arredondados */
  box-shadow: 0 4px 12px rgba(0,0,0,.1); /* x y blur cor */
}

.pilula   { border-radius: 999px; }    /* valor bem alto = formato de pílula */
.circulo  { border-radius: 50%; }      /* em um quadrado, vira círculo */

.destaque {
  box-shadow:
    0 1px 2px rgba(0,0,0,.06),         /* várias sombras, separadas por vírgula */
    0 8px 24px rgba(74,108,247,.25);
}

.titulo-marcado {
  text-shadow: 1px 1px 2px rgba(0,0,0,.3); /* sombra em texto */
}
```

<div class="shadow-demo-row">
  <div class="shadow-card shadow-sm">border-radius: 10px<br>box-shadow leve</div>
  <div class="shadow-card shadow-lg">border-radius: 16px<br>box-shadow forte</div>
  <div class="shadow-card shadow-pill">border-radius: 999px</div>
</div>

::: tip Boa prática
`box-shadow` aceita a palavra-chave `inset` para criar uma sombra *interna* (`box-shadow: inset 0 2px 4px rgba(0,0,0,.2)`), útil para simular campos de formulário "afundados".
:::

[Brincar com sombras e raios →](/cssFundamentos/css-propriedades-exemplos#sombras)

## 4. Transições e Transforms

`transition` anima a mudança de uma propriedade CSS ao longo do tempo; `transform` move, gira, escala ou distorce um elemento **sem afetar o fluxo do layout**.

```css
.botao {
  transform: scale(1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.botao:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(74,108,247,.35);
}

.card-flip {
  transform: rotate(-2deg) translateY(-4px); /* combina múltiplas transformações */
}
```

| Função de `transform` | Efeito |
| --- | --- |
| `translate(x, y)` | Move o elemento |
| `scale(n)` | Aumenta/diminui o tamanho |
| `rotate(deg)` | Rotaciona |
| `skew(deg)` | Inclina |

<div class="hover-demo-row">
  <button class="hover-btn hover-btn-scale">hover: scale</button>
  <button class="hover-btn hover-btn-lift">hover: translateY</button>
  <button class="hover-btn hover-btn-rotate">hover: rotate</button>
</div>

::: tip Boa prática
Anime `transform` e `opacity` sempre que possível: o navegador consegue acelerar essas duas propriedades via GPU. Evite animar `width`, `height`, `margin` ou `top`/`left` diretamente: elas forçam o navegador a recalcular o layout inteiro a cada frame (*reflow*), o que é bem mais custoso.
:::

[Testar transform ao vivo →](/cssFundamentos/css-propriedades-exemplos#transform)

## 5. Pseudo-classes e pseudo-elementos

**Pseudo-classes** selecionam um elemento com base em um *estado* ou *posição*; **pseudo-elementos** criam ou visam uma parte específica do elemento.

| Seletor | Tipo | Descrição |
| --- | --- | --- |
| `:hover` | Pseudo-classe | Enquanto o mouse está sobre o elemento |
| `:focus` | Pseudo-classe | Enquanto o elemento tem foco (ex: um input) |
| `:active` | Pseudo-classe | Durante o clique |
| `:first-child` / `:last-child` | Pseudo-classe | Primeiro/último filho do pai |
| `:nth-child(n)` | Pseudo-classe | Filho de posição `n` (aceita fórmulas como `2n`) |
| `:not(seletor)` | Pseudo-classe | Exclui elementos que casam com o seletor |
| `::before` / `::after` | Pseudo-elemento | Insere conteúdo gerado antes/depois do elemento |

```css
input:focus { outline: 2px solid #4a6cf7; }

tr:nth-child(even) { background: #f8faff; } /* zebra striping */

.obrigatorio::after {
  content: " *";     /* pseudo-elementos exigem a propriedade content */
  color: #e07070;
}

.tooltip::before {
  content: attr(data-tooltip); /* pode até ler um atributo do HTML */
  position: absolute;
  /* ... */
}
```

<table class="zebra-demo">
  <tbody>
    <tr><td>Linha 1</td></tr>
    <tr><td>Linha 2 (par)</td></tr>
    <tr><td>Linha 3</td></tr>
    <tr><td>Linha 4 (par)</td></tr>
  </tbody>
</table>

[Ver pseudo-classes em ação →](/cssFundamentos/css-propriedades-exemplos#pseudo)

## 6. Variáveis CSS (custom properties)

Variáveis CSS armazenam um valor que pode ser reutilizado (e alterado dinamicamente, inclusive via JavaScript) em qualquer lugar do documento com `var()`.

```css
:root {
  --cor-marca: #4a6cf7;
  --cor-marca-escura: #3558e0;
  --espaco: 16px;
}

.botao {
  background: var(--cor-marca);
  padding: var(--espaco);
}

.botao:hover {
  background: var(--cor-marca-escura);
}

/* var() aceita um valor de fallback como segundo argumento */
.card { border-radius: var(--raio, 8px); }
```

<div class="theme-demo" style="--demo-brand:#4a6cf7">
  <div class="theme-demo-card">Cartão usando <code>var(--demo-brand)</code></div>
</div>

::: tip Boa prática
Declare variáveis globais em `:root` para cores de marca, espaçamentos e raios usados em todo o site. Isso centraliza o "design system" do projeto em um único lugar: trocar uma cor de marca vira uma alteração de uma linha, em vez de um *find & replace* por todo o CSS.
:::

[Trocar tema com variáveis →](/cssFundamentos/css-propriedades-exemplos#variaveis)

## 7. Boas práticas gerais

- **Nomeie classes pelo que o elemento *é***, não pela aparência (`.card-alerta`, não `.vermelho`).
- Considere uma convenção como **BEM** (`bloco__elemento--modificador`) em projetos maiores, para evitar colisão de nomes.
- Evite seletores aninhados e profundos (`.a .b .c .d`); prefira uma classe direta no elemento-alvo.
- Centralize cores, espaçamentos e raios em **variáveis CSS**.
- Pense **mobile-first**: escreva os estilos base para telas pequenas e use `@media (min-width: ...)` para adicionar complexidade em telas maiores.
- Evite `!important`; se você "precisa" dele, normalmente é sinal de especificidade mal planejada em outro lugar do CSS.

## 8. Exercícios

1. **Tipografia**: Estilize um artigo de blog: título com `font-weight: 700`, parágrafos com `line-height: 1.6` e `max-width: 65ch`, e uma citação (`blockquote`) com `font-style: italic`.
2. **Fundos**: Crie um card com `background` combinando uma cor sólida de fallback e um `linear-gradient()`.
3. **Sombras**: Crie três variações de um mesmo card (`border-radius` + `box-shadow`): sombra leve, sombra forte e formato pílula.
4. **Transições**: Faça um botão que cresce (`scale`) e ganha sombra ao passar o mouse, com `transition` suave.
5. **Pseudo-elementos**: Use `::after` para adicionar um asterisco vermelho automaticamente em labels de campos obrigatórios de um formulário.
6. **Variáveis**: Defina `--cor-marca` em `:root` e use-a em pelo menos três componentes diferentes da página. Troque o valor uma vez e confirme que os três mudam juntos.

---

**Aula anterior:** [Aula 01: Introdução ao CSS](/cssFundamentos/css-introducao) · **Próxima aula:** [Aula 03: Box Model, Posicionamento, Display e Flexbox →](/cssFundamentos/css-fundamentos)

<style scoped src="./shared.css"></style>
<style scoped src="./css-propriedades.css"></style>
