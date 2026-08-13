---
title: LaTeX
---

# LaTeX

O [LaTeX](https://www.latex-project.org/about/), que é pronunciado «lah-tech» ou «lay-tech», é um sistema de preparação de documentos. Ele inclui recursos projetados para a produção de documentação técnica e científica. O LaTeX é o padrão de fato para a comunicação e publicação de documentos científicos.

O LaTeX está disponível como software livre: você não precisa pagar pelo seu uso, ou seja, não há taxas de licença, etc. Mas, é claro, você é convidado a apoiar os esforços de manutenção e desenvolvimento por meio de uma doação para o [grupo de usuários do TeX](https://www.tug.org/donate.html).

O LaTeX não é um editor WYSIWYG (*What You See Is What You Get*), mas sim um sistema de preparação de documentos. O usuário escreve um arquivo de texto simples com comandos de marcação, e o LaTeX processa esse arquivo, gerando documentos tipograficamente refinados (PDF, DVI, PS).

## História

O LaTeX foi criado na década de 1980 por Leslie Lamport, baseado no TeX de Donald Knuth, desenvolvido em 1978 (ambos vencedores do prêmio Turing).

Enquanto o TeX focava na tipografia de alta qualidade, o LaTeX surgiu para simplificar seu uso, fornecendo macros e comandos de alto nível que facilitaram a produção de documentos científicos e acadêmicos.

<div class="latex-portraits">
  <figure>
    <img src="/latex/Leslie-Lamport.png" alt="Leslie Lamport" />
    <figcaption>Leslie Lamport</figcaption>
  </figure>
  <figure>
    <img src="/latex/Donald-Knuth.jpg" alt="Donald Knuth" />
    <figcaption>Donald Knuth</figcaption>
  </figure>
</div>

A principal motivação do LaTeX foi oferecer uma ferramenta que garantisse:

- **Qualidade tipográfica superior**, especialmente em fórmulas matemáticas.
- **Consistência** em documentos longos, como teses, artigos e livros.
- **Automação** de referências, citações, sumários e listas de figuras/tabelas.
- **Portabilidade** e independência de plataforma.

## Ferramentas

Para escrever em LaTeX precisamos de uma **distribuição**: um conjunto de programas, compiladores e pacotes necessários para processar documentos `.tex` e gerar saídas (PDF, DVI, PS).

Entre as mais populares estão:

- **TeX Live**: multiplataforma, mais utilizada para escrita acadêmica.
- **MiKTeX**: popular no Windows, faz download automático de pacotes que faltam.
- **MacTeX**: adaptada do TeX Live para macOS, inclui o editor TeXShop.

Para editar documentos LaTeX existem diversas IDEs. Como o LaTeX é baseado em arquivos de texto, qualquer editor pode ser usado, porém existem editores especializados que facilitam o processo:

- TeXstudio
- TeXworks
- Overleaf

E para processar os arquivos `.tex` precisamos de compiladores como:

- pdfLaTeX
- XeLaTeX
- LuaLaTeX

É importante ressaltar que o LaTeX pode ser estendido através de pacotes, por exemplo:

- `amsmath`, `amssymb`: suporte avançado a matemática.
- `graphicx`: inclusão de imagens.
- `babel`, `polyglossia`: suporte a múltiplos idiomas.
- `biblatex`, `natbib`: gerenciamento de bibliografias.
- `tikz`/`pgfplots`: criação de gráficos e diagramas vetoriais.

## Escrevendo

O primeiro passo é criar um novo projeto de LaTeX. Você pode fazer isso no seu próprio computador, criando um novo arquivo `.tex`, ou, como alternativa, iniciar um novo projeto no Overleaf.

```latex
\documentclass{article} % Define a classe do documento
\usepackage[utf8]{inputenc} % Codificação de caracteres

% Esta linha é um comentário. Ele não aparece no documento gerado.

\begin{document}
Primeiro documento. Este é um exemplo simples, sem
parâmetros ou pacotes extras incluídos.
\end{document}
```

O exemplo anterior mostrou como o conteúdo do documento é inserido após o comando `\begin{document}`. No entanto, tudo no arquivo `.tex` que aparece antes desse ponto é chamado de **preâmbulo**, que atua como a seção de "configuração" do documento. Dentro do preâmbulo você define a classe do documento (tipo), detalhes como idiomas a serem usados, os pacotes que gostaria de carregar, e é onde se aplicam outros tipos de configuração.

```latex
\documentclass[12pt, letterpaper]{article}
\usepackage{graphicx}
```

Onde `\documentclass[12pt, letterpaper]{article}` define a classe geral do documento. Parâmetros adicionais, que devem ser separados por vírgulas, são incluídos entre colchetes (`[...]`) e usados para configurar esta instância da classe do documento, ou seja, ajustes que desejamos aplicar a este documento baseado na classe `article`.

<div>
  <pre class="pre">
    \documentclass[12pt, letterpaper]{article}
    <span style="color:rgb(178, 111, 0)">└──────┬──────┘</span><span style="color:rgb(0, 76, 178)">└────────┬────────┘</span><span style="color:red">└──┬──┘</span>
        <span style="color:rgb(178, 111, 0)">comando</span>            <span style="color:rgb(0, 76, 178)">opcional</span>       <span style="color:red">obrigatório</span>
  </pre>
</div>

É claro que outros tamanhos de fonte (9pt, 11pt, 12pt) podem ser usados, mas se nenhum for especificado, o tamanho padrão será 10pt. Quanto ao tamanho do papel, outros valores possíveis são `a4paper` e `legalpaper`.

### Negrito, itálico e sublinhado

**Negrito**: para texto em negrito no LaTeX, use o comando `\textbf{...}`.
**Itálico**: o texto em itálico é produzido usando o comando `\textit{...}`.
**Sublinhado**: para sublinhar o texto, use o comando `\underline{...}`.

```latex
Some of the \textbf{greatest}
discoveries in \underline{science}
were made by \textbf{\textit{accident}}.
```

### Listas

Podemos utilizar diferentes tipos de lista usando **ambientes**, que servem para encapsular o código LaTeX necessário para implementar um recurso de digitação específico.

As listas não ordenadas são produzidas pelo ambiente `itemize`. Cada entrada da lista deve ser precedida pelo comando `\item`, como mostrado abaixo:

```latex
\documentclass{article}
\begin{document}
\begin{itemize}
  \item The individual entries are indicated with a black dot, a so-called bullet.
  \item The text in the entries may be of any length.
\end{itemize}
\end{document}
```

As listas ordenadas usam a mesma sintaxe das listas não ordenadas, mas são criadas usando o ambiente `enumerate`:

```latex
\documentclass{article}
\begin{document}
\begin{enumerate}
  \item This is the first entry in our list.
  \item The list numbers increase with each entry we add.
\end{enumerate}
\end{document}
```

### Matemática

Podemos adicionar fórmulas e notação matemática ao documento utilizando modo `bloco` ou `inline`:

```latex
\documentclass[12pt, letterpaper]{article}
\begin{document}
\begin{math}
E=mc^2
\end{math} is typeset in a paragraph using inline math mode---as is $E=mc^2$, and so too is \(E=mc^2\).
\end{document}
```

Renderizado, o modo inline acima produz: $E=mc^2$.

Outro exemplo é a notação em modo de exibição (*display math*): a fórmula de Bhaskara:

```latex
\[ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \]
```

Que, renderizada, fica:

$$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$


### Resumo (*Abstract*)

Artigos científicos geralmente fornecem um resumo: uma breve visão geral de seus tópicos principais ou argumentos. O exemplo a seguir demonstra como digitar um resumo usando o ambiente `abstract` do LaTeX:

```latex
\documentclass{article}
\begin{document}
\begin{abstract}
This is a simple paragraph at the beginning of the
document. A brief introduction about the main subject.
\end{abstract}
\end{document}
```

### Parágrafos e nova linha

Com o resumo em vigor, podemos começar a escrever o primeiro parágrafo. O exemplo a seguir demonstra:

- Como um novo parágrafo é criado pressionando a tecla "Enter" duas vezes, encerrando a linha atual e inserindo uma linha em branco subsequente;
- Como iniciar uma nova linha sem iniciar um novo parágrafo, inserindo uma quebra de linha manual com o comando `\\` (barra invertida dupla). Como alternativa, use o comando `\newline`.

```latex
\documentclass{article}
\begin{document}

\begin{abstract}
This is a simple paragraph at the beginning of the
document. A brief introduction about the main subject.
\end{abstract}

After our abstract we can begin the first paragraph, then press ``enter'' twice to start the second one.

This line will start a second paragraph.

I will start the third paragraph and then add \\ a manual line break which causes this text to start on a new line but remains part of the same paragraph. Alternatively, I can use the \verb|\newline| command to start a new line, which is also part of the same paragraph.
\end{document}
```

### Capítulos e seções

Documentos mais longos geralmente são particionados em partes, capítulos, seções, subseções e assim por diante. O LaTeX também fornece comandos de estrutura de documento, mas os comandos disponíveis e suas implementações (o que eles fazem) dependem da classe de documento que está sendo usada. A título de exemplo, documentos criados usando a classe `book` podem ser divididos em partes, capítulos, seções, subseções e assim por diante, mas a classe `letter` não fornece (não suporta) nenhum desses comandos.

```latex
\documentclass{book}
\begin{document}

\chapter{First Chapter}

\section{Introduction}

This is the first section.

Lorem  ipsum  dolor  sit  amet,  consectetuer  adipiscing
elit. Etiam  lobortis facilisis sem.  Nullam nec mi et
neque pharetra sollicitudin.  Praesent imperdiet mi nec ante.
Donec ullamcorper, felis non sodales...

\section{Second Section}

Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Etiam lobortis facilisis sem.  Nullam nec mi et neque pharetra
sollicitudin.  Praesent imperdiet mi nec ante...

\subsection{First Subsection}
Praesent imperdiet mi nec ante. Donec ullamcorper, felis non sodales...

\section*{Unnumbered Section}
Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Etiam lobortis facilisis sem...
\end{document}
```

### Tabelas

Tabelas são criadas com o ambiente `tabular`, dentro de um ambiente `table` que permite adicionar legenda e posicionamento automático. O argumento `{|c|c|c|}` define o número de colunas, o alinhamento (`l`, `c`, `r`, para esquerda, centro e direita) e as bordas verticais (`|`):

```latex
\begin{table}[h]
  \centering
  \begin{tabular}{|l|c|r|}
    \hline
    Nome & Idade & Cidade \\
    \hline
    Ana & 23 & São Paulo \\
    Bruno & 31 & Recife \\
    \hline
  \end{tabular}
  \caption{Exemplo de tabela simples.}
  \label{tab:exemplo}
\end{table}
```

O comando `\hline` desenha uma linha horizontal, e `&` separa as colunas dentro de uma linha. Para tabelas mais elaboradas (linhas mescladas, larguras fixas, cores), pacotes como `booktabs`, `multirow` e `colortbl` são os mais utilizados.

### Imagens e figuras

Para incluir imagens é necessário o pacote `graphicx`, apresentado anteriormente. O comando `\includegraphics` insere a imagem, e o ambiente `figure` permite adicionar legenda, rótulo e controlar o posicionamento:

```latex
\usepackage{graphicx}

\begin{figure}[h]
  \centering
  \includegraphics[width=0.6\textwidth]{exemplo.png}
  \caption{Legenda da figura.}
  \label{fig:exemplo}
\end{figure}
```

O parâmetro `[h]` (*here*) sugere ao LaTeX que a figura seja posicionada aproximadamente onde aparece no código-fonte. Outras opções comuns são `t` (topo da página), `b` (fim da página) e `p` (página própria para flutuantes).

### Referências cruzadas

O LaTeX numera automaticamente seções, figuras, tabelas e equações, e permite referenciá-las no texto sem precisar atualizar os números manualmente. Isso é feito com o par `\label{...}` / `\ref{...}`:

```latex
\section{Introdução}
\label{sec:intro}

Como discutido na Seção~\ref{sec:intro}, o LaTeX simplifica...

Veja a Tabela~\ref{tab:exemplo} e a Figura~\ref{fig:exemplo} para mais detalhes.
```

O `\label` deve ser colocado logo após o comando que numera o elemento (`\section`, `\caption`, etc.), e o `\ref` é substituído pelo número correspondente na compilação. É comum ser necessário compilar o documento duas vezes para que as referências sejam atualizadas corretamente.

### Bibliografia

Para citar fontes e gerar uma lista de referências, o mais usado atualmente é o pacote `biblatex` junto ao backend `biber`. Primeiro, cria-se um arquivo `.bib` com as entradas, por exemplo `referencias.bib`:

```bibtex
@book{lamport1994latex,
  author    = {Lamport, Leslie},
  title     = {LaTeX: A Document Preparation System},
  year      = {1994},
  publisher = {Addison-Wesley},
}
```

No preâmbulo do documento, carrega-se o pacote apontando para esse arquivo, e o comando `\cite` é usado para citar uma entrada pela sua chave:

```latex
\usepackage[backend=biber, style=numeric]{biblatex}
\addbibresource{referencias.bib}

\begin{document}
O LaTeX foi documentado por Lamport \cite{lamport1994latex}.

\printbibliography
\end{document}
```

O comando `\printbibliography` insere a lista de referências formatada de acordo com o `style` escolhido (`numeric`, `authoryear`, `abnt`, entre outros). Diferente do `\ref`, que exige recompilação, a bibliografia normalmente exige rodar o `biber` (ou `bibtex`) entre as compilações do `.tex`, algo que editores como o Overleaf e o TeXstudio fazem automaticamente.

### Comandos personalizados

Quando um trecho de código se repete com frequência, é comum criar um comando próprio com `\newcommand`, o que evita repetição e facilita alterações futuras:

```latex
\newcommand{\R}{\mathbb{R}}
\newcommand{\vect}[1]{\boldsymbol{#1}}

\begin{document}
Seja $x \in \R$ e $\vect{v}$ um vetor qualquer.
\end{document}
```

O primeiro argumento de `\newcommand` é o nome do novo comando, e o segundo (opcional, entre colchetes) indica quantos parâmetros ele recebe, referenciados como `#1`, `#2` etc. dentro da definição.

### Erros comuns

Alguns problemas aparecem com frequência para quem está começando com LaTeX:

- **Ambiente não fechado**: todo `\begin{ambiente}` precisa de um `\end{ambiente}` correspondente. O erro `\begin{document} ended by \end{...}` geralmente indica um ambiente aberto e não fechado antes dele.
- **Caractere especial não escapado**: símbolos como `%`, `&`, `#`, `_` e `$` têm significado especial no LaTeX. Para usá-los como texto literal, é preciso escapá-los com uma barra invertida, por exemplo `\%`, `\&`, `\_`.
- **Pacote ausente**: ao usar um comando de um pacote que não foi carregado com `\usepackage`, o compilador gera um erro de comando indefinido (`Undefined control sequence`).
- **Referências desatualizadas**: números de seções, figuras e citações só são atualizados após uma nova compilação (às vezes duas ou três, quando há bibliografia envolvida).
- **Imagem não encontrada**: o caminho passado a `\includegraphics` é relativo ao arquivo `.tex` principal; um erro comum é referenciar o caminho a partir da raiz do projeto.

### Templates

Seguem alguns templates de documento para apresentações, conferências ou publicação.

**Sociedade Brasileira de Computação**
- https://www.overleaf.com/latex/templates/sbc-conferences-template/blbxwjwzdngr

**MIT Thesis Template**
- https://www.overleaf.com/latex/templates/mit-thesis-template/sgzcswxftpwx

## Referências

THE LATEX PROJECT. *The LaTeX Project: A document preparation system*. Disponível em: https://www.latex-project.org/. Acesso em: 30 ago. 2025.

LAMPORT, Leslie. *LaTeX: a document preparation system: user's guide and reference manual*. 2. ed. Reading, Massachusetts: Addison-Wesley, 1994.

<style scoped src="./latex.css"></style>
