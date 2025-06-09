# Recursividade

Antes de entrarmos na abordagem recursiva precisamos fazer a diferença entre iterativo e recursivo.

<div align="center" markdown="1">
| Conceito      | Recursivo                                | Iterativo                                    |
| ------------- | ---------------------------------------- | -------------------------------------------- |
| **Definição** | Uma função que se chama a si mesma       | Uso de laços (`for`, `while`) para repetição |
| **Estrutura** | Baseado em chamadas de função empilhadas | Baseado em controle de fluxo explícito       |
| **Memória**   | Usa a **pilha de chamadas** (call stack) | Usa **variáveis locais**, sem novas pilhas   |
</div>


Utilizamos iteração quando o problema é naturalmente sequencial como, cálculo de médias ou somatórios e o consumo de memória é uma preocupação importante, ou quando há uma necessidade de lidar com grandes quantidades de entrada, por exemplo um fatorial de 10000, ou ainda uma necessidade de controle de fluxo maior como utilização de break e continue.

Podemos utilizar a recursividade para dividir e conquistar, dividindo um problema partes menores e semelhantes, o que simplifica a lógica, sendo muito utilizado para estruturas hierárquicas como árvores, grafos e expressões aninhadas e algoritmos de ordenação onde clareza e concisão são mais importantes que desempenho.

<div align="center" markdown="1">
| Critério                   | Recursivo                                           | Iterativo                                     |
| -------------------------- | --------------------------------------------------- | --------------------------------------------- |
| **Simplicidade do código** | Mais legível para problemas naturalmente recursivos | Mais direto para cálculos sequenciais simples |
| **Uso de memória**         | Alto (empilha chamadas)                             | Baixo (uso constante de memória)              |
| **Desempenho**             | Pode ser mais lento (overhead de chamadas)          | Geralmente mais rápido                        |
| **Facilidade de entender** | Difícil para iniciantes                             | Mais fácil de visualizar e rastrear           |
| **Casos de uso ideais**    | Árvores, grafos, algoritmos de divisão e conquista  | Processos repetitivos simples e iteráveis     |
| **Risco de erro**          | Stack overflow em recursão profunda                 | Mais robusto para grandes volumes             |
</div>


## Funcionamento

Recursividade é um conceito da programação que ocorre quando uma função chama a si mesma diretamente (ou indiretamente) como parte de sua execução. Os três quisitos abaixo servem como leis para uma função recursiva, além de garantir segurança

- **Condição de parada**: Também chamada de função base ou básica, é uma condição para definir quando uma função recursiva vai parar ou terminar sua execução.
- **Aproximação da função de parada**: A cada recursão ela deve ficar mais próxima de sua condição de parada.
- **Chamada recursiva**: a função que chama a si mesma ou subproblema menor.

```py
def recursividade():
  print("Para entender recursividade primeiro você precisa entender recursividade")
  recursividade()
```

Quando uma função recursiva é chamada, o sistema guarda o estado atual da execução (parâmetros, variáveis locais, posição na função) em uma pilha de chamadas (call stack). Isso permite que, ao retornar do caso base, o sistema "lembre" exatamente onde parar e continuar a execução.

- **Empilhamento (stacking):** A cada chamada recursiva, o sistema coloca (empilha) uma nova entrada na pilha de chamadas. Essa entrada contém o contexto da execução atual.
- **Caso base (parada):** Quando o caso base é atingido, a recursão para de se aprofundar. A função retorna um valor.
- **Desempilhamento (unwinding):** Depois que o caso base é resolvido, a pilha começa a "desempilhar", resolvendo cada chamada anterior com base no retorno da próxima.


## Stack overflow

Stack Overflow ocorre quando a pilha de chamadas (call stack) do programa fica cheia devido ao excesso de chamadas recursivas que não terminam ou demoram demais para alcançar o caso base. Cada chamada recursiva adiciona uma nova entrada na pilha. Se houver muitas chamadas antes de começar a retornar, a pilha cresce indefinidamente até que a memória alocada para ela acabe.

