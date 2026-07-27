---
title: "Sistemas Distribuídos: 07"
---

[← Sistemas Distribuídos](/sistemasDistribuidos/)

# Comunicação em Sistemas Distribuídos

<p class="lesson-subtitle">Comunicação direta × indireta · Sockets · Representação externa de dados · Message brokers e AMQP</p>

Este capítulo cobre os mecanismos concretos de comunicação entre processos distribuídos: comunicação direta (sockets, RPC/RMI), representação externa de dados, e comunicação indireta (filas, *message brokers*, *publish/subscribe*).

## Comunicação Direta

Na comunicação direta, os processos envolvidos se referenciam explicitamente um ao outro: um processo sabe exatamente para qual outro processo está enviando ou de quem está recebendo dados.

- Os processos se comunicam explicitamente, utilizando identificadores uns dos outros.
- Pode ser feita por meio de sockets, chamadas de procedimento remoto (RPC) ou invocações remotas de métodos (RMI).
- A comunicação pode ser síncrona (bloqueante) ou assíncrona (não bloqueante).
- Exige um nível maior de acoplamento entre os processos.

### Comunicação e canais

- Trocas de informações para cooperar e sincronizar aplicações.
- Trocas de mensagens usando primitivas básicas: `send` e `receive`, sobre canais de comunicação.
- **Canais** funcionam como uma fila de mensagens: `send` adiciona, `receive` retira.
- São a abstração da rede de comunicação: uma conexão lógica entre os processos, existente entre 2 processos que trocam mensagens.
- Limites de tempo: **síncronos** (com limite) ou **assíncronos** (sem limite).
- A fila de mensagens enviadas e ainda não recebidas é gerenciada pelo middleware, que mantém a ordem de envio do emissor (emissores diferentes podem ter ordens de envio alteradas entre si).

### Tipos de comunicação

<div class="cols2">
<div>

#### Persistente

- Mensagem armazenada até a entrega, pelo tempo necessário para a entrega ao receptor, em vários recursos de armazenamento.
- Emissor e receptor não precisam estar ativos simultaneamente: a aplicação emissora não precisa continuar executando após o envio, e a receptora não precisa estar em execução no momento do envio.

</div>
<div>

#### Transiente

- Mensagem armazenada apenas enquanto ambos estão ativos (interrupção).
- Descartada se o middleware ou o receptor não estiver disponível.

</div>
</div>

<div class="cols2">
<div>

#### Assíncrona

- Emissor continua sua execução logo após enviar a mensagem: ela é imediatamente armazenada em armazenamento temporário.
- `send` não bloqueante.
- `receive` pode ser bloqueante ou não bloqueante (buffer preenchido em background, notificação por *polling* ou interrupção).

</div>
<div>

#### Síncrona

- `send` e `receive` sincronizam: o emissor fica bloqueado até saber que sua mensagem foi recebida.
- O emissor pode ser bloqueado até o middleware assumir a transmissão, a mensagem ser entregue ao receptor, ou a requisição ser processada.
- Pode ser **discreta** (cada mensagem é uma unidade) ou **por fluxo** (várias mensagens relacionadas).

</div>
</div>

## Sockets

Um socket é o ponto de comunicação entre processos (originado no Unix BSD), usando os protocolos **TCP** e **UDP**. A comunicação ocorre entre o *socket* de um processo e o *socket* de outro, e estão presentes em Linux, Windows, macOS, Android etc. São identificados por IP, porta e protocolo.

Para realizar a comunicação: enviar (direcionar IP e porta) e receber (associar o socket a uma porta local); servidores divulgam portas. APIs disponíveis por linguagem: Java (`java.net`), Delphi (`TServerSocket`/`TClientSocket`), C (`socket.h`), Python (`socket`).

## Representação Externa de Dados

Programas lidam com estruturas de dados e objetos, mas mensagens são apenas sequências de bytes. É necessário converter dados em bytes (**serializar**) e bytes em dados (**desserializar**), em geral um processo transparente nos sistemas distribuídos.

- Tipos primitivos têm diferentes representações: inteiros (*big/little endian*), caracteres (ASCII, Unicode).
- São convertidos para formatos conhecidos, com indicação do formato remetente.
- Formatos comuns: **CDR** (CORBA), **XML**, **JSON**.

O processo de conversão tem dois nomes específicos:

- **Empacotamento** (*marshalling*): conjunto de dados → forma transmissível (antes da serialização).
- **Desempacotamento** (*unmarshalling*): dados transmitidos → estrutura original (após a deserialização).

### Sockets em Python: UDP

**Servidor**

```python
import socket

# Cria o socket UDP
servidor_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Associa o socket a um endereço e porta
servidor_socket.bind(("localhost", 12345))

print("Servidor UDP aguardando mensagens...")

while True:
    mensagem, endereco = servidor_socket.recvfrom(1024)
    print(f"Recebido de {endereco}: {mensagem.decode()}")

    resposta = "Mensagem recebida com sucesso!"
    servidor_socket.sendto(resposta.encode(), endereco)
```

**Cliente**

