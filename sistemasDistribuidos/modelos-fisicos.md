---
title: "Sistemas Distribuídos: 03"
---

[← Sistemas Distribuídos](/sistemasDistribuidos/)

# Modelos Físicos

<p class="lesson-subtitle">Sistemas primitivos, adaptados para Internet, contemporâneos e de sistemas · Computação móvel, pervasiva e ubíqua · Clusters e grids</p>

Coulouris organiza os modelos de sistemas distribuídos em três níveis, do mais concreto ao mais abstrato. O **modelo físico** descreve o hardware e as redes que efetivamente compõem o sistema, o **modelo arquitetural** (tema da [próxima aula](/sistemasDistribuidos/modelos-arquitetura)) descreve como os componentes de software se organizam e se comunicam sobre essa base física, e o **modelo fundamental** abstrai essas decisões de projeto para analisar propriedades gerais como interação, falhas e segurança. É por isso que o modelo físico é o ponto de partida, ele estabelece o "chão" concreto, os elementos de hardware e rede, sobre o qual as camadas de arquitetura e as análises mais abstratas se apoiam.

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
- **Exemplos:** redes Unix em LAN com NFS para compartilhamento de arquivos, e-mail primitivo via UUCP.
- **Desafios acentuados:** compartilhamento de recursos básico, heterogeneidade e sistemas abertos ainda pouco relevantes.

## Sistemas Distribuídos Adaptados para a Internet

- Evolução dos modelos primitivos (anos 90).
- Expansão com o crescimento da Internet (ex.: Google em 1996).
- Sistemas em maior escala, com nós interconectados globalmente.
- Aumento da heterogeneidade: hardware, SO, linguagens e middleware.
- Ênfase em padrões abertos e serviços web.
- **Exemplos:** a Web (HTTP/HTML, a partir de 1991), CORBA como padrão aberto de objetos distribuídos, motores de busca em larga escala como o Google (1996).
- **Desafios acentuados:** sistemas abertos (adoção de padrões públicos) e heterogeneidade crescente de plataformas.

## Sistemas Distribuídos Contemporâneos

- Evolução dos modelos anteriores.
- Impulsionados pela computação móvel, pervasiva/ubíqua e em nuvem.
- Sistemas distribuídos verdadeiramente globais e heterogêneos.
- *Smart Environments*.
- **Exemplos:** grades computacionais como o Grid5000, nuvens públicas como AWS e Google Cloud, redes de sensores em cidades inteligentes.
- **Desafios acentuados:** escalabilidade e heterogeneidade extremas, qualidade de serviço em escala global.

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

São parte da tecnologia que habilita a computação pervasiva/ubíqua, formando a camada de percepção que conecta o mundo físico ao restante do sistema distribuído (tema aprofundado na aula de IoT).

- Usadas para processar informações: fazem mais que apenas comunicação, identificando variáveis do sistema, informações do ambiente e mudanças.
- Equipadas com dispositivo(s) de sensoriamento (temperatura, umidade, movimento, luminosidade...).
- Ligadas por rede sem fio de baixo consumo (em geral).
- Aplicações de medição e vigilância.

::: details Restrições, agregação e protocolos
**Restrições de energia**: os nós sensores costumam operar com baterias de capacidade limitada, muitas vezes sem possibilidade prática de recarga ou troca. Isso torna o uso eficiente de energia um requisito de projeto central, e não um detalhe de otimização: protocolos de rede, algoritmos de roteamento e até a frequência de leitura dos sensores são pensados para maximizar o tempo de vida da rede, priorizando ciclos de baixo consumo (*sleep*) entre transmissões.

**Nó sensor × sink/gateway**: um nó sensor tem alcance e potência de transmissão curtos, comunicando-se apenas com vizinhos próximos em uma topologia de malha. O *sink* (ou *gateway*) é o nó que concentra os dados coletados pela rede e faz a ponte com a infraestrutura externa (Internet, servidores de processamento), geralmente com menos restrições de energia e maior capacidade de comunicação.

**Agregação de dados**: para economizar energia e banda, nós intermediários frequentemente combinam ou resumem as leituras recebidas dos vizinhos (média, máximo, contagem de eventos) antes de retransmitir, em vez de encaminhar cada leitura individualmente até o sink.

**Protocolos típicos**: ZigBee (baseado no IEEE 802.15.4, malha sem fio de baixo consumo e curto alcance) e 6LoWPAN (permite endereçamento e roteamento IPv6 mesmo em dispositivos com poucos recursos de processamento e memória).
:::

## Clusters e Grids

Relacionados à computação de alto desempenho, podendo fornecer paralelismo de tarefas.

<div class="cols2">
<div>

#### Cluster

- Processamento paralelo e distribuído.
- *Cluster* (*Network of Workstations*).
- Máquinas homogêneas, mesmo SO, rede estável e de alto desempenho.
- SSI (*Single System Image*): um único domínio administrativo, gerenciado como se fosse uma máquina só.

</div>
<div>

#### Grids (Grades)

- "Cluster de clusters": integra recursos heterogêneos e já distribuídos.
- Máquinas heterogêneas: arquitetura, SO, rede...
- Pode abranger vários domínios administrativos distintos.

</div>
</div>

<figure class="doc-figure">
<svg viewBox="0 0 480 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Topologia de um cluster: nós homogêneos conectados a um switch central dentro de um único domínio administrativo">
  <rect x="10" y="10" width="460" height="170" rx="12" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="24" y="32" font-size="12" fill="var(--vp-c-text-2)">Domínio administrativo único · LAN de alto desempenho</text>
  <rect x="205" y="80" width="70" height="34" rx="6" fill="var(--vp-c-brand-1)" fill-opacity="0.15" stroke="var(--vp-c-brand-1)" stroke-width="1.5"/>
  <text x="240" y="101" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">Switch</text>
  <g fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)" stroke-width="1.5">
    <rect x="40" y="45" width="70" height="34" rx="6"/>
    <rect x="40" y="115" width="70" height="34" rx="6"/>
    <rect x="370" y="45" width="70" height="34" rx="6"/>
    <rect x="370" y="115" width="70" height="34" rx="6"/>
  </g>
  <g font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">
    <text x="75" y="66">Nó 1</text>
    <text x="75" y="136">Nó 2</text>
    <text x="405" y="66">Nó 3</text>
    <text x="405" y="136">Nó 4</text>
  </g>
  <g stroke="var(--vp-c-divider)" stroke-width="1.5">
    <line x1="110" y1="62" x2="205" y2="90"/>
    <line x1="110" y1="132" x2="205" y2="104"/>
    <line x1="370" y1="62" x2="275" y2="90"/>
    <line x1="370" y1="132" x2="275" y2="104"/>
  </g>
</svg>
<figcaption>Cluster: nós homogêneos, rede estável, único domínio administrativo.</figcaption>
</figure>

<figure class="doc-figure">
<svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Topologia de um grid: dois domínios administrativos com nós heterogêneos interligados pela Internet/WAN">
  <rect x="10" y="20" width="180" height="150" rx="12" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="24" y="42" font-size="12" fill="var(--vp-c-text-2)">Domínio A</text>
  <rect x="370" y="20" width="180" height="150" rx="12" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="384" y="42" font-size="12" fill="var(--vp-c-text-2)">Domínio B</text>
  <g fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)" stroke-width="1.5">
    <rect x="30" y="60" width="60" height="30" rx="6"/>
    <circle cx="150" cy="75" r="20"/>
    <rect x="30" y="120" width="60" height="30" rx="6"/>
    <rect x="390" y="60" width="60" height="30" rx="6"/>
    <circle cx="510" cy="75" r="20"/>
    <rect x="390" y="120" width="60" height="30" rx="6"/>
  </g>
  <g font-size="11" text-anchor="middle" fill="var(--vp-c-text-1)">
    <text x="60" y="79">Cluster A1</text>
    <text x="150" y="79">SO Y</text>
    <text x="60" y="139">SO X</text>
    <text x="420" y="79">Cluster B1</text>
    <text x="510" y="79">SO Z</text>
    <text x="420" y="139">SO W</text>
  </g>
  <ellipse cx="280" cy="95" rx="70" ry="40" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-brand-1)" stroke-width="1.5"/>
  <text x="280" y="99" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">Internet / WAN</text>
  <g stroke="var(--vp-c-divider)" stroke-width="1.5">
    <line x1="190" y1="80" x2="212" y2="90"/>
    <line x1="190" y1="130" x2="212" y2="105"/>
    <line x1="370" y1="80" x2="348" y2="90"/>
    <line x1="370" y1="130" x2="348" y2="105"/>
  </g>
</svg>
<figcaption>Grid: nós heterogêneos, sob múltiplos domínios administrativos, interligados por WAN/Internet.</figcaption>
</figure>

::: details Grids em detalhe
Um grid oferece uma visão unificada sobre recursos heterogêneos e já geograficamente distribuídos: middleware de grid (ex.: Globus Toolkit) oculta de quem submete uma tarefa o fato de que ela pode rodar em máquinas com arquiteturas, sistemas operacionais e políticas de acesso diferentes, mantidas por organizações distintas.

Isso traz um desafio que o cluster não tem: cada domínio administrativo mantém autonomia sobre seus próprios recursos e políticas de segurança, então o grid precisa negociar autenticação e alocação entre organizações (ex.: via certificados X.509 e federações de identidade), em vez de apenas gerenciar uma única máquina lógica.

**Exemplos:** Grid5000 (infraestrutura de pesquisa francesa), Open Science Grid e o antigo projeto SETI@home como grid voluntário de larga escala.
:::

### Cluster × Grid

| Aspecto | Cluster | Grid |
| --- | --- | --- |
| **Homogeneidade** | Alta: mesmo hardware e SO | Baixa: arquiteturas, SOs e recursos variados |
| **Domínio administrativo** | Único | Múltiplos, com autonomia entre si |
| **Gerenciamento** | Centralizado, SSI (visto como uma máquina) | Federado/descentralizado, via middleware de grid |
| **Tipo de rede** | LAN dedicada, alta performance, baixa latência | WAN/Internet, latência e disponibilidade variáveis |

## Sistemas Distribuídos de Sistemas (System-of-Systems)

Sistemas Distribuídos de Sistemas, ou *System-of-Systems* (SoS), representam uma evolução dos sistemas distribuídos tradicionais, em que vários sistemas autônomos, heterogêneos e distribuídos são interconectados e cooperam para atingir objetivos comuns, mantendo certa independência operacional. Essa abordagem é comum em contextos modernos como cidades inteligentes, ambientes industriais, sistemas de transporte, saúde digital e defesa.

- Autonomia dos sistemas componentes.
- Abordam sistemas ultra em larga escala (*Ultra Large Scale*).
- Distribuição física e lógica.
- Sistemas complexos.
- Dinamicidade e evolução.
- Sinergia funcional.
- Exemplo: gerenciamento ambiental para enchentes, integrando sensores, clusters, grids e computação móvel.
- **Desafios acentuados:** tratamento de falhas e transparência entre sistemas independentes, segurança na integração, escalabilidade ultra grande.

<figure class="doc-figure">
<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Topologia de um sistema de sistemas: sistemas autônomos e heterogêneos (rede de sensores, cluster, nuvem, dispositivos móveis) cooperando em torno de um ponto de integração, cada um mantendo sua própria fronteira">
  <text x="280" y="130" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">Cooperação /</text>
  <text x="280" y="146" font-size="12" text-anchor="middle" fill="var(--vp-c-text-1)">Integração</text>
  <circle cx="280" cy="130" r="46" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5" stroke-dasharray="4 4"/>

  <circle cx="90" cy="60" r="42" fill="none" stroke="var(--vp-c-divider)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text x="90" y="55" font-size="11" text-anchor="middle" fill="var(--vp-c-text-1)">Rede de</text>
  <text x="90" y="69" font-size="11" text-anchor="middle" fill="var(--vp-c-text-1)">sensores</text>

  <circle cx="470" cy="60" r="42" fill="none" stroke="var(--vp-c-divider)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text x="470" y="64" font-size="11" text-anchor="middle" fill="var(--vp-c-text-1)">Cluster</text>

  <circle cx="90" cy="205" r="42" fill="none" stroke="var(--vp-c-divider)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text x="90" y="200" font-size="11" text-anchor="middle" fill="var(--vp-c-text-1)">Computação</text>
  <text x="90" y="214" font-size="11" text-anchor="middle" fill="var(--vp-c-text-1)">móvel</text>

  <circle cx="470" cy="205" r="42" fill="none" stroke="var(--vp-c-divider)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text x="470" y="209" font-size="11" text-anchor="middle" fill="var(--vp-c-text-1)">Nuvem</text>

  <g stroke="var(--vp-c-divider)" stroke-width="1.5">
    <line x1="125" y1="80" x2="248" y2="108"/>
    <line x1="435" y1="80" x2="312" y2="108"/>
    <line x1="125" y1="185" x2="248" y2="152"/>
    <line x1="435" y1="185" x2="312" y2="152"/>
  </g>
</svg>
<figcaption>SoS: sistemas autônomos e heterogêneos cooperando, cada um mantendo sua própria fronteira e governança.</figcaption>
</figure>

::: details Características de um SoS em detalhe
**Autonomia dos sistemas componentes**: cada sistema integrante de um SoS é completo e funcional por si só, com seus próprios objetivos, políticas e mecanismos de controle. Podem operar de forma independente, mesmo fora do contexto colaborativo do SoS.

**Distribuição física e lógica**: os sistemas componentes estão fisicamente dispersos e interagem via redes, formando uma estrutura altamente distribuída com múltiplas camadas e tecnologias.

**Heterogeneidade tecnológica**: diferentes sistemas podem utilizar plataformas, linguagens, protocolos e arquiteturas distintas, exigindo integração por meio de middleware, APIs e padrões abertos.

**Dinamicidade e evolução**: sistemas podem entrar ou sair do SoS dinamicamente, e a configuração do conjunto pode mudar com o tempo, o que exige tolerância a mudanças e mecanismos de adaptação.

**Sinergia funcional**: a união dos sistemas proporciona capacidades que nenhum deles teria isoladamente, promovendo funcionalidades mais ricas, escaláveis e adaptativas.
:::

## Comparativo

| Sistemas Distribuídos | Primitivos | Adaptados para Internet | Contemporâneos | Sistemas de Sistemas (SoS) |
| --- | --- | --- | --- | --- |
| **Escala** | Pequenos | Grandes | Ultragrandes | Ultra em larga escala (*Ultra Large Scale*) |
| **Heterogeneidade** | Limitada, relativamente homogêneas | Significativa em termos de plataformas, linguagens e middleware | Maiores dimensões, incluindo estilos de arquitetura radicalmente diferentes | Máxima: cada sistema componente é completo, autônomo e tecnologicamente independente |
| **Sistemas Abertos** | Não é prioridade | Prioridade significativa, com introdução de diversos padrões | Grande desafio para a pesquisa, com os padrões existentes ainda incapazes de abranger sistemas complexos | Essencial para integração, mas dificultado pela governança distribuída entre sistemas independentes |
| **Qualidade de Serviço** | Em seu início | Prioridade significativa, com introdução de vários serviços | Grande desafio para a pesquisa, com os serviços existentes ainda incapazes de abranger sistemas complexos | Difícil de garantir de ponta a ponta, pois cada sistema componente preserva sua própria autonomia operacional |

---

**Próxima página:** [04: Modelos de Arquitetura →](/sistemasDistribuidos/modelos-arquitetura)

<style scoped src="./shared.css"></style>
