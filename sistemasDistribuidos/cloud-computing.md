---
title: "Sistemas Distribuídos: 10"
---

[← Sistemas Distribuídos](/sistemasDistribuidos/)

# Cloud Computing

<p class="lesson-subtitle">Definição do NIST · Modelos de serviço (SaaS/PaaS/IaaS) · Modelos de implantação · Fog e Edge Computing</p>

O [National Institute of Standards and Technology (NIST)](https://csrc.nist.gov/projects/cloud-computing) possui uma definição de referência:

<p class="pull-quote">A computação em nuvem é um modelo que permite acesso conveniente e sob demanda à rede, a um conjunto compartilhado de recursos computacionais configuráveis (por exemplo, redes, servidores, armazenamento, aplicativos e serviços) que podem ser provisionados e liberados rapidamente com o mínimo esforço de gerenciamento ou interação com o provedor de serviços. Este modelo de nuvem promove a disponibilidade e é composto por cinco características essenciais, três modelos de serviço e quatro modelos de implantação.</p>

## Características essenciais

<div class="cols2">
<div>

#### On-Demand Self Service

Um consumidor pode fornecer unilateralmente capacidades de computação, automaticamente, sem exigir interação humana com cada provedor do serviço.

#### Amplo acesso à rede

- Disponível na rede.
- Acessado através de mecanismos padrão.
- Plataformas heterogêneas de clientes finos ou grossos.

#### Elasticidade rápida

Os recursos podem ser provisionados de forma rápida e elástica: recursos virtuais praticamente ilimitados, prever um teto é difícil.

</div>
<div>

#### Multilocação / pool de recursos

Os recursos computacionais do provedor são agrupados para servir múltiplos consumidores.

- Armazenamento, processamento, memória, largura de banda de rede e máquinas virtuais.
- Independência de localização, sem controle sobre a localização exata dos recursos, com implicações importantes em desempenho, escalabilidade e segurança.

#### Segurança

A preocupação maior está na disponibilidade e não tanto na segurança: se os dados são armazenados na nuvem, sempre haverá riscos.

</div>
</div>

## Grid Computing × Utility Computing

<div class="cols2">
<div>

#### Grid Computing

A computação em grade utiliza vários computadores, geralmente distribuídos geograficamente, para trabalhar juntos como um supercomputador virtual e lidar com tarefas grandes e complexas, que seriam impraticáveis para uma única máquina.

- Combinação de recursos computacionais de vários domínios administrativos.
- Aplicações: computação paralela distribuída, "supercomputador" virtual.

</div>
<div>

#### Utility Computing

A computação utilitária é um modelo de negócio em que o provedor possui, opera e gerencia a infraestrutura e os recursos de computação, e os assinantes os acessam conforme e quando necessário, mediante aluguel ou medição.

- Computação sob demanda com cobrança conforme uso.
- Provedor gerencia infraestrutura, assinante paga por uso.

</div>
</div>

## Peopleware in Cloud

Quem são os participantes em cloud:

- **Provedores** (fornecedores): empresas que prestam serviço (vendem/alugam) recursos computacionais, capacidade de armazenamento ou processamento.
- **Contratantes** (desenvolvedores): empresas que contratam provedores para disponibilizar serviços aos seus clientes.
- **Consumidores** (usuários): pessoas ou empresas que utilizam serviços.

## Modelos de Serviço

- **SaaS** (*Software as a Service*): tudo é gerenciado pelos provedores de serviço.
- **PaaS** (*Platform as a Service*): provedor fornece alto nível de integração.
- **IaaS** (*Infrastructure as a Service*): contratante responsável pelo gerenciamento, "aluga" hardware para o serviço.

::: details Outros termos "as a Service"
- **TaaS**: *Information Technology as a Service*
- **GaaS**: *Game as a Service*
- **CaaS**: *Communication as a Service*
- **XaaS**: *Everything as a Service*
- **DBaaS**: *Database as a Service*
- **SECaaS**: *Security as a Service*
- **MBaaS**: *Mobile "backend" as a Service*
- **MaaS**: *Mainframe as a Service*
:::

<div class="cols2">
<div>

#### SaaS

- Provedor gerencia tudo.
- Usuário apenas acessa via *browser*.
- Exemplos: Google Workspace, Microsoft 365, Cisco WebEx.

</div>
<div>

#### PaaS

- Infraestrutura + ferramentas de desenvolvimento.
- Usuário desenvolve e disponibiliza apps.
- Vantagem: rápido desenvolvimento e *deploy*.
- Desvantagem: escolhas limitadas de tecnologia.
- Exemplos: Google App Engine, Windows Azure.

</div>
</div>

<div class="cols2">
<div>

#### IaaS

- Recursos básicos: computação, armazenamento, rede.
- Usuário controla SO e aplicações.
- Escalabilidade, custo-benefício.
- Exemplos: Amazon EC2, Google Compute Engine.

</div>
<div>

#### Modelos de Implantação

- **Privada**: uso exclusivo de uma organização.
- **Comunitária**: compartilhada por organizações com objetivos comuns.
- **Pública**: disponível ao público via terceiros.
- **Híbrida**: combinação de duas ou mais nuvens.

</div>
</div>

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/cloud_services.jpg" alt="Modelos de serviço em nuvem" />
</figure>

::: tip Uma analogia para SaaS/PaaS/IaaS
**On-premise** é fazer tudo em casa; **IaaS** é como comprar uma pizza congelada (a pizza vem pronta, você só assa); **PaaS** é como pedir *delivery* (alguém entrega, você só serve); **SaaS** é como ir a um restaurante (tudo é preparado e servido para você).
:::

## Fog Computing

**Fog Computing** (Computação em Névoa) é um modelo intermediário entre o *Edge* e a Nuvem. Os dados são processados em nós intermediários (chamados de *fog nodes*) que podem estar em roteadores, *gateways* ou servidores locais próximos ao *edge*.

**Exemplo**: câmeras de segurança enviam vídeos para um *gateway* local, que faz análise de movimento antes de enviar só o que for relevante para a nuvem.

<div class="cols2">
<div>

**Vantagens**

- Distribuição do processamento.
- Melhor gerenciamento de dados (pré-processamento antes de ir à nuvem).
- Maior escalabilidade em sistemas distribuídos.
- Complementa a Edge e a Cloud.

</div>
<div>

**Desvantagens**

- Privacidade e segurança.
- Autenticação frágil.

</div>
</div>

## Edge Computing

**Edge Computing** (Computação de Borda) é um modelo de computação em que o processamento de dados ocorre próximo da fonte de dados, ou seja, nos dispositivos ou servidores locais (a "borda" da rede), em vez de depender de *data centers* centralizados.

**Exemplo**: um carro autônomo processa em tempo real os dados dos sensores (câmeras, radar, etc.) no próprio veículo, sem enviar tudo para a nuvem.

<div class="cols2">
<div>

**Vantagens**

- Menor latência (respostas mais rápidas).
- Redução de tráfego de rede.
- Maior confiabilidade (funciona mesmo com conexão instável).
- Privacidade (dados podem ser processados localmente).

</div>
<div>

**Desvantagens**

- Limitação de hardware.
- Segurança.
- Complexidade.
- Custo.

</div>
</div>

## Diferença Principal

| Conceito | Onde processa? | Finalidade principal |
| --- | --- | --- |
| **Edge** | No dispositivo ou borda da rede | Respostas rápidas e locais |
| **Fog** | Em nós próximos, mas não no edge | Intermediário entre borda e nuvem |
| **Cloud** | Data centers centralizados | Processamento pesado e armazenamento |

---

**Próxima página:** [11: Internet das Coisas (IoT) →](/sistemasDistribuidos/iot)

<style scoped src="./shared.css"></style>
