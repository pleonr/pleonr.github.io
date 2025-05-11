
# Golang

Go, também conhecida como Golang, é uma linguagem de programação de código aberto criada pelo Google. Ela foi projetada para ser simples, eficiente, segura e altamente concorrente. É muito utilizada em sistemas distribuídos, aplicações web, microserviços e ferramentas de rede.

- Compilada e com tipagem estática
- Concorrência nativa com goroutines
- Sintaxe simples e limpa
- Gerenciamento de dependências com `go mod`

## Instalação

Antes de começar, baixe e instale o Go a partir do site oficial [https://golang.org/dl](https://golang.org/dl), após a instalação, abra o terminal e digite:

```bash
go version
```

### Configuração de ambiente

1. Crie as pastas padrão do Go:

```bash
mkdir -p ~/go/{bin,src,pkg}
```

2. No Linux/macOS, adicione as variáveis de ambiente no seu `.bashrc` ou `.zshrc`:

```bash
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

## Estrutura de Projeto

O gerenciamento de pacotes no Go é feito através de módulos, que são configurados com o comando `go mod`.

```bash
mkdir hello-go
cd hello-go
go mod init github.com/seunome/hello-go
```

Isso cria o arquivo `go.mod`, onde o Go controla suas dependências.

## Sintaxe Básica

Você pode declarar variáveis com `var` ou usar a notação curta `:=`.

```go
var nome string = "Golang"
idade := 10 // inferência de tipo
```

O Go exige que todas as variáveis declaradas sejam usadas, ou um erro será gerado na compilação.

## Tipos de Dados

Os principais tipos primitivos incluem:

- Inteiros: `int`, `int8`, `int32`, `int64`
- Ponto flutuante: `float32`, `float64`
- Booleano: `bool`
- Texto: `string`

```go
var ativo bool = true
var altura float64 = 1.75
var nome string = "Maria"
```

## Constantes

Constantes são valores imutáveis definidos com `const`.

```go
const Pi = 3.1415
```

## Operadores

O Go possui os operadores comuns de outras linguagens:

- Aritméticos: `+`, `-`, `*`, `/`, `%`
- Relacionais: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Lógicos: `&&`, `||`, `!`

## Estruturas de Controle

### If / Else

```go
if idade > 18 {
    fmt.Println("Maior de idade")
} else {
    fmt.Println("Menor de idade")
}
```

### Switch

```go
switch dia {
case "segunda":
    fmt.Println("Início da semana")
case "sexta":
    fmt.Println("Sextou!")
default:
    fmt.Println("Dia comum")
}
```

## Laços de Repetição

O Go possui apenas o `for` como estrutura de repetição, mas ele pode ser usado de formas variadas.

### Tradicional

```go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
```

### While-like

```go
i := 0
for i < 5 {
    fmt.Println(i)
    i++
}
```

### Infinito

```go
for {
    fmt.Println("Executando para sempre")
}
```

## Módulos e Pacotes

Go organiza o código em pacotes (`package`) e importa com `import`.

```go
import (
    "fmt"
    "math"
)
```

Você pode criar seus próprios pacotes e importar com base no caminho relativo ou nome do módulo.

## Gerenciamento de Dependências

Com o Go Modules (`go mod`), você pode instalar e gerenciar bibliotecas externas.

### Adicionando uma dependência

```bash
go get github.com/fatih/color
```

O `go.mod` será atualizado automaticamente.

### Usando a biblioteca

```go
import "github.com/fatih/color"

func main() {
    color.Green("Texto verde!")
}
```

## Execução e Compilação

### Executar diretamente

```bash
go run main.go
```

### Compilar para binário

```bash
go build -o meuapp main.go
```

## Exemplo Completo

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    var nome string = "Golang"
    idade := 10

    fmt.Println("Nome:", nome)
    fmt.Println("Idade:", idade)

    if idade > 5 {
        fmt.Println("Go é maduro!")
    }

    for i := 0; i < 3; i++ {
        fmt.Printf("Iteração: %d", i)
    }

    raiz := math.Sqrt(49)
    fmt.Printf("A raiz quadrada de 49 é %.2f", raiz)
}
```

---

## Recursos Recomendados

- [Documentação oficial](https://golang.org/doc/)
- [Effective Go](https://golang.org/doc/effective_go.html)
- [Go by Example](https://gobyexample.com/)
- [Playground interativo](https://play.golang.org/)