```python
import socket

# Cria o socket UDP
cliente_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

mensagem = "Olá, servidor UDP!"
cliente_socket.sendto(mensagem.encode(), ("localhost", 12345))

resposta, _ = cliente_socket.recvfrom(1024)
print("Resposta do servidor:", resposta.decode())

cliente_socket.close()
```

### Sockets em Python: TCP

**Servidor**

```python
import socket

servidor_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
servidor_socket.bind(("localhost", 12345))
servidor_socket.listen(1)
print("Servidor TCP aguardando conexão...")

conn, endereco = servidor_socket.accept()
print(f"Conectado por {endereco}")

mensagem = conn.recv(1024).decode()
print(f"Mensagem recebida: {mensagem}")
resposta = "Mensagem recebida com sucesso!"
conn.send(resposta.encode())

conn.close()
servidor_socket.close()
```

**Cliente**

```python
import socket

cliente_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
cliente_socket.connect(("localhost", 12345))

mensagem = "Olá, servidor TCP!"
cliente_socket.send(mensagem.encode())

resposta = cliente_socket.recv(1024).decode()
print("Resposta do servidor:", resposta)
cliente_socket.close()
```

**Diferenças principais em relação ao TCP**: UDP não exige conexão (não há `connect()` ou `listen()`/`accept()`), e é não confiável: mensagens podem se perder, chegar fora de ordem ou duplicadas. Em compensação, é mais leve e rápido, ideal para transmissões em tempo real (streaming, jogos online).

| Característica | TCP | UDP |
| --- | --- | --- |
| Conexão | Orientado a conexão | Sem conexão |
| Confiabilidade | Garante entrega, ordem e integridade | Não garante entrega nem ordem |
| Velocidade | Mais lento (pela confiabilidade) | Mais rápido |
| Uso típico | Web, e-mail, transferência de arquivos, bancos de dados | Streaming, jogos online, VoIP |

## Comunicação Indireta

Na comunicação indireta, os processos não precisam conhecer diretamente uns aos outros. A troca de informações ocorre por meio de um intermediário, como filas de mensagens, sistemas de publicação/assinatura ou middleware.

- Processos não precisam conhecer diretamente seus pares.
- Usa intermediários como filas de mensagens (*Message Queues*), tópicos (*Publish/Subscribe*) ou sistemas de armazenamento compartilhado.
- Reduz o acoplamento entre os processos, facilitando a escalabilidade.
- Pode ser assíncrona por natureza, permitindo maior flexibilidade e tolerância a falhas.

::: details Por que "indireta"? Uma analogia histórica
Em 1876, Alexander Graham Bell fez a primeira chamada telefônica e registrou a patente do telefone. A forma inicial de comunicação era uma conexão direta entre cada ponto de telefone e cada outro ponto. Ou seja, para cada ligação entre uma casa e outra era necessário um cabo dedicado entre elas. Um ano depois, em 1878, a quantidade de cabos passando por cima de postes, árvores e casas virou uma bagunça.

Para resolver esse problema, surgiu a primeira companhia telefônica desse tipo: cada casa era conectada à companhia, que fazia o redirecionamento da chamada para o destino correto. É o mesmo princípio, décadas depois, por trás de um *message broker*: em vez de cada aplicação se conectar diretamente a todas as outras, todas se conectam a um intermediário central que redireciona as mensagens.
:::

### Message Broker

*Message brokers*, também conhecidos como sistemas de mensageria, são sistemas desenhados para facilitar a troca de mensagens entre diferentes aplicações, serviços ou sistemas. Eles desacoplam o remetente (*producer*) de uma mensagem do receptor (*consumer*), permitindo sistemas mais escaláveis, confiáveis e de fácil manutenção.

