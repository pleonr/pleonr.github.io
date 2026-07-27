---
title: HTML Fundamentos
---

[← Fundamentos HTML](/htmlFundamentos/)

# Tags e Elementos

<p class="lesson-subtitle">Texto · Listas · Links e Mídia · Tabelas · Formulários · Tags Semânticas</p>

Com a estrutura básica da [Aula 01](/htmlFundamentos/html-introducao) em mãos, esta aula percorre as tags que você mais vai usar no dia a dia para montar o conteúdo de uma página real.

## 1. Tags de texto

| Tag | Função |
| --- | --- |
| `<h1>`–`<h6>` | Títulos, do mais (h1) ao menos (h6) importante |
| `<p>` | Parágrafo |
| `<strong>` | Texto de **importância** (em negrito por padrão) |
| `<em>` | Texto com **ênfase** (em itálico por padrão) |
| `<small>` | Comentários colaterais, observações de menor relevância |
| `<s>` | Conteúdo desatualizado ou que não é mais relevante |
| `<sup>` | Conteúdo sobrescrito |
| `<sub>` | Conteúdo subscrito |
| `<mark>` | Trecho evidenciado |
| `<code>` | Trecho de código de programas de computador |
| `<span>` | Contêiner **inline** genérico, sem significado próprio só um gancho para CSS/JS |
| `<b>` / `<i>` | Negrito e itálico apenas visuais, sem significado semântico |
| `<br>` | Quebra de linha |
| `<pre>` | Texto pré-formatado, preserva espaçamento e quebras de linha |
| `<hr>` | Linha horizontal separa temas/seções |
| `<q>` | Citação curta em meio a outro conteúdo |
| `<blockquote>` | Citação longa, de outra fonte |
| `<cite>` | Título de uma obra, artigo, livro, programa etc. |
| `<abbr>` | Abreviações com o texto expandido em `title` |

```html
<h1>Título principal da página</h1>
<h2>Uma seção</h2>
<p>Um parágrafo com uma palavra <strong>importante</strong> e outra em <em>ênfase</em>.</p>
<blockquote>"O melhor código é aquele que não precisa de comentários." </blockquote>
```

<div class="heading-demo">
  <h1>Heading 1 <small>&lt;h1&gt;</small></h1>
  <h2>Heading 2 <small>&lt;h2&gt;</small></h2>
  <h3>Heading 3 <small>&lt;h3&gt;</small></h3>
  <h4>Heading 4 <small>&lt;h4&gt;</small></h4>
  <h5>Heading 5 <small>&lt;h5&gt;</small></h5>
  <h6>Heading 6 <small>&lt;h6&gt;</small></h6>
</div>

[Ver hierarquia de headings ao vivo →](/htmlFundamentos/html-tags-elementos-exemplos#headings)

::: tip Boa prática
`<strong>` e `<em>` carregam **significado** (importância/ênfase) inclusive para leitores de tela. `<b>` e `<i>` só mudam a aparência visual, sem significado. Prefira sempre `<strong>`/`<em>`.
:::

[Testar tags de texto ao vivo →](/htmlFundamentos/html-tags-elementos-exemplos#texto)

`<q>` e `<blockquote>` merecem atenção à parte: os dois marcam citações, mas em contextos diferentes. `<q>` é
**em linha**, para uma citação curta dentro de uma frase, e o navegador insere as aspas automaticamente ao redor
do conteúdo, então você não deve digitá-las no HTML. `<blockquote>` é **em bloco**, para uma citação longa que
se destaca do texto ao redor, geralmente acompanhada de um `<footer>` indicando o autor. Ambos aceitam um
atributo `cite` (uma URL apontando para a fonte original, que não é exibido na página). Se a atribuição citar o
**título de uma obra** (um livro, um artigo), use `<cite>` dentro do `<footer>` para marcar esse título.

```html
<p>Como dizia Leonardo da Vinci: <q>a simplicidade é o último grau de sofisticação</q>.</p>

<blockquote cite="https://exemplo.com/fonte">
  <p>A simplicidade é o último grau de sofisticação.</p>
  <footer>Leonardo da Vinci</footer>
</blockquote>
```

[Comparar `<q>` e `<blockquote>` ao vivo →](/htmlFundamentos/html-tags-elementos-exemplos#citacoes)

## 2. Listas

| Tag | Uso |
| --- | --- |
| `<ul>` / `<li>` | Lista **não ordenada** (bolinhas) quando a ordem não importa |
| `<ol>` / `<li>` | Lista **ordenada** (números) quando a ordem importa (passo a passo) |
| `<dl>` / `<dt>` / `<dd>` | Lista de **definição** pares termo/descrição |

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<ol>
  <li>Instale as dependências</li>
  <li>Rode o servidor</li>
  <li>Abra o navegador</li>
</ol>

<dl>
  <dt>HTML</dt>
  <dd>Estrutura o conteúdo</dd>
  <dt>CSS</dt>
  <dd>Estiliza a apresentação</dd>
</dl>
```

<div class="list-demo-row">
  <div class="list-demo-card">
    <p class="list-demo-label">&lt;ul&gt; não ordenada</p>
    <ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul>
  </div>
  <div class="list-demo-card">
    <p class="list-demo-label">&lt;ol&gt; ordenada</p>
    <ol><li>Instale as dependências</li><li>Rode o servidor</li><li>Abra o navegador</li></ol>
  </div>
  <div class="list-demo-card">
    <p class="list-demo-label">&lt;dl&gt; definição</p>
    <dl><dt>HTML</dt><dd>Estrutura o conteúdo</dd><dt>CSS</dt><dd>Estiliza a apresentação</dd></dl>
  </div>
</div>

## 3. Hiperlinks

A capacidade da linguagem HTML de expressar relacionamentos entre documentos é um dos fatores-chave para o sucesso
da Web. Os hiperlinks, como chamamos essas ligações, conectam um documento a outro, no mesmo site ou em sites
diferentes, através de palavras, imagens, vídeos e outros elementos. Esse emaranhado de ligações é a origem do
termo *web*: uma grande teia de informação, cujo caminho a seguir depende das escolhas de quem navega.

Em HTML, criamos hiperlinks com a tag `<a>` (de *anchor*, âncora). Para que ela funcione como link, o atributo
`href` precisa estar presente com o endereço do recurso. Ao clicar sobre o conteúdo do link (texto, imagem etc.),
o navegador leva a pessoa usuária até o recurso informado.

```html
<a href="https://leon.dev.br">Visite o blog</a>
```

### Caminhos absolutos e relativos

O valor de `href` pode apontar para um recurso de formas diferentes:

| Tipo | Exemplo | Quando usar |
| --- | --- | --- |
| **URL absoluta** | `href="https://leon.dev.br/sobre"` | Aponta para um recurso fora do site atual, com o endereço completo |
| **Caminho relativo** | `href="sobre.html"` ou `href="./imagens/logo.png"` | Aponta para um recurso dentro do próprio site, relativo ao arquivo atual |
| **Caminho relativo à raiz** | `href="/sobre"` | Sempre parte da raiz do site, não importa em qual página o link está |

Um caminho relativo é sempre resolvido a partir da localização do arquivo HTML atual:

```html
<!-- Estando em /produtos/tenis.html -->
<a href="camiseta.html">Camiseta</a>  <!-- resolve para /produtos/camiseta.html -->
<a href="../sobre.html">Sobre</a>     <!-- ../ sobe um nível: resolve para /sobre.html -->
<a href="/contato.html">Contato</a>   <!-- / sempre parte da raiz do site -->
```

::: tip Por que preferir caminhos relativos
Dentro do mesmo site, caminhos relativos são mais fáceis de manter: se o site inteiro mudar de domínio, os links
internos continuam funcionando sem precisar reescrever cada `href`. Reserve URLs absolutas para links que
apontam para **fora** do seu site.
:::

### Âncoras: navegando dentro da página

Além de levar a outro documento, um link pode apontar para um ponto específico **dentro da mesma página** (ou de
outra). Para isso, o elemento de destino precisa de um `id`, e o `href` do link aponta para esse `id` prefixado
por `#`:

```html
<nav>
  <a href="#instalacao">Instalação</a>
  <a href="#uso">Uso</a>
</nav>

<h2 id="instalacao">Instalação</h2>
<p>...</p>

<h2 id="uso">Uso</h2>
<p>...</p>
```

O mesmo mecanismo funciona entre páginas diferentes: `href="sobre.html#equipe"` abre `sobre.html` e rola direto
até o elemento com `id="equipe"`. Um `href="#topo"` (com um elemento `id="topo"` no início da página) é a forma
mais comum de criar um link de "voltar ao topo".

### Download de arquivos

Quando o `href` aponta para um arquivo (um PDF, uma planilha, uma imagem), o comportamento padrão do navegador
varia: PDFs e imagens, por exemplo, costumam abrir direto no navegador em vez de baixar. O atributo booleano
`download` força o navegador a baixar o arquivo em vez de exibi-lo:

```html
<a href="/arquivos/relatorio.pdf" download>Baixar relatório (PDF)</a>

<!-- download também aceita um valor: o nome do arquivo ao ser salvo -->
<a href="/arquivos/relatorio-v2.pdf" download="relatorio-2024.pdf">Baixar relatório</a>
```

::: tip Boa prática
`download` só funciona de forma confiável para arquivos do **mesmo site** (mesma origem). Para arquivos
hospedados em outro domínio, o navegador costuma ignorar o atributo e abrir o link normalmente.
:::

### O atributo `target`

O atributo `target` diz ao navegador onde o recurso deve ser apresentado (contexto de navegação):

- `_blank`: abre o recurso em nova janela ou aba.
- `_self` (padrão): abre no mesmo contexto de navegação do documento de origem.
- `_parent`: abre no contexto de navegação pai.
- `_top`: abre no contexto de navegação mais elevado da página.

```html
<a href="https://leon.dev.br" target="_blank" rel="noopener noreferrer">Abrir em nova aba</a>
```

::: tip Boa prática
Ao usar `target="_blank"`, adicione `rel="noopener noreferrer"`. Sem isso, a página aberta ganha acesso, via
JavaScript, à página de origem (`window.opener`), o que é um risco de segurança.
:::

### Outros valores de `href`

Nem todo `href` aponta para um recurso via HTTP:

| Tipo | Exemplo | Uso |
| --- | --- | --- |
| E-mail | `href="mailto:contato@leon.dev.br"` | Abre o cliente de e-mail padrão com o destinatário preenchido |
| Telefone | `href="tel:+5511999999999"` | Em dispositivos móveis, oferece ligar para o número |
| Âncora | `href="#secao"` | Navega até o elemento com esse `id` na página |
| JavaScript | `href="javascript:void(0)"` | Evita a navegação, usando o link só como gatilho de um evento (evite; prefira `<button>`) |

## 4. Multimídia

Além de texto, uma página pode incorporar imagens, áudio e vídeo diretamente, sem depender de plugins externos.

### Imagens (`<img>`)

`<img>` é um elemento vazio (sem conteúdo, sem tag de fechamento) que embute uma imagem através do atributo `src`.

```html
<img src="grafico.png" alt="Gráfico de vendas do trimestre" width="600" height="400" loading="lazy" />
```

| Atributo | Função |
| --- | --- |
| `src` | Caminho da imagem (absoluto ou relativo, como visto nos hiperlinks) |
| `alt` | Texto alternativo, lido por leitores de tela e exibido se a imagem falhar. **Não é opcional** |
| `width` / `height` | Dimensões em pixels. Ajudam o navegador a reservar o espaço da imagem antes dela carregar, evitando que o layout "pule" quando o arquivo termina de baixar |
| `loading="lazy"` | Adia o carregamento de imagens fora da tela até o usuário rolar perto delas, melhora o tempo de carregamento inicial |
| `title` | Texto de dica (*tooltip*) ao passar o mouse |

::: tip Boa prática
Sempre informe `alt`. Para imagens com informação (gráficos, fotos de produto), descreva o conteúdo. Para imagens puramente decorativas, use `alt=""` (vazio, mas presente): assim leitores de tela pulam a imagem, em vez de ler o nome do arquivo em voz alta.
:::

[Testar propriedades de imagem ao vivo →](/htmlFundamentos/html-tags-elementos-exemplos#imagem)

### `<figure>` e `<figcaption>`

Quando uma imagem (ou outro conteúdo) tem uma legenda associada, `<figure>` agrupa os dois em uma única unidade semântica:

```html
<figure>
  <img src="grafico.png" alt="Gráfico de vendas do trimestre" width="300" />
  <figcaption>Vendas cresceram 20% no último trimestre.</figcaption>
</figure>
```

<div class="figure-demo">
  <figure>
    <div class="img-placeholder">🖼️ imagem</div>
    <figcaption>&lt;figcaption&gt;: legenda associada à imagem</figcaption>
  </figure>
</div>

### Áudio (`<audio>`)

```html
<audio controls>
  <source src="musica.mp3" type="audio/mpeg" />
  <source src="musica.ogg" type="audio/ogg" />
  Seu navegador não suporta áudio incorporado.
</audio>
```

| Atributo | Função |
| --- | --- |
| `controls` | Exibe os controles padrão do navegador (play, volume, tempo) |
| `autoplay` | Inicia a reprodução automaticamente. A maioria dos navegadores só permite junto com `muted` |
| `loop` | Repete a reprodução ao terminar |
| `muted` | Inicia sem som |
| `<source>` | Um formato de arquivo por elemento. O navegador escolhe o primeiro que reconhece |

### Vídeo (`<video>`)

```html
<video controls width="480" poster="capa.jpg">
  <source src="aula.mp4" type="video/mp4" />
  <source src="aula.webm" type="video/webm" />
  Seu navegador não suporta vídeo incorporado.
</video>
```

`<video>` aceita os mesmos atributos de `<audio>` (`controls`, `autoplay`, `loop`, `muted`), além de:

| Atributo | Função |
| --- | --- |
| `width` / `height` | Dimensões do player em pixels |
| `poster` | Imagem exibida antes do vídeo começar a tocar |

<div class="figure-demo">
  <div class="media-card"><span class="media-icon">🔊</span><span class="media-label">&lt;audio controls&gt;</span></div>
  <div class="media-card"><span class="media-icon">🎬</span><span class="media-label">&lt;video controls&gt;</span></div>
</div>

::: tip Boa prática
Ofereça mais de um `<source>` com formatos diferentes (MP3/OGG para áudio, MP4/WebM para vídeo). Nem todo navegador suporta todos os formatos, e o `<audio>`/`<video>` usa automaticamente o primeiro `<source>` que conseguir reproduzir. O texto depois dos `<source>` só aparece em navegadores muito antigos, que não suportam a tag.
:::

## 5. Tabelas

Tabelas são para **dados tabulares** (linhas e colunas relacionadas) nunca para layout de página.

```html
<table>
  <thead>
    <tr><th>Linguagem</th><th>Usada para</th></tr>
  </thead>
  <tbody>
    <tr><td>HTML</td><td>Estrutura</td></tr>
    <tr><td>CSS</td><td colspan="1">Apresentação</td></tr>
  </tbody>
</table>
```

<div class="table-demo-wrap">
  <table class="table-demo">
    <thead><tr><th>Linguagem</th><th>Usada para</th></tr></thead>
    <tbody>
      <tr><td>HTML</td><td>Estrutura</td></tr>
      <tr><td>CSS</td><td>Apresentação</td></tr>
      <tr><td colspan="2" class="span-cell">colspan="2" célula ocupa 2 colunas</td></tr>
    </tbody>
  </table>
</div>

| Atributo | Função |
| --- | --- |
| `colspan="n"` | Célula ocupa `n` colunas |
| `rowspan="n"` | Célula ocupa `n` linhas |
| `<thead>` / `<tbody>` | Agrupam cabeçalho e corpo ajuda leitores de tela e permite estilizar separadamente |

[Montar uma tabela ao vivo →](/htmlFundamentos/html-tags-elementos-exemplos#tabela)

## 6. Formulários

```html
<form action="/enviar" method="POST">
  <label for="nome">Nome</label>
  <input type="text" id="nome" name="nome" required />

  <label for="email">E-mail</label>
  <input type="email" id="email" name="email" required />

  <button type="submit">Enviar</button>
</form>
```

| Elemento | Função |
| --- | --- |
| `<form>` | Agrupa os campos; `action` define para onde enviar, `method` define como (GET/POST) |
| `<label for="id">` | Rótulo **associado** a um campo pelo `for`/`id` essencial para acessibilidade |
| `<input type="...">` | Campo de entrada o `type` muda completamente o comportamento (`text`, `email`, `number`, `checkbox`, `date`...) |
| `<select>` / `<option>` | Lista suspensa |
| `<textarea>` | Texto longo, várias linhas |
| `<button>` | Botão `type="submit"` envia o formulário |

[Testar tipos de input ao vivo →](/htmlFundamentos/html-tags-elementos-exemplos#formulario)

## 7. Tags semânticas de layout

Antes do HTML5, tudo era `<div>`. Hoje existem tags que descrevem o **papel** de cada região da página, mais claro para você, para o navegador e para leitores de tela.

<div class="semantic-layout">
  <div class="sl-header">
    <span><span class="sl-tag">&lt;header&gt;</span><span class="sl-desc">Topo da página ou de uma seção</span></span>
    <span class="sl-nav"><span class="sl-tag">&lt;nav&gt;</span><span class="sl-desc">Links de navegação</span></span>
  </div>
  <div class="sl-main">
    <div class="sl-article"><span class="sl-tag">&lt;main&gt; &gt; &lt;article&gt;</span><span class="sl-desc">Conteúdo principal, independente e autocontido</span></div>
    <div class="sl-aside"><span class="sl-tag">&lt;aside&gt;</span><span class="sl-desc">Conteúdo relacionado, mas secundário</span></div>
  </div>
  <div class="sl-footer"><span class="sl-tag">&lt;footer&gt;</span><span class="sl-desc">Rodapé da página ou de uma seção</span></div>
</div>

| Tag | Quando usar |
| --- | --- |
| `<header>` | Cabeçalho da página (ou de um `<article>`/`<section>`) |
| `<nav>` | Bloco de links de navegação principal |
| `<main>` | Conteúdo principal **um único** por página |
| `<section>` | Agrupamento temático de conteúdo, geralmente com um heading |
| `<article>` | Conteúdo que faz sentido sozinho (um post, uma notícia, um card de produto) |
| `<aside>` | Conteúdo relacionado mas secundário (barra lateral, anúncio, nota) |
| `<footer>` | Rodapé |

::: tip Boa prática
Use `<div>`/`<span>` apenas quando **nenhuma** tag semântica descreve o papel daquele bloco. Se você consegue nomear "isso é a navegação" ou "isso é o rodapé", existe uma tag para isso e ela é mais acessível e mais fácil de estilizar do que uma `<div class="rodape">`.
:::


<style scoped src="./shared.css"></style>
<style scoped src="./html-tags-elementos.css"></style>
