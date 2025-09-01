# LaTeX

O [$\LaTeX{}$](https://www.latex-project.org/about/),  que é pronunciado «lah-tech» ou «lay-tech» é um sistema de preparação de documentos, ele inclui recursos projetados para a produção de documentação técnica e científica. O LaTeX é o padrão de fato para a comunicação e publicação de documentos científicos.

O LaTeX está disponível como software livre, você não precisa pagar pelo seu uso, ou seja, não há taxas de licença, etc. Mas, é claro, é convidado a apoiar os esforços de manutenção e desenvolvimento por meio de uma doação para o [grupo de usuários da TEX](https://www.tug.org/donate.html).

O LaTeX não é um editor WYSIWYG(*What You See Is What You Get*), mas sim um sistema de preparação de documentos. O usuário escreve um arquivo de texto simples com comandos de marcação, e o LaTeX processa esse arquivo,
gerando documentos tipograficamente refinados (PDF, DVI, PS).

## História

O LaTeX foi criado na década de 1980 por Leslie Lamport, baseado no TeX de Donald Knuth desenvolvido em 1978, ambos recipientes do prêmio Turing.

Enquanto o TeX focava na tipografia de alta qualidade, o LaTeX surgiu para simplificar seu uso, fornecendo macros e comandos de alto nível que facilitaram a produção de documentos científicos e acadêmicos.

![Leslie Lamport](../assets/latex/Leslie-Lamport.png){ align=left }
/// caption
Leslie Lamport
///

![Donald Knuth](../assets/latex/Donald-Knuth.jpg)
/// caption
Donald Knuth
///

A principal motivação do LaTeX foi oferecer uma ferramenta que garantisse:

- **Qualidade tipográfica superior**, especialmente em fórmulas matemáticas.
- **Consistência** em documentos longos, como teses, artigos e livros.
- **Automação** de referências, citações, sumários e listas de figuras/tabelas.
- **Portabilidade** e independência de plataforma.

## Ferramentas

Para escrever no LaTeX precisamos de uma distribuição que é umo conjunto de programas, compiladores e pacotes necessários para processar documentos `.tex` e gerar saídas (PDF, DVI, PS).

Entre os mais populares estão

- **TeX Live** multiplataforma, mais utilizado para escrita acadêmica.
- **MiKTeX** popular no Windows, faz download automático de pacotes que faltam.
- **MacTeX** adaptada do TeX Live para macOS, inclui o editor TeXShop.

Para editar documentos LaTeX existem diversas IDE's, como o LaTeX é baseado em arquivos de texto, qualquer editor pode ser usado porém existem editores especializados que facilitam o processo:

- TeXstudio
- TeXworks
- Overleaf

E para processar os arquivos `.tex` precisamos de compiladores como:

- pdfLaTeX
- XeLaTeX
- LuaLaTeX

É importante ressaltar que o desenvolvimento do LaTeX pode ser extendido através de pacotes como por exemplo:

- `amsmath`, amssymb: suporte avançado a matemática.
- `graphicx`:  inclusão de imagens.
- `babel`, `polyglossia`: suporte a múltiplos idiomas.
- `biblatex`, `natbib`: gerenciamento de bibliografias.
- `tikz/pgfplots`: criação de gráficos e diagramas vetoriais.

## Escrevendo

O primeiro passo é criar um novo projeto de látex. Você pode fazer isso no seu próprio computador criando um novo arquivo .tex ou como alternativa, você pode iniciar um novo projeto no overleaf.

```latex
\documentclass{article} % Define a classe do documento
\usepackage[utf8]{inputenc} % Codificação de caracteres

% This line here is a comment. It will not be typeset in the document.

\begin{document}
Primeiro documento.Este é um exemplo simples, sem
Parâmetros ou pacotes extras incluídos.
\end{document}
```

O exemplo anterior mostrou como o conteúdo do documento foi inserido após o comando \begin{document}. No entanto, tudo no seu arquivo `.tex` aparecendo antes desse ponto é chamado de preâmbulo, que atua como a seção "Configuração" do documento.
Dentro do preâmbulo, você define a classe de documento(tipo) juntamente com detalhes como idiomas a serem usados ​​ao escrever o documento, carregando pacotes que você gostaria de usar e é onde você aplica outros tipos de configuração.


```latex
\documentclass[12pt, letterpaper]{article}
\usepackage{graphicx}
```

Onde `\documentclass[12pt, letterpaper]{article}` define a classe geral de documento.Parâmetros adicionais, que devem ser separados por vírgulas, são incluídos entre colchetes ([...]) e usados ​​para configurar esta instância da classe do artigo;ou seja, configurações que desejamos usar para este documento baseado em classe de artigo específico.

É claro que outros tamanhos de fonte, 9pt, 11pt, 12pt, podem ser usados, mas se nenhum for especificado, o tamanho padrão será 10pt. Quanto ao tamanho do papel, outros valores possíveis são `a4paper` and `legalpaper`.

<div>
  <pre class="pre">
    \documentclass[12pt, letterpaper]{article}
    <span style="color:rgb(178, 111, 0)">└──────┬─────┘</span><span style="color:rgb(0, 76, 178)">└────────┬────────┘</span><span style="color:red">└───┬───┘</span>
        <span style="color:rgb(178, 111, 0)">comando</span>         <span style="color:rgb(0, 76, 178)">opcional</span>     <span style="color:red">obrigatório</span>
  </pre>
</div>



### Bold, italics and underlining

Negrito: em negrito no LaTeX está usando o comando \textbf{...}.
Itálico: o texto em itálico é produzido usando o comando \textit{...}.
Subline: para sublinhar o texto, use o comando \sublinhado{...}.

```latex
Some of the \textbf{greatest}
discoveries in \underline{science}
were made by \textbf{\textit{accident}}.
```

### Listas

Podemos utilizar diferentes tipos de lista usando ambientes, que são usados ​​para encapsular o código do LaTeX necessário para implementar um recurso de digitação específico.

As listas não ordenadas são produzidas pelo ambiente itemize. Cada entrada da lista deve ser precedida pelo comando `\item`, como mostrado abaixo:

```latex
\documentclass{article}
\begin{document}
\begin{itemize}
  \item The individual entries are indicated with a black dot, a so-called bullet.
  \item The text in the entries may be of any length.
\end{itemize}
\end{document}
```

As listas ordenadas usam a mesma sintaxe que as listas não ordenadas, mas são criadas usando o ambiente enumerado:

```latex
\documentclass{article}
\begin{document}
\begin{enumerate}
  \item This is the first entry in our list.
  \item The list numbers increase with each entry we add.
\end{enumerate}
\end{document}
```

### Math

Podemos adicionar fórmulas e notação matemática ao documento utilizando `bloco` ou `inline`...

```latex
\documentclass[12pt, letterpaper]{article}
\begin{document}
\begin{math}
E=mc^2
\end{math} is typeset in a paragraph using inline math mode---as is $E=mc^2$, and so too is \(E=mc^2\).
\end{document}
```

Outro exemplo é a notação simples:

A fórmula de Bhaskara é dada por:
\[ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \]

### Resumo *Abstract*

Os artigos científicos geralmente fornecem um resumo que é uma breve visão geral/resumo de seus tópicos principais ou argumentos. O próximo exemplo demonstra digitando um resumo usando o ambiente abstrato do LaTeX:

```latex
\documentclass{article}
\begin{document}
\begin{abstract}
This is a simple paragraph at the beginning of the
document. A brief introduction about the main subject.
\end{abstract}
\end{document}
```

### Paragráfos e nova Linha

Com o resumo em vigor, podemos começar a escrever nosso primeiro parágrafo. O próximo exemplo demonstra:
- Como um novo parágrafo é criado pressionando a tecla "Enter" duas vezes, encerrando a linha atual e inserindo uma linha em branco subsequente;
- Como iniciar uma nova linha sem iniciar um novo parágrafo, inserindo uma quebra de linha manual usando o comando `\\`, que é uma barra de barragem dupla;Como alternativa, use o comando `\newline`.

```latex
\documentclass{article}
\begin{document}

\begin{abstract}
This is a simple paragraph at the beginning of the
document. A brief introduction about the main subject.
\end{abstract}

After our abstract we can begin the first paragraph, then press ``enter'' twice to start the second one.

This line will start a second paragraph.

I will start the third paragraph and then add \\ a manual line break which causes this text to start on a new line but remains part of the same paragraph. Alternatively, I can use the \verb|\newline|\newline command to start a new line, which is also part of the same paragraph.
\end{document}
```

### Capítulos e sessões

Documentos mais longos, geralmente são particionados em peças, capítulos, seções, subseções e assim por diante. O LATEX também fornece comandos de estrutura de documentos, mas os comandos disponíveis e suas implementações (o que eles fazem), podem depender da classe de documentos que está sendo usada. A título de exemplo, os documentos criados usando a classe do livro podem ser divididos em peças, capítulos, seções, subseções e assim por diante, mas a classe de letra não fornece (suporta) quaisquer comandos para fazer isso.

```latex
\documentclass{book}
\begin{document}

\chapter{First Chapter}

\section{Introduction}

This is the first section.

Lorem  ipsum  dolor  sit  amet,  consectetuer  adipiscing
elit. Etiam  lobortisfacilisis sem.  Nullam nec mi et
neque pharetra sollicitudin.  Praesent imperdietmi nec ante.
Donec ullamcorper, felis non sodales...

\section{Second Section}

Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Etiam lobortis facilisissem.  Nullam nec mi et neque pharetra
sollicitudin.  Praesent imperdiet mi necante...

\subsection{First Subsection}
Praesent imperdietmi nec ante. Donec ullamcorper, felis non sodales...

\section*{Unnumbered Section}
Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Etiam lobortis facilisissem...
\end{document}
```

### Templates

Seguem alguns templates de documento para apresentações, conferências ou publicação.

**Sociedade Brasileira de Computação**
- https://www.overleaf.com/latex/templates/sbc-conferences-template/blbxwjwzdngr

**MIT Thesis Template**
- https://www.overleaf.com/latex/templates/mit-thesis-template/sgzcswxftpwx

---

THE LATEX PROJECT. The LaTeX Project — A document preparation system. Disponível em: https://www.latex-project.org/. Acesso em: 30 ago. 2025.

LAMPORT, Leslie. LaTeX: a document preparation system: user’s guide and reference manual. 2. ed. Reading, Massachusetts: Addison-Wesley, 1994.