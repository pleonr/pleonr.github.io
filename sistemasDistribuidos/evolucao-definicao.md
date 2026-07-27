---
title: "Sistemas Distribuídos: 02"
---

[← Sistemas Distribuídos](/sistemasDistribuidos/)

# Evolução e Definição de Sistemas Distribuídos

<p class="lesson-subtitle">Um pouco de história · Definições clássicas · Desafios dos sistemas distribuídos modernos</p>

## Um pouco de história

<div class="cols2">
<div>

- 1945 … ~1985
- Computação centralizada
- Computadores grandes e caros
- Já existiam sistemas com distribuição de processamento
  - Múltiplos processadores
  - Basicamente de controle centralizado
- Baixa (nenhuma) interação e conectividade

</div>
<div>

<img src="/sistemasDistribuidos/einica.webp" class="img-center" alt="Eniac 1946" />

</div>
</div>

::: details O ENIAC
Criado pelos engenheiros John Eckert e John Mauchly na Universidade da Pensilvânia durante os anos de 1937-1943, o ENIAC tinha como objetivo principal computar dados balísticos de artilharia em altas velocidades para ajudar as tropas aliadas na Segunda Guerra Mundial. No entanto, o ENIAC só foi concluído após o fim da guerra, sendo então utilizado nos primeiros anos da Guerra Fria, tendo contribuído para o projeto da bomba de hidrogênio.

O ENIAC pesava cerca de 30 toneladas e ocupava cerca de 180m², era tão grande que tinha de ser disposto em U com três painéis sobre rodas, para que os operadores pudessem se mover em torno dele. Foram gastos cerca de US$ 500.000,00 em sua construção.
:::

## Evolução

<div class="cols2">
<div>

Durante esse período aconteceu uma evolução tecnológica sem precedentes, com mudanças radicais:

- ↑ capacidade de processamento
- ↓ custo ($)

O que gerou uma evolução contínua:

- ↑ capacidade de processamento e desempenho de redes
- ↓ custos

</div>
<div>

Durante a década de 1980, um novo conceito surgiu:

- Redes de computadores (locais)
  - Facilitar a comunicação entre computadores
- Microprocessadores → PC
  - Aumento no número de computadores

Já no início dos anos 90:

- Sistemas abertos
- Interoperabilidade

</div>
</div>

::: details Sistemas abertos e a Internet dos anos 90
Sistemas abertos são aqueles projetados com base em padrões abertos e interoperáveis, permitindo que diferentes componentes, desenvolvidos por fornecedores distintos, trabalhem juntos de maneira integrada. Ex.: POSIX, TCP/IP, HTTP, LDAP, HTML, APIs.

Ainda nos anos 90 teve início uma evolução das redes de larga escala: redes públicas (governamentais), a Internet, e a queda do custo de conexão, impulsionada pelos computadores pessoais. Setores inteiros passaram a depender dessa infraestrutura: finanças e comércio (e-commerce, *online banking*), a sociedade da informação (motores de busca, Wikipédia, redes sociais), indústrias criativas e educação (jogos online, conteúdo gerado por usuário), saúde (informática em saúde, monitoramento de pacientes), transporte e logística (GPS, mapas), ciência (grades computacionais para colaboração) e gestão ambiental (sensoriamento de terremotos, enchentes, tsunamis).
:::

## Definição de Sistemas Distribuídos

<div class="cols2">
<div>

**Tanenbaum**
> "... is a collection of independent computers that appear to the users of the system as a single computer."

**Coulouris**
> "... hardware or software components located at networked computers communicate and coordinate their actions only by passing messages."

</div>
<div>

Os principais desafios dos sistemas distribuídos atuais estão em:

- Sistemas abertos
- Heterogeneidade
- Segurança
- Escalabilidade
- Tratamento de falhas
- Concorrência
- Transparência
- Qualidade de serviço

</div>
</div>

::: details Livros de referência
<div class="cols2">
<div>

COULOURIS, G.; DOLLIMORE, J.; KINDBERG, T.; BLAIR, G. *Sistemas Distribuídos: Conceitos e Projeto*. 5. ed. São Paulo: Pearson, 2013.

</div>
<div>

TANENBAUM, A. S.; VAN STEEN, M. *Distributed Systems: Principles and Paradigms*. 4. ed. Upper Saddle River: Pearson Prentice Hall, 2023.

</div>
</div>
:::

## Desafios dos Sistemas Distribuídos Modernos

### Sistemas abertos

- Pode ser estendido ou reimplementado.
- Compartilhamento de recursos, disponibilizados a vários clientes.
- Especificação das interfaces publicadas e disponíveis (RFC/IETF, W3C...).
- Sistemas distribuídos abertos são projetados com padrões públicos e comunicação uniforme.
- Uso de hardware ou software heterogêneo, com independência de fornecedores.

### Heterogeneidade

<div class="cols2">
<div>

Fontes de heterogeneidade:

- Rede
- Hardware
- Sistemas operacionais
- Linguagem de programação
- Implementações
- Representação de dados

</div>
<div>

Como é mascarada:

- **Middleware**: camada de software que mascara a heterogeneidade, fornecendo um modelo computacional uniforme.
- **Migração/mobilidade de código**: programas transferidos e executados em outro local, como máquinas virtuais de processo (JVM, CLR), JavaScript.

</div>
</div>

### Segurança

- Enviar dados sigilosos, em uma ou mais mensagens, de forma segura.
- Informações compartilhadas de alto valor exigem:
  - **Confidencialidade**: acessos autorizados.
  - **Integridade**: alteração dos dados.
  - **Disponibilidade**: interferência de acesso.
  - **Autenticidade**: é realmente quem diz ser.
- Desafios em aberto: negação de serviço (DoS), segurança de código móvel.

### Escalabilidade

- Funcionamento efetivo e eficaz em escalas diferentes de componentes (rede local, intranet, Internet…).
- Escalável: permanece eficiente mesmo com aumento significativo de recursos ou usuários.
- Desafios de projeto para crescer:
  - Controlar o custo de acesso aos recursos: replicação.
  - Controlar a perda (gargalo) de desempenho: estruturas e algoritmos hierárquicos ou descentralizados.
  - Impedir que os recursos se esgotem: IPv6.

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/internet_growth.png" alt="Crescimento da Internet" />
</figure>

### Tratamento de falhas e redundância

<div class="cols2">
<div>

- Falhas em sistemas distribuídos são **parciais**, particularmente difíceis.
- **Detecção de falhas**: gerenciar a ocorrência de falhas que não podem ser detectadas; algumas podem ser detectadas por checksum.
- **Mascaramento de falhas**: retransmissão de mensagem ou armazenamento replicado.
- **Tolerância a falhas**: fornecer o serviço na presença de falhas (ex.: timeout de webserver).
- **Recuperação de falhas**: projetar software que possa recuperar o estado de dados permanentes (rollback).

</div>
<div>

**Redundância** é a regra para tornar serviços tolerantes a falhas:

- Existir mais de uma rota para comunicação.
- Replicação de tabelas, componentes de hardware ou bancos de dados.
- Sistemas distribuídos buscam alto grau de disponibilidade em falhas de hardware através de grande redundância.

</div>
</div>

### Concorrência

- Suporte a concorrência por meio de processos ou threads concorrentes.
- Acesso compartilhado a vários recursos exige controle de acesso e conteúdo.
- Recursos em um SD devem ser projetados para operar de forma segura, prevendo os casos e impedindo perda de recursos por acesso compartilhado.

### Transparência

- Ocultar a separação dos componentes de um sistema distribuído.
- O sistema deve ser percebido como um todo, e não como uma coleção de recursos, tanto para usuários finais quanto para programadores de aplicativos.
- A transparência possui grande influência sobre o projeto do software em um sistema distribuído.

### Qualidade de serviço

- Principais propriedades não funcionais: confiabilidade, segurança, desempenho.
- Aspectos importantes na qualidade de serviço:
  - **Adaptatividade**: atender sistemas variáveis.
  - **Disponibilidade**: de recursos.
- Aplicativos manipulam informações em relação ao tempo: QoS busca satisfazer os prazos finais.

### Compartilhamento de recursos

<div class="cols2">
<div>

- Usuários estão acostumados com o compartilhamento de recursos (impressoras, arquivos, mecanismos de busca...).
- Hardware: redução de custos.
- O foco maior está nas abstrações de mais alto nível: informações necessárias ao trabalho, aplicações ou atividades sociais.
- Padrões de compartilhamento variam: acesso a busca na web, trabalho colaborativo apoiado por computadores.

</div>
<div>

O termo "serviço" é utilizado como parte de um sistema computacional que gerencia recursos:

- Serviço de sistema de arquivos.
- Serviço de impressão.
- Serviço de pagamento eletrônico.

Acesso ao serviço se dá pelas operações que ele fornece (exporta): leitura, escrita, exclusão (caso de arquivos). Os recursos ficam encapsulados dentro de computadores, acessíveis de outros por uma interface de comunicação.

</div>
</div>

---

**Próxima página:** [03: Modelos Físicos →](/sistemasDistribuidos/modelos-fisicos)

<style scoped src="./shared.css"></style>
