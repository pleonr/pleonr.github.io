---
title: "Sistemas Distribuídos: 05"
---

[← Sistemas Distribuídos](/sistemasDistribuidos/)

# Modelos Fundamentais: Interação e Tempo

<p class="lesson-subtitle">Desempenho de rede · Relógios físicos e drift · Sincronização · Sistemas síncronos/assíncronos · Algoritmo de Lamport</p>

Modelos fundamentais são usados para descrever sistemas distribuídos de forma mais abstrata, preocupando-se com requisitos, desempenho e confiabilidade. A comunicação ocorre através de troca de mensagens em rede, e os processos se comunicam. Eles abordam os aspectos essenciais dos sistemas distribuídos:

- Interação
- Falhas
- Segurança
- Desempenho e Confiabilidade

Esses modelos se concentram apenas nos elementos essenciais, com dois objetivos: tornar explícitas suposições relevantes, e generalizar o que é possível ou não (algoritmos de propósito geral e propriedades desejáveis). As garantias se baseiam em análises lógicas e provas matemáticas.

## Interação

- Processos interagem via troca de mensagens.
- Comunicação envolve fluxo de informações e coordenação/sincronização de atividades.
- Desafios: atrasos na comunicação, ordenação de eventos e sincronização de relógios (uso de relógios lógicos e algoritmos, ex.: Lamport).

Sistemas distribuídos são compostos de vários processos interagindo de diferentes formas (cliente/servidor, P2P, pub/sub, etc.). Cada processo possui algoritmo (sequência) e dados (variáveis), e a interação envolve transmissão e recepção de mensagens para coordenação e transferência de informações.

### Desempenho de rede

- **Latência**: tempo entre o início da transmissão e o início da recepção (inclui tempo de transmissão, atraso de rede e processamento).
- **Largura de banda**: volume total de dados transmitidos.
- **Jitter**: variação no atraso de transmissão entre mensagens.

## Relógios e Mensagens de Tempo

Nos sistemas distribuídos, cada computador possui seu próprio relógio interno. Entretanto, esses relógios não são perfeitamente sincronizados e podem apresentar diferenças de tempo ao longo da execução do sistema. Essa falta de sincronização pode gerar problemas na coordenação entre processos distribuídos, principalmente na ordenação de eventos e na consistência de dados.

**Problemas na sincronização de relógios:**

- Cada computador mede o tempo de forma independente, resultando em *timestamps* diferentes para eventos que ocorrem simultaneamente em diferentes máquinas.
- Mesmo que um ajuste inicial seja feito, os relógios continuam a variar ao longo do tempo devido à diferença nas taxas de oscilação dos cristais dos processadores.
- Esse desvio ao longo do tempo é chamado de ***drift***, a taxa na qual um relógio local se desvia de um relógio ideal e preciso.

::: details Um incidente real de sincronização
Na noite de 30 de junho para 1º de julho de 2012, na Inglaterra, muitos serviços online e sistemas ao redor do mundo falharam simultaneamente. Servidores travaram e pararam de responder; algumas linhas aéreas não conseguiam processar reservas ou entradas e saídas por várias horas, e voos ficaram parados. O incidente ficou associado à introdução de um *leap second* naquele dia, que expôs bugs de sincronização em diversos sistemas.
:::

Relógios são utilizados para medir tempo em sistemas distribuídos: agendamentos, *timeouts*, detecção de falhas, *retry*, performance e estatística, logs (gravar quando um evento ocorreu), validação de datas e tempo (cache).

### Relógios Físicos

Relógios de quartzo utilizam oscilações de cristais de quartzo para manter a precisão do tempo. São comuns em eletrônicos devido à sua estabilidade e baixo custo.

- O cristal de quartzo oscila em uma frequência fixa quando energizado.
- Um circuito eletrônico traduz essas oscilações em sinais de clock (efeito piezoelétrico).
- Esses sinais são usados para temporização e coordenação de pacotes de dados.

