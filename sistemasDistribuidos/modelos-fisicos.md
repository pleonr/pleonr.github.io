---
title: "Sistemas Distribuídos: 03"
---

[← Sistemas Distribuídos](/sistemasDistribuidos/)

# Modelos Físicos

<p class="lesson-subtitle">Sistemas primitivos, adaptados para Internet, contemporâneos e de sistemas · Computação móvel, pervasiva e ubíqua · Clusters e grids</p>

No contexto de Sistemas Distribuídos, os modelos físicos representam a base concreta sobre a qual os sistemas são implementados. Eles descrevem explicitamente os componentes físicos envolvidos (computadores, servidores, dispositivos móveis, sensores embarcados e outros hardwares), bem como os meios de comunicação que interconectam esses elementos, por exemplo redes locais (LANs), redes geograficamente distribuídas (WANs), redes sem fio e a própria Internet.

- Descrição explícita do sistema: **hardware**, computadores, dispositivos móveis e embarcados.
- Redes de interconexão para troca de mensagens.
- Busca abstrair detalhes específicos, definindo um modelo físico mínimo.
- **Classificações:**
  - Sistemas Distribuídos Primitivos
  - Sistemas Distribuídos Adaptados para a Internet
  - Sistemas Distribuídos Contemporâneos
  - Sistemas Distribuídos de Sistemas

## Sistemas Distribuídos Primitivos

- Surgiram no final dos anos 70 e início dos 80.
- Redes locais (Ethernet) com conectividade limitada com a Internet.
- Serviços básicos: compartilhamento de impressoras, arquivos, e-mail e transferência de arquivos.
- Geralmente sistemas homogêneos, com qualidade de serviço primitiva.

## Sistemas Distribuídos Adaptados para a Internet

- Evolução dos modelos primitivos (anos 90).
- Expansão com o crescimento da Internet (ex.: Google em 1996).
- Sistemas em maior escala, com nós interconectados globalmente.
- Aumento da heterogeneidade: hardware, SO, linguagens e middleware.
- Ênfase em padrões abertos e serviços web.

## Sistemas Distribuídos Contemporâneos

- Evolução dos modelos anteriores.
- Impulsionados pela computação móvel, pervasiva/ubíqua e em nuvem.
- Sistemas distribuídos verdadeiramente globais e heterogêneos.
- *Smart Environments*.

### Computação Móvel

Acesso a informações de todos os lugares e a qualquer momento com "computadores" compactos, portados de forma prática pelo usuário. Perceptíveis ao usuário, sempre presentes, algumas vezes coletando informações do ambiente relevantes ao usuário.

<img src="/sistemasDistribuidos/mobile.png" class="img-center" alt="Computação Móvel" style="max-width: 480px" />

### Computação Pervasiva

É um paradigma de sistemas distribuídos no qual os dispositivos computacionais se integram de maneira invisível e onipresente ao ambiente, permitindo que serviços e informações estejam disponíveis a qualquer hora e em qualquer lugar.

Em outras palavras, essa abordagem busca tornar a tecnologia parte do cotidiano, com uma rede heterogênea de sensores e dispositivos que se comunicam de forma transparente, suportando mobilidade, escalabilidade e interoperabilidade sem que o usuário precise gerenciar explicitamente os recursos computacionais.

- Meios de computação estão distribuídos pelo ambiente, perceptíveis ou não aos usuários, extraindo informações detalhadas do ambiente.
- Utiliza as informações para construir modelos computacionais, configurando, controlando e ajustando aplicações para atender às necessidades de um dispositivo ou usuário.
- Ambiente povoado de sensores, computação e aplicações, capazes de detectar a existência e interagir com outros integrantes.

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/comp_pervasiva.png" alt="Computação Pervasiva" />
</figure>

### Computação Ubíqua

Com ideia de tornar a interação homem-computador invisível e/ou imperceptível, sendo uma união da computação móvel com a pervasiva.

Termo cunhado por Mark Weiser (1988), no artigo *"The Computer for the 21st Century"* para a *Scientific American* (1991):

<p class="pull-quote">"The most profound technologies are those that disappear. They weave themselves into the fabric of everyday life until they are indistinguishable from it."</p>

- Mobilidade
- Presença distribuída
- Imperceptível
- Inteligente
- Altamente integrada fisicamente
- Interoperabilidade espontânea

### Pervasiva × Ubíqua

<div class="cols2">
<div>

**Pervasiva**

- Difundida em toda parte
- Orientada a tecnologia
- Computadores e dispositivos móveis

</div>
<div>

**Ubíqua**

- Computação em qualquer lugar
- Orientado a usuário ou aplicação
- Uso de dispositivos em geral

</div>
</div>

## Redes de Sensores

São parte da tecnologia que habilita a computação pervasiva/ubíqua.