Exemplos populares: [Kafka](https://kafka.apache.org/), [RabbitMQ](https://www.rabbitmq.com/), [Amazon SQS](https://aws.amazon.com/pt/sqs/), [ActiveMQ](https://activemq.apache.org/).

::: tip Kafka × ActiveMQ
*Message brokers* são uma espécie de *load balancer* de mensagens. A principal diferença entre eles: Kafka é uma plataforma distribuída de *streaming* de eventos, projetada para ingerir e processar volumes massivos de dados; ActiveMQ é um *message broker* tradicional que suporta múltiplos protocolos e padrões de mensageria mais flexíveis.
:::

Por que usamos sistemas de messageria:

- **Dissociação**: produtores e consumidores não precisam se conhecer ou estar online simultaneamente.
- **Escalabilidade**: permitem expandir produtores e consumidores de forma independente.
- **Confiabilidade**: podem persistir mensagens para garantir a entrega mesmo que o consumidor esteja temporariamente indisponível.
- **Balanceamento de carga**: distribui mensagens uniformemente entre os consumidores.
- **Comunicação assíncrona**: suporta comunicação sem bloqueio entre serviços.

**Funcionamento**: **producers** (aplicativos que enviam mensagens), **brokers** (recebem, armazenam e encaminham mensagens) e **consumers** (recebem mensagens do broker). Fluxo típico: um produtor envia uma mensagem para uma fila/tópico específico no broker; o broker armazena a mensagem; um consumidor se inscreve no tópico para receber e processar as mensagens.

### Protocolo AMQP

Dentre vários protocolos que podem ser utilizados para *message brokers*, o **AMQP** (*Advanced Message Queuing Protocol*: Protocolo Avançado de Enfileiramento de Mensagens) é um protocolo aberto e padronizado de camada de aplicação para *Middleware Orientado a Mensagens* (MOM). Foi projetado para envio e recebimento de mensagens assíncronas (que talvez, e normalmente, não têm uma resposta imediata), com o objetivo de ser altamente confiável, flexível e seguro para utilização em sistemas distribuídos.

<div style="text-align: center; margin: 1.5rem 0">
  <a href="https://www.amqp.org/" target="_blank" rel="noopener noreferrer"><img src="/sistemasDistribuidos/amqp-logo.png" alt="AMQP" style="max-width: 220px" /></a>
</div>

**Características principais do AMQP**:

- **Orientação a mensagens**: a comunicação é feita por meio da troca de mensagens, unidades de dados autodescritivas que podem conter diversos tipos de informação.
- **Roteamento**: as mensagens podem ser roteadas para diferentes destinos com base em critérios predefinidos, como chaves de roteamento ou tópicos.
- **Confiabilidade**: oferece mecanismos como confirmações de entrega, retransmissão automática e armazenamento persistente.
- **Segurança**: suporta autenticação, autorização e criptografia.

**Componentes principais**: **cliente** (aplicativo que se conecta ao broker para enviar/receber mensagens), **broker** (servidor central que gerencia o roteamento e a entrega), **exchange** (roteia mensagens para filas/tópicos conforme critérios predefinidos), **fila** (armazenamento temporário para mensagens aguardando consumo) e **tópico** (tipo especial de exchange que publica para todos os assinantes).

### Pub/Sub

O padrão *Pub/Sub* (Publicação/Assinatura) é um modelo de comunicação assíncrona amplamente utilizado para desacoplar produtores e consumidores de mensagens. Ele permite que aplicativos publiquem mensagens em um tópico central e que outros aplicativos se inscrevam para receber essas mensagens. As mensagens são entregues aos assinantes de forma assíncrona: editor e assinantes não precisam estar disponíveis ao mesmo tempo.

Vamos implementar um exemplo de Pub/Sub com o protocolo AMQP usando a biblioteca `pika` e o RabbitMQ.

#### Exemplo de distribuição: fanout

Em um sistema Pub/Sub, o padrão `fanout` é uma forma de distribuição de mensagens onde uma única mensagem publicada é enviada para múltiplos assinantes.

- O publicador envia uma mensagem para um tópico.
- Todos os assinantes daquele tópico recebem uma cópia da mensagem, independentemente do número de assinantes.

Por que o nome "fanout"? Imagine um leque (*fan*) se abrindo: uma única origem (mensagem publicada) se espalha para vários destinos (assinantes).

Por exemplo, um sensor de temperatura publica dados em um tópico `sensores/temperatura`, e três sistemas diferentes assinam esse tópico: um para armazenar no banco de dados, outro para gerar alertas, e outro para exibir em um painel.

#### 📦 Publisher (Publicador)

```python
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.exchange_declare(exchange='logs', exchange_type='fanout')

mensagem = "Hello, assinantes!"
channel.basic_publish(exchange='logs', routing_key='', body=mensagem)

print(f"[x] Mensagem enviada: {mensagem}")
connection.close()
```

#### 📦 Subscriber (Assinante)

```python
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.exchange_declare(exchange='logs', exchange_type='fanout')

result = channel.queue_declare(queue='', exclusive=True)
queue_name = result.method.queue

channel.queue_bind(exchange='logs', queue=queue_name)

def callback(ch, method, properties, body):
    print(f"[x] Recebido: {body.decode()}")

channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
channel.start_consuming()
```

#### Testando localmente

Suba o RabbitMQ com Docker (veja também a [aula de Docker](/virtualizacao/docker)):

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management
```

Execute o assinante:

```bash
python subscriber.py
```

Envie mensagens com o publisher (algumas vezes):

```bash
python publisher.py
```

Acesse `http://localhost:15672`. Login padrão, usuário e senha: `guest`.

### Resumindo: Direta × Indireta

| Comunicação | Direta | Indireta |
| --- | --- | --- |
| Dependência entre processos | Sim (os processos precisam se conhecer) | Não (usam um intermediário) |
| Exemplo de mecanismos | Sockets, RPC, RMI | Filas de mensagens, Publish/Subscribe, Middleware |
| Acoplamento | Alto | Baixo |
| Escalabilidade | Limitada | Maior flexibilidade |
| Tolerância a falhas | Baixa (se um processo falhar, pode afetar outro) | Alta (intermediários ajudam na resiliência) |

---

**Próxima página:** [08: Concorrência em Sistemas Distribuídos →](/sistemasDistribuidos/concorrencia)

<style scoped src="./shared.css"></style>