<div align="center" markdown="1">
| Causa                                                     | Exemplo                                |
| --------------------------------------------------------- | -------------------------------------- |
| Falta de caso base                                        | Função que nunca para de se chamar     |
| Caso base incorreto                                       | Condição errada que nunca é satisfeita |
| Entrada muito grande                                      | Profundidade de recursão muito alta    |
| Recursão indireta mal projetada                           | Função A chama B que chama A sem fim   |
| Algoritmos sem otimização (como Fibonacci recursivo puro) | Explode a pilha com facilidade         |
</div>


## Fatorial

O fatorial de um número natural é o produto desse número por todos os seus antecessores inteiros positivos. Representado pelo símbolo de exclamação (!), o fatorial é uma ferramenta matemática fundamental, especialmente em áreas como análise combinatória e probabilidade.

A notação para o fatorial de um número `n` é `n!`. Para calcular o fatorial de um número inteiro positivo, multiplicamos o número por todos os seus antecessores até chegar a 1.

Por exemplo, o fatorial de 5, ou 5!, é calculado da seguinte forma:
`5!= 5*4*3*2*1 = 120`

Uma propriedade importante do fatorial é sua natureza recursiva, o que significa que o fatorial de um número pode ser definido em termos do fatorial do número anterior:
`n!= n * (n−1)!`


Ao abordar de forma iterativa esse problema podemos chegar a seguinte solução:

```py
def fatorial_iterativo(n):
    resultado = 1
    for i in range(2, n + 1):
        resultado *= i
    return resultado

print(fatorial_iterativo(5))  # Saída: 120
```

O mesmo código recursivo e seu funcionamento:

```py
def fatorial(n):
  if n == 0 or n == 1:
      return 1
  return n * fatorial(n - 1)
```

Por exemplo 3! tem o seguinte fluxo.

```
fatorial(3)
→ 3 * fatorial(2)
    → 2 * fatorial(1)
        → 1 → CASO BASE → retorna 1
    → 2 * 1 = 2 → retorna 2
→ 3 * 2 = 6 → retorna 6

Enquando que a pilha de chamadas seria a seguinte
| fatorial(3) | ← última a ser resolvida
| fatorial(2) |
| fatorial(1) | ← caso base, retorna 1
```


## Fibonacci

<a href="https://gvanrossum.github.io/" target="_blank"><img align="left" width="400" src="../../assets/algoritmos/Fibonacci.jpg" /></a>

Leonardo Fibonacci foi um matemático italiano nomeado como o primeiro grande matemático europeu da Idade Média ficou conhecido pela divulgação da sequência de Fibonacci e pela sua participação na introdução dos algarismos arábicos na Europa.

A sequência Fibonacci foi introduzida na Europa por Leonardo de Pisa (Fibonacci) no livro *Liber Abaci (1202)*.

A Sequência de Fibonacci é uma sequência numérica onde cada número é a soma dos dois anteriores, utilizado em:

- matemática
- computação
- arte
- arquitetura


Implementando de forma iterativa, mais eficiente, ideal para grandes valores.

```py
def fibonacci_iterativo(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1

    anterior, atual = 0, 1
    for _ in range(2, n + 1):
        anterior, atual = atual, anterior + atual
    return atual

print(fibonacci_iterativo(6))  # Saída: 8
```

Já de forma recursiva, mais simples mas com desempenho inferior.

```py
def fibonacci_recursivo(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci_recursivo(n - 1) + fibonacci_recursivo(n - 2)

print(fibonacci_recursivo(6))  # Saída: 8
```

<div align="center" markdown="1">
| Critério             | Recursivo                      | Iterativo                      |
| -------------------- | ------------------------------ | ------------------------------ |
| Clareza matemática   | Alta                           | Moderada                       |
| Repetição de cálculo | Sim (ineficiente)              | Não (eficiente)                |
| Tempo de execução    | Exponencial $O(2^n)$           | Linear $O(n)$                  |
| Uso de memória       | Alto (empilha funções)         | Baixo (variáveis locais)       |
| Tamanho de entrada   | Limitado (pode estourar pilha) | Suporta grandes `n` facilmente |
</div>


















<a href="https://developerslife.tech/pt/wp-content/uploads/2016/01/tirinha1516.png"><img src="https://developerslife.tech/pt/wp-content/uploads/2016/01/tirinha1516.png" alt="" title="" /></a><small>Fonte: <a href="https://developerslife.tech/pt/">Vida de Programador</a></small>


