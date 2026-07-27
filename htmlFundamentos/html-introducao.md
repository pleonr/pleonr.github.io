---
title: HTML Fundamentos
---

[← Fundamentos HTML](/htmlFundamentos/)

# Introdução ao HTML

<p class="lesson-subtitle">O que é HTML · Estrutura de um documento · Sintaxe · Aninhamento · Boas práticas</p>

**HTML** (*HyperText Markup Language*) é uma linguagem de marcação utilizada para representar informação na Web. Nasceu juntamente com o conceito da Web e hoje, conjuntamente às linguagens JavaScript e CSS, compõe as bases para o desenvolvimento de soluções frontend neste ecossistema.

Desde seu desenvolvimento, em 1989, a linguagem HTML foi passando por diversas revisões, que culminaram com o lançamento de novas versões da linguagem. Atualmente está em uso a versão 5, motivo pelo qual é comum encontrar citações à linguagem como HTML5.

Antes de propriamente iniciarmos nosso estudo na linguagem HTML5, precisamos entender os atores principais da Web e como eles se comunicam. Obviamente faremos uma simplificação da arquitetura, enfatizando o papel do web browser ou navegador e do web server.

Esse processo de comunicação é feito através de um cliente e um servidor, o cliente envia uma requisição, uma solicitação de recurso, que é recebida pelo servidor e devolvida ao cliente por meio de uma resposta. Esse modelo de arquitetura distribuída é chamada cliente/servidor client/server e define em alto nível como ocorre a comunicação entre web browsers (clientes) e web servers (servidores).

Nesta troca de mensagens está sendo utilizado o protocolo HTTP (Hypertext Transfer Protocol), que por sua vez transporta documentos HTML quando recursos são retornados ao cliente. Logo, grande parte da informação que trafega na Web é representada em HTML.

O HTML é um dos pilares da Web, junto ao protocolo HTTP e o conceito de URI. Define-se como uma linguagem de marcação, ou seja, uma representação de documento em que adicionamos marcas de significado(semântica) e de estrutura à informação.

O conceito de hipertexto é essencial à compreensão do HTML. De forma simples, entendemos como hipertexto um conjunto de nós (palavras, imagens, vídeos, áudios, documentos) que possuem ligações entre si.

A linguagem HTML tornou-se um padrão de referência a partir de 1997, graças ao trabalho da W3C. Isso garantiu à tecnologia interoperabilidade em diferentes plataformas e meios de acesso. A especificação corrente da linguagem está disponível no portal da W3C de forma pública.

::: warning
HTML não é uma linguagem de programação ele não tem lógica, condicionais ou loops. Ele descreve *o que cada pedaço de conteúdo é*, não como deve parecer nem como deve se comportar.
:::


| Camada | Linguagem | Responsabilidade |
| --- | --- | --- |
| Estrutura | **HTML** | O que é cada parte do conteúdo (título, lista, formulário...) |
| Apresentação | [CSS](/cssFundamentos/) | Como o conteúdo aparece (cores, layout, tipografia) |
| Comportamento | [JavaScript](/jsFundamentos/) | Como a página reage e interage |




::: tip Boa prática
Nunca use HTML para controlar aparência (ex: `<b>` só para deixar "grande e chamativo"). Use a tag certa para o **significado** do conteúdo, e deixe o CSS cuidar da aparência. Essa separação de responsabilidades é o mesmo princípio visto na [introdução ao CSS](/cssFundamentos/css-introducao).
:::

## 1. Estrutura básica de um documento

Todo documento HTML segue o mesmo esqueleto:

```html
<!DOCTYPE html>                       <!-- Declaração do tipo de documento (HTML5) -->
<html lang="pt-BR">                   <!-- Tag raiz do documento, idioma inglês -->
<head>                                <!-- Cabeçalho com metadados do documento -->
  <meta charset="UTF-8">              <!-- Define a codificação de caracteres UTF-8 -->
  <title>Hello World!</title>         <!-- Título que aparece na aba do navegador -->
</head>                               <!-- Fim do cabeçalho -->
<body>                                <!-- Corpo do documento (conteúdo visível) -->
  <h1 id="hello">Olá, mundo!</h1>     <!-- Título de nível 1 com id "hello" -->
</body>                               <!-- Fim do corpo -->
</html>                               <!-- Fim do documento HTML -->
```

