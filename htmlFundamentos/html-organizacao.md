---
title: HTML Fundamentos
---

[← Fundamentos HTML](/htmlFundamentos/)

# Organização e Pontos de Atenção

<p class="lesson-subtitle">Documento profissional · Hierarquia de headings · Acessibilidade · Erros comuns · SEO</p>

Com [tags e elementos](/htmlFundamentos/html-tags-elementos) dominados, esta aula foca em algo diferente: **como organizar** tudo isso em um documento que funciona bem para usuários, para leitores de tela e para buscadores e nos erros mais comuns que quebram essa promessa.

## 1. Um `<head>` completo

O `<head>` de uma página real tem mais do que `<title>`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nome da Página - Nome do Site</title>
  <meta name="description" content="Um resumo de até 160 caracteres sobre o conteúdo desta página." />
  <link rel="icon" href="/favicon.png" />
  <link rel="stylesheet" href="/estilos.css" />
</head>
```

| Tag | Por que importa |
| --- | --- |
| `<meta charset="UTF-8">` | Define a codificação de caracteres, sem isso, acentos podem quebrar |
| `<meta name="viewport">` | Sem isso, a página não se adapta a telas de celular |
| `<title>` | Aparece na aba do navegador **e** como link clicável nos resultados de busca |
| `<meta name="description">` | O resumo que aparece abaixo do título nos resultados de busca |
| `<link rel="icon">` | O favicon, o ícone da aba |

[Simular resultado de busca ao vivo →](/htmlFundamentos/html-organizacao-exemplos#seo)

## 2. Hierarquia de headings

Headings formam o **esqueleto** (outline) da página, ferramentas de acessibilidade e buscadores usam essa hierarquia para entender a estrutura do conteúdo.

::: tip Boa prática
Use exatamente **um** `<h1>` por página (o assunto principal) e não **pule níveis** ao descer (não vá de `<h2>` direto para `<h4>`). Se o texto "parece que devia ser menor", mude o CSS e não pule o nível do heading.
:::

```html
<!-- correto: desce um nível de cada vez -->
<h1>Blog de Receitas</h1>
  <h2>Sobremesas</h2>
    <h3>Bolo de Chocolate</h3>
  <h2>Massas</h2>

<!-- incorreto: pulou de h2 para h4 -->
<h1>Blog de Receitas</h1>
  <h2>Sobremesas</h2>
    <h4>Bolo de Chocolate</h4>
```

[Testar o verificador de outline →](/htmlFundamentos/html-organizacao-exemplos#outline)

## 3. Acessibilidade básica

Acessibilidade não é um recurso "extra", é fazer a página funcionar para **todo mundo**, inclusive quem usa leitor de tela ou navega só pelo teclado.

| Prática | Por quê |
| --- | --- |
| `alt` descritivo em `<img>` | É o que um leitor de tela anuncia no lugar da imagem |
| `<label for="id">` associado ao input | Sem isso, um leitor de tela não sabe o que aquele campo pede |
| Tags semânticas (`nav`, `main`, `aside`...) | Leitores de tela oferecem atalhos para "pular para o conteúdo principal" |
| Não pular níveis de heading | Leitores de tela navegam a página *pela hierarquia de headings* |
| Contraste de cor suficiente | Ver a [Aula 01 de CSS](/cssFundamentos/css-introducao#cores), texto precisa ser legível |

[Testar label e alt text ao vivo →](/htmlFundamentos/html-organizacao-exemplos#acessibilidade)

## 4. Erros comuns

<div class="mistake-compare">
  <div class="mistake-card bad">
    <h5>❌ Tag não fechada</h5>
    <pre><code>&lt;p&gt;Primeiro parágrafo
&lt;p&gt;Segundo parágrafo</code></pre>
  </div>
  <div class="mistake-card good">
    <h5>✅ Sempre feche</h5>
    <pre><code>&lt;p&gt;Primeiro parágrafo&lt;/p&gt;
&lt;p&gt;Segundo parágrafo&lt;/p&gt;</code></pre>
  </div>
</div>

<div class="mistake-compare">
  <div class="mistake-card bad">
    <h5>❌ "Divitis" tudo é div</h5>
    <pre><code>&lt;div class="header"&gt;
  &lt;div class="nav"&gt;...&lt;/div&gt;
&lt;/div&gt;
&lt;div class="footer"&gt;...&lt;/div&gt;</code></pre>
  </div>
  <div class="mistake-card good">
    <h5>✅ Tags semânticas</h5>
    <pre><code>&lt;header&gt;
  &lt;nav&gt;...&lt;/nav&gt;
&lt;/header&gt;
&lt;footer&gt;...&lt;/footer&gt;</code></pre>
  </div>
</div>

<div class="mistake-compare">
  <div class="mistake-card bad">
    <h5>❌ IDs duplicados</h5>
    <pre><code>&lt;div id="card"&gt;A&lt;/div&gt;
&lt;div id="card"&gt;B&lt;/div&gt;</code></pre>
  </div>
  <div class="mistake-card good">
    <h5>✅ id único, class repetível</h5>
    <pre><code>&lt;div class="card" id="card-a"&gt;A&lt;/div&gt;
&lt;div class="card" id="card-b"&gt;B&lt;/div&gt;</code></pre>
  </div>
</div>

::: tip Como validar
O [W3C Markup Validator](https://validator.w3.org/) analisa seu HTML e aponta tags não fechadas, aninhamento inválido, atributos incorretos e outros erros, vale rodar seu código nele de vez em quando.
:::

## 5. SEO básico

O que os buscadores mais olham em uma página HTML bem organizada:

- `<title>` único e descritivo por página (até ~60 caracteres para não ser cortado).
- `<meta name="description">` resumindo a página (até ~160 caracteres).
- Um único `<h1>` que resume o assunto da página.
- Tags semânticas (`article`, `nav`...) ajudam o buscador a entender a estrutura.
- `alt` em imagens, inclusive imagens aparecem em buscas por imagem.

## 6. Boas práticas

- Organize o `<head>` com charset, viewport, title e description sempre presentes.
- Um `<h1>` por página; desça a hierarquia de headings sem pular níveis.
- `alt` em toda imagem informativa; `<label for>` em todo campo de formulário.
- Prefira tags semânticas a `<div>`/`<span>` sempre que uma delas descrever o papel do bloco.
- `id` é único por página; `class` pode (e deve) se repetir.
- Valide o HTML de vez em quando, muitos bugs "de CSS" na verdade são HTML mal-formado.

<style scoped src="./shared.css"></style>
<style scoped src="./html-organizacao.css"></style>