- Usadas para processar informações: fazem mais que apenas comunicação, identificando variáveis do sistema, informações do ambiente e mudanças.
- Equipadas com dispositivo(s) de sensoriamento.
- Ligadas por rede sem fio (em geral).
- Recursos limitados: uso eficiente é essencial.
- Aplicações de medição e vigilância.

## Clusters e Grids

Relacionados à computação de alto desempenho, podendo fornecer paralelismo de tarefas.

<div class="cols2">
<div>

#### Cluster

- Processamento paralelo e distribuído.
- *Cluster* (*Network of Workstations*).
- Máquinas homogêneas, mesmo SO, rede estável e de alto desempenho.
- SSI (*Single System Image*), facilita gerenciamento de máquinas homogêneas com o mesmo sistema operacional e interconexão estável.

</div>
<div>

#### Grids (Grades)

- Máquinas heterogêneas: arquitetura, SO, rede...
- Podem possuir vários domínios administrativos.
- "Cluster de clusters".

</div>
</div>

::: details Grids em detalhe
Em sistemas distribuídos, os grids (ou grades) consistem em uma infraestrutura que integra recursos computacionais heterogêneos, os quais podem estar espalhados por diferentes locais e sob múltiplos domínios administrativos. Ao contrário dos clusters, que normalmente reúnem máquinas homogêneas com mesmo sistema operacional e configurações similares, os grids agregam nós com arquiteturas, sistemas operacionais e recursos variados, funcionando como um "cluster de clusters".

Essa abordagem possibilita a execução de aplicações de alta demanda computacional, aproveitando a capacidade total dos recursos disponíveis, enquanto oculta a complexidade inerente à sua heterogeneidade e distribuição física. Em outras palavras, os grids oferecem uma visão unificada dos recursos, facilitando o gerenciamento e a execução de tarefas que exigem alto desempenho e escalabilidade.
:::

## Sistemas Distribuídos de Sistemas (System-of-Systems)

Sistemas Distribuídos de Sistemas, ou *System-of-Systems* (SoS), representam uma evolução dos sistemas distribuídos tradicionais, em que vários sistemas autônomos, heterogêneos e distribuídos são interconectados e cooperam para atingir objetivos comuns, mantendo certa independência operacional. Essa abordagem é comum em contextos modernos como cidades inteligentes, ambientes industriais, sistemas de transporte, saúde digital e defesa.

- Autonomia dos sistemas componentes.
- Abordam sistemas ultra em larga escala (*Ultra Large Scale*).
- Distribuição física e lógica.
- Sistemas complexos.
- Dinamicidade e evolução.
- Sinergia funcional.
- Exemplo: gerenciamento ambiental para enchentes, integrando sensores, clusters, grids e computação móvel.

::: details Características de um SoS em detalhe
**Autonomia dos sistemas componentes**: cada sistema integrante de um SoS é completo e funcional por si só, com seus próprios objetivos, políticas e mecanismos de controle. Podem operar de forma independente, mesmo fora do contexto colaborativo do SoS.

**Distribuição física e lógica**: os sistemas componentes estão fisicamente dispersos e interagem via redes, formando uma estrutura altamente distribuída com múltiplas camadas e tecnologias.

**Heterogeneidade tecnológica**: diferentes sistemas podem utilizar plataformas, linguagens, protocolos e arquiteturas distintas, exigindo integração por meio de middleware, APIs e padrões abertos.

**Dinamicidade e evolução**: sistemas podem entrar ou sair do SoS dinamicamente, e a configuração do conjunto pode mudar com o tempo, o que exige tolerância a mudanças e mecanismos de adaptação.

**Sinergia funcional**: a união dos sistemas proporciona capacidades que nenhum deles teria isoladamente, promovendo funcionalidades mais ricas, escaláveis e adaptativas.
:::

## Comparativo

| Sistemas Distribuídos | Primitivos | Adaptados para Internet | Contemporâneos |
| --- | --- | --- | --- |
| **Escala** | Pequenos | Grandes | Ultragrandes |
| **Heterogeneidade** | Limitada, relativamente homogêneas | Significativa em termos de plataformas, linguagens e middleware | Maiores dimensões, incluindo estilos de arquitetura radicalmente diferentes |
| **Sistemas Abertos** | Não é prioridade | Prioridade significativa, com introdução de diversos padrões | Grande desafio para a pesquisa, com os padrões existentes ainda incapazes de abranger sistemas complexos |
| **Qualidade de Serviço** | Em seu início | Prioridade significativa, com introdução de vários serviços | Grande desafio para a pesquisa, com os serviços existentes ainda incapazes de abranger sistemas complexos |

---

**Próxima página:** [04: Modelos de Arquitetura →](/sistemasDistribuidos/modelos-arquitetura)

<style scoped src="./shared.css"></style>