| Elemento | Função |
| --- | --- |
| `<!DOCTYPE html>` | Diz ao navegador que este é um documento HTML5. Sempre a primeira linha. |
| `<html lang="pt-BR">` | Elemento raiz. O atributo `lang` ajuda leitores de tela e tradutores automáticos. |
| `<head>` | Metadados: título da aba, charset, links para CSS, tags de SEO. Nada aqui aparece na página. |
| `<body>` | Todo o conteúdo visível da página. |

Dentro da tag `<head>` podemos definir os seguintes descendentes(*opcionais*):

- `<meta>`: Permite definir metadados que não podem ser especificados em outras tags.
- `<base`: Define a URL inicial do documento para efeitos de navegação.
- `<title>`: Metadado que define o título do documento ou seu nome. No máximo uma ocorrência é permitida.
- `<link>`: Permite especificar as relações entre o documento e outro recurso externo. Utilizado especialmente
para vincular folhas de estilo. O endereço do recurso vinculado fica no atributo href. Já o atributo rel indica o
tipo de relacionamento estabelecido, que deve considerar um conjunto de opções definidas pela linguagem.
- `<style>`: Permite incluir regras de estilo ao documento.
- `<script>`: Permite definir ou referenciar um script executável (JavaScript). A tag pode aparecer no corpo do
documento e há diferenças entre uma opção e outra.


## 2. Anatomia de uma tag

A linguagem HTML5 é composta por um conjunto de `tags` (ou elementos). Cada tag serve a um propósito,
atribuindo um significado(*semântica*) ao conteúdo envolvido. Quando aplicadas a um documento, a tag é aberta e
fechada, ficando o conteúdo em meio. Observe a sintaxe de escrita:

Abertura da tag: colocamos o nome da tag entre os símbolos de `<` `>`
````html
<p>
````
Fechamento da tag: colocamos uma `/` na frente do nome da tag
````html
</p>
````

A tag `p`, por exemplo, é utilizada para demarcar parágrafos em um documento HTML.
Logo, qualquer conteúdo entre a abertura e o fechamento da tag compreende o conteúdo de um parágrafo. Observe:

```html
<p>Aqui está um novo parágrafo!</p>
```
<br>

<img class="m-auto -z-5 bottom-0 top-0 right-0 max-w-full max-h-full" style="background-color: white" src="/html/anatomyhtml1.png"/>


As tags podem conter atributos, que são propriedades que customizam/modificam comportamentos ou associam valores
específicos aos elementos. Assim como os nomes de tags, os atributos são pré-definidos, não podemos inventar novos.
Os atributos são informados na abertura da tag, por meio do seu nome, símbolo e o respectivo valor entre aspas duplas.

<div class="tag-anatomy">
  <div class="tag-anatomy-code"><span class="ta-bracket">&lt;</span><span class="ta-tag">p</span> <span class="ta-attr">class</span><span class="ta-bracket">=</span><span class="ta-val">"destaque"</span><span class="ta-bracket">&gt;</span><span class="ta-content">Olá, mundo!</span><span class="ta-bracket">&lt;/</span><span class="ta-tag">p</span><span class="ta-bracket">&gt;</span></div>
  <div class="tag-anatomy-labels">
    <span class="ta-lbl-tag">tag (nome do elemento)</span>
    <span class="ta-lbl-attr">atributo</span>
    <span class="ta-lbl-val">valor do atributo</span>
    <span class="ta-lbl-content">conteúdo</span>
  </div>
</div>


<img class="m-auto -z-5 bottom-0 top-0 right-0 max-w-full max-h-full" style="background-color: white" src="/html/anatomyhtml.png"/>

Uma **tag** é o marcador (`<p>`); um **elemento** é a tag de abertura + conteúdo + tag de fechamento; um **atributo** é uma informação extra sobre o elemento, sempre `nome="valor"`.

::: tip Boa prática
Sempre use aspas nos valores de atributo (`class="destaque"`, não `class=destaque`) e escreva nomes de tag em minúsculas. Não é estritamente obrigatório no HTML5, mas é o padrão esperado em qualquer código profissional.
:::