<img src="/sistemasDistribuidos/rossonadorquartzo.webp" class="img-center" alt="Ressonador de quartzo" style="max-width: 420px" />

### Erro em Quartz Clocks

Pequenos desvios na oscilação do cristal de quartzo podem levar a erros cumulativos, impactando a precisão de sistemas críticos que dependem de sincronização precisa. Essa variação, o *drift*, refere-se à variação gradual da frequência ao longo do tempo, e pode ser causada por diversos fatores como temperatura, idade do cristal e tensão de alimentação.

- *Drift* é medido em partes por milhão (ppm: *parts per million*).
- 1 ppm = 1 microssegundo por segundo = 86ms por dia. Em um ano são 32 segundos.

<img src="/sistemasDistribuidos/drif.png" class="img-center" alt="Drift de relógio" style="max-width: 480px" />

::: details Mitigando o drift
- Uso de compensadores térmicos (TCXO: *Temperature Compensated Crystal Oscillator*).
- Osciladores de quartzo controlados por fornos (OCXO: *Oven Controlled Crystal Oscillator*).
- Ajustes periódicos via sincronização com sinais de referência externos, como GPS ou NTP.
:::

### Leap Seconds

Todo ano em 30 de junho e 31 de dezembro, às 23:59:59 UTC (*Universal Time Coordinated*), astrônomos efetuam os cálculos para determinar a velocidade de rotação da Terra. Atualmente utilizamos duas principais formas de medir o tempo:

- Baseada em astronomia: GMT (*Greenwich Mean Time*), que leva em consideração a posição solar de acordo com a visualização no meridiano de Greenwich.
- Baseado em mecânica quântica: TAI (*International Atomic Time*). 1 dia é 24 × 60 × 60 × 9.192.631.770 períodos da frequência de ressonância do césio-133.

Os *leap seconds* são ajustes de tempo aplicados ao UTC, introduzidos para compensar a desaceleração da rotação da Terra e usados para manter o tempo atômico alinhado com o tempo astronômico.

<img src="/sistemasDistribuidos/leapsecond.jpg" class="img-center" alt="Leap second" style="max-width: 420px" />

### Estratégias de sincronização

Para reduzir os problemas causados pelo desvio de relógios e melhorar a coordenação em sistemas distribuídos, algumas estratégias podem ser usadas:

<div class="cols2">
<div>

#### Sincronização baseada em fonte externa

- Utiliza fontes externas precisas, como GPS e servidores de tempo atômico, para sincronizar os relógios dos computadores da rede.
- Possui precisão de até 1 microssegundo, mas tem limitações: não funciona bem em ambientes internos, e tem alto custo de implementação.

</div>
<div>

#### Protocolos de sincronização de tempo

- **NTP** (*Network Time Protocol*): amplamente utilizado na Internet para sincronizar relógios com precisão de milissegundos.
- **Protocolo de Cristian**: baseia-se na comunicação com um servidor confiável que fornece a hora correta.
- **Protocolo de Berkeley**: usado quando não há uma fonte externa confiável, sincronizando os relógios com base na média dos tempos dos computadores da rede.

</div>
</div>

## Sistemas Distribuídos Síncronos × Assíncronos

<div class="cols2">
<div>

#### Síncronos

- Tempos de execução com limites mínimos e máximos.
- Mensagens devem ser recebidas dentro de um tempo máximo conhecido.
- A taxa de desvio dos relógios é conhecida.
- Desafios: sem garantias, sistema não confiável; dificuldade em obter valores reais e garantir prazos sem alocar recursos necessários.

</div>
<div>

#### Assíncronos

- Não há garantias quanto aos tempos de execução ou atrasos nas transmissões.
- A maioria dos sistemas reais é assíncrona: compartilham tempo de processamento e acesso à rede sem sincronização rigorosa.
- Estratégias: uso de tempo limite de espera, execução concorrente de outras atividades.
- Qualquer solução válida para sistemas assíncronos pode ser aplicada em ambientes síncronos. Problemas podem surgir em sistemas de tempo real (ex.: transmissão multimídia).

</div>
</div>

## Ordenação de Eventos

Há a necessidade de determinar a ordem dos eventos: antes, depois ou simultâneos. Mesmo sem um relógio único, é possível descrever a execução pela ordem dos eventos.

O **algoritmo de Lamport** é uma técnica fundamental para ordenar eventos em sistemas distribuídos sem depender de um relógio global. Cada processo no sistema mantém um relógio lógico, um contador interno incrementado a cada evento local. Quando um processo envia uma mensagem para outro, ele anexa o valor atual do seu relógio. Ao receber a mensagem, o processo receptor atualiza seu relógio para o valor máximo entre o seu próprio e o *timestamp* recebido, incrementando-o em seguida.

Essa abordagem garante que se um evento A causou um evento B (por exemplo, A envia uma mensagem que B recebe), então o *timestamp* de A será menor que o *timestamp* de B. Assim, o algoritmo estabelece uma relação de causalidade parcial entre os eventos, permitindo que os sistemas distribuídos mantenham uma noção consistente de ordem mesmo na ausência de um relógio sincronizado. Essa ordenação é suficiente para respeitar a causalidade, mas não é uma ordenação total: eventos sem relação causal direta podem ter *timestamps* que não refletem uma ordem "real" sem critérios adicionais.

### Conceito de Ordem Causal (*Causality*)

Lamport propôs a relação *"happened-before"* (→) para definir a ordem dos eventos, uma relação baseada na física, que diz que causalidade é a relação entre causas e efeitos, derivada da teoria da relatividade de Einstein.

- Se dois eventos ocorrem no mesmo processo, o que ocorre primeiro tem precedência.
- Se um evento A envia uma mensagem e outro evento B recebe essa mensagem, então A → B.
- Se A → B e B → C, então A → C (transitividade).
- Essas regras criam uma ordem parcial dos eventos no sistema.

O algoritmo de Lamport é utilizado em diversos contextos: controle de concorrência em bancos de dados distribuídos, protocolos de exclusão mútua distribuída, sistemas de replicação distribuída (ex.: Google Spanner), e blockchain/consistência eventual em sistemas distribuídos.

```python
class Process:
  def __init__(self, process_id):
    self.process_id = process_id
    self.clock = 0

  def event(self):
    """Executa um evento interno e incrementa o relógio lógico."""
    self.clock += 1
    print(f"Processo {self.process_id} executou um evento. Novo relógio: {self.clock}")

  def send_message(self, receiver):
    """Envia uma mensagem para outro processo e inclui o relógio lógico."""
    self.clock += 1  # Incrementa antes de enviar
    print(f"Processo {self.process_id} enviando mensagem para {receiver.process_id} com timestamp {self.clock}")
    receiver.receive_message(self.clock)

  def receive_message(self, sender_clock):
    """Recebe uma mensagem, ajusta o relógio lógico."""
    self.clock = max(self.clock, sender_clock) + 1
    print(f"Processo {self.process_id} recebeu mensagem. Novo relógio: {self.clock}")
```

```python
P1 = Process(1)
P2 = Process(2)

P1.event()
P1.send_message(P2)
P2.event()
P2.send_message(P1)
```

Saída:

```bash
❯ python3 lamport.py
Processo 1 executou um evento. Novo relógio: 1
Processo 1 enviando mensagem para 2 com timestamp 2
Processo 2 recebeu mensagem. Novo relógio: 3
Processo 2 executou um evento. Novo relógio: 4
Processo 2 enviando mensagem para 1 com timestamp 5
Processo 1 recebeu mensagem. Novo relógio: 6
```

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/ordenacaoeventos.png" alt="Ordenação de Eventos" />
</figure>

---

**Próxima página:** [06: Dependabilidade e Modelos de Falha →](/sistemasDistribuidos/dependabilidade-falhas)

<style scoped src="./shared.css"></style>