## 3. Elementos com conteúdo × elementos vazios

Alguns elementos têm conteúdo entre a tag de abertura e a de fechamento; outros são **vazios** (*void elements*) não têm conteúdo nem tag de fechamento, porque a informação inteira já está nos atributos.

<div class="void-compare">
  <div class="void-card">
    <h5>Com conteúdo</h5>
    <code>&lt;p&gt;texto&lt;/p&gt;</code>
    <code>&lt;a href="#"&gt;link&lt;/a&gt;</code>
    <code>&lt;li&gt;item&lt;/li&gt;</code>
  </div>
  <div class="void-card">
    <h5>Vazios (void)</h5>
    <code>&lt;img src="foto.jpg" /&gt;</code>
    <code>&lt;br /&gt;</code>
    <code>&lt;input type="text" /&gt;</code>
    <code>&lt;meta charset="UTF-8" /&gt;</code>
  </div>
</div>

::: tip Boa prática
Elementos void nunca precisam de `/` de fechamento em HTML5 (`<br>` já é válido), mas escrever `<br />` continua funcionando e deixa claro, visualmente, que a tag não tem fechamento separado. Escolha um estilo e seja consistente no projeto.
:::

## 4. Aninhamento e hierarquia

Elementos HTML formam uma **árvore**: um elemento pode conter outros elementos (filhos), que por sua vez podem conter outros (netos). Um elemento aberto dentro de outro precisa ser fechado *antes* do pai aninhamento cruzado (`<b><i>texto</b></i>`) é inválido.

<div class="tree-demo">
  <ul>
    <li><span class="tree-tag">&lt;body&gt;</span>
      <ul>
        <li><span class="tree-tag">&lt;header&gt;</span> <span class="tree-note">pai de nav</span>
          <ul><li><span class="tree-tag">&lt;nav&gt;</span></li></ul>
        </li>
        <li><span class="tree-tag">&lt;main&gt;</span> <span class="tree-note">pai de section</span>
          <ul><li><span class="tree-tag">&lt;section&gt;</span>
            <ul><li><span class="tree-tag">&lt;p&gt;</span> <span class="tree-note">filho de section, neto de main</span></li></ul>
          </li></ul>
        </li>
      </ul>
    </li>
  </ul>
</div>

```html
<!-- válido: fecha na ordem inversa da abertura -->
<b><i>texto em negrito e itálico</i></b>

<!-- inválido: aninhamento cruzado -->
<b><i>texto</b></i>
```

[Ver a árvore de um documento inteiro →](/htmlFundamentos/html-introducao-exemplos#arvore)

## 5. Atributos globais

Alguns atributos podem ser usados em (quase) qualquer elemento:

| Atributo | Função |
| --- | --- |
| `id` | Identificador único na página (para âncoras ou CSS/JS) |
| `class` | Uma ou mais classes, separadas por espaço, para estilizar com CSS |
| `style` | CSS inline *evite*, como visto na [Aula 01 de CSS](/cssFundamentos/css-introducao#como-aplicar-css-ao-html) |
| `title` | Texto de dica (*tooltip*) ao passar o mouse |
| `lang` | Idioma do conteúdo daquele elemento |
| `data-*` | Atributo customizado para guardar dados (ex: `data-id="42"`), lido via JavaScript |

[Testar atributos ao vivo →](/htmlFundamentos/html-introducao-exemplos#atributos)

## 6. Comentários

```html
<!-- Isto é um comentário ... não aparece na página renderizada -->
<p>Conteúdo visível</p>
```

## 7. Boas práticas

- Sempre comece com `<!DOCTYPE html>` e declare `lang` no `<html>`.
- Use tags em **minúsculas** e sempre **feche** as tags que exigem fechamento.
- Coloque valores de atributo entre **aspas**.
- **Indente** o código seguindo o aninhamento facilita enxergar a árvore de elementos.
- Escolha a tag pelo **significado**, não pela aparência padrão do navegador.
- Um único `<h1>` por página, representando o assunto principal.
- No vscode abra um novo arquivo, salve como nome.html, digite ! e aperte enter.

<style scoped src="./shared.css"></style>
<style scoped src="./html-introducao.css"></style>
