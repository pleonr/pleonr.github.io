---
title: "Sistemas Distribuídos: 04"
---

[← Sistemas Distribuídos](/sistemasDistribuidos/)

# Modelos de Arquitetura

<p class="lesson-subtitle">Entidades e paradigmas de comunicação · Cliente-servidor · Peer-to-peer · Localização · Camadas e middleware</p>

Modelos de arquitetura descrevem sistemas distribuídos em termos de **componentes** e suas inter-relações. Dividem-se em:

- **Elementos**: como as entidades se comunicam, suas funções e localização.
- **Padrões de Arquitetura**: organizam camadas lógicas e físicas, clientes leves e serviços web.
- **Middleware**: abstrai e integra diferentes tecnologias e plataformas.

## Entidades em comunicação

Uma das primeiras decisões de projeto é identificar quais entidades irão interagir e como essa interação será realizada. Segundo Coulouris, as entidades ativas que compõem um sistema distribuído são processos executando em diferentes dispositivos, que se comunicam por meio de troca de mensagens. Essas entidades podem ser modeladas de várias formas, com diferentes níveis de abstração:

1. **Processos**
   - Unidade básica de execução em um sistema.
   - Podem representar uma aplicação completa ou uma parte dela.
   - Cada processo pode conter múltiplas threads para execução concorrente.
   - Em sistemas distribuídos, processos normalmente estão em máquinas diferentes e se comunicam por rede.

   > Coulouris destaca que processos em diferentes hosts não compartilham memória, por isso dependem exclusivamente da comunicação via mensagens.

2. **Objetos Distribuídos**
   - Extensão do modelo de objetos para sistemas distribuídos.
   - Cada objeto possui estado e métodos, e pode ser invocado remotamente (ex: Java RMI: *Remote Method Invocation*).
   - Necessitam de uma Interface de Definição de Objeto (IDL), que descreve os métodos disponíveis para acesso remoto.

3. **Componentes**
   - Mais flexíveis que objetos tradicionais.
   - Expõem interfaces explícitas e podem ser dinamicamente ligados/desligados.
   - Utilizados em arquiteturas baseadas em componentes distribuídos (ex: CORBA, COM+).
   - Possuem independência de linguagem e foco na reusabilidade.

4. **Serviços Web** (*Web Services*)
   - Entidades autônomas que oferecem funcionalidades acessíveis pela rede.
   - Utilizam padrões abertos (WSDL, SOAP, REST, etc).
   - Permitem interoperabilidade entre plataformas e linguagens distintas.
   - São componentes-chave em arquiteturas orientadas a serviços (SOA).

## Paradigmas de Comunicação

São os modelos abstratos que definem como entidades em um sistema distribuído interagem entre si por meio de mensagens. Eles variam quanto ao nível de acoplamento, flexibilidade e direcionamento da mensagem.

- **Comunicação entre processos**: baixo nível de suporte, API para programação de sockets.
- **Requisição-Resposta**: cliente envia solicitação, servidor processa e responde.
- **Invocação Remota**: RPC (*Remote Procedure Call*) e RMI (*Remote Method Invocation*).
- **Comunicação Indireta**: uso de filas, publish-subscribe, espaços de tupla e memória compartilhada distribuída (desacoplamento espacial e temporal).

### Comunicação entre processos (IPC)

Também chamado de IPC (*InterProcess Communication*), é o paradigma mais baixo nível.

- Requer que os processos saibam explicitamente onde o outro está (endereços e portas).
- É o paradigma mais primitivo, baseado em troca direta de mensagens entre processos.
- Usa APIs de sockets (ex: TCP, UDP) para envio e recebimento de dados.
- Tem baixo nível de abstração, exigindo maior controle do programador.
- Exemplo: comunicação entre dois serviços por TCP/IP.

### Requisição-Resposta e Invocação Remota

<div class="cols2">
<div>

#### Requisição-Resposta

- Padrão para troca de mensagens em interação cliente-servidor.
- Fluxo: cliente solicita → servidor processa e responde.
- Primitivo usado onde o desempenho é fundamental (ex.: HTTP).
- Aplicável tanto na comunicação entre processos quanto em invocação remota.

</div>
<div>

#### Invocação Remota

- **RPC**: inovação que permite chamar processos (ou máquinas) remotos como se fossem locais. O sistema oculta o processo de troca de mensagens.
- **RMI**: similar ao RPC, mas voltado para objetos.

</div>
</div>

### Comunicação Indireta

<div class="cols2">
<div>

- **Comunicação em Grupo**: envio de mensagem de um para vários; abstração que permite ingresso e envio sem conhecer os destinatários; registro de membros e identificação de falhas.
- **Publish-Subscribe**: produtores/publicadores disseminam eventos; consumidores/assinantes recebem via serviço intermediário e reagem a eventos.

</div>
<div>

- **Filas de Mensagens**: mensagens são enviadas para uma fila; o receptor retira quando desejar.
- **Espaços de Tupla**: inserção de informações estruturadas em espaços compartilhados e persistentes; retirada das informações quando leitores quiserem.
- **Memória Compartilhada Distribuída**: abstrai o compartilhamento de memória entre processos sem memória física compartilhada, com alto nível de transparência.

</div>
</div>

### Comparativo de paradigmas

| Paradigma | Acoplamento Espacial | Acoplamento Temporal | Comunicação | Exemplo |
| --- | --- | --- | --- | --- |
| Comunicação direta | Alto | Alto | Direta | Sockets (TCP/UDP) |
| Invocação remota | Médio | Alto | Direta | RPC, RMI, gRPC |
| Publish/Subscribe | Baixo | Baixo | Indireta | MQTT, Kafka, ROS |
| Filas de mensagem | Baixo | Baixo | Indireta | RabbitMQ, AWS SQS |
| Tuple Spaces | Baixo | Baixo | Indireta | JavaSpaces, Linda |
| Memória compartilhada | Baixo | Variável | Indireta | TreadMarks, DSM frameworks |

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/entidadeseparadigmas.png" alt="Entidades e Paradigmas de Comunicação" />
</figure>

## Funções e Responsabilidades: Cliente-Servidor × Peer-to-Peer

O estilo das funções é fundamental para a arquitetura global. Dois estilos básicos:

- **Cliente/Servidor**: mais citado na literatura, porém com desafios de escalabilidade.
- **Peer-to-Peer**: todos os nós com funções equivalentes, interagindo cooperativamente, com boa escalabilidade.

### Cliente/Servidor

O cliente faz requisições e consome serviços. O servidor processa as requisições e fornece recursos ou serviços. Esse modelo é amplamente utilizado na internet, sendo a base para serviços como websites, e-mails, bancos de dados e aplicações em nuvem.

- Servidores podem atuar como clientes de outros servidores (ex.: servidor web acessa um servidor de arquivos local ou serviços DNS).
- A interação pode ocorrer em múltiplos níveis.

#### Tipos de arquitetura cliente-servidor

- **Duas camadas (Two-tier)**: cliente comunica-se diretamente com o servidor. Ex.: um aplicativo acessando diretamente um banco de dados.
- **Três camadas (Three-tier)**: introduz uma camada intermediária (servidor de aplicação) para processar lógica de negócios. Ex.: um site que acessa um servidor de aplicação, que por sua vez consulta um banco de dados.
- **N camadas (Multi-tier)**: divide os serviços em várias camadas (frontend, backend, banco de dados, etc.). Ex.: sistemas de grande porte como Amazon e Google, com múltiplos servidores para diferentes funções.

<div class="cols2">
<div>

#### Cliente

- Envia requisições ao servidor.
  - **Ativo**: inicia o fluxo de processamento.
  - Objetivo: consultar ou alterar o estado do recurso.
- Geralmente reside em nó diferente do servidor.
- Fluxo: envia requisição → aguarda retorno → lê e processa resposta.

</div>
<div>

#### Servidor

- Mantém o recurso a ser acessado (arquivos, BD, impressora, etc.).
- Reage a pedidos de processamento.
- Geralmente reside no mesmo nó do recurso.
- Fluxo: ouve uma porta → aceita conexões → processa requisições → devolve resposta.

</div>
</div>

<div class="adv-grid">
<div>

#### Vantagens

- **Centralização do controle**: o servidor gerencia os recursos e a segurança.
- **Facilidade de manutenção**: atualizações ocorrem no servidor, sem necessidade de alterar todos os clientes.
- **Segurança**: controle de acesso mais rigoroso e dados protegidos no servidor.

</div>
<div>

#### Desvantagens

- **Ponto único de falha**: se o servidor falha, todos os clientes são afetados.
- **Carga no servidor**: um grande número de clientes pode sobrecarregar o servidor.
- **Menos escalável que P2P**: dependendo da infraestrutura, pode ter dificuldades em lidar com milhões de conexões simultâneas.

</div>
</div>

### Peer-to-Peer (P2P)

A arquitetura P2P é um modelo de comunicação em sistemas distribuídos onde os participantes (nós) atuam como pares (*peers*), sem distinção rígida entre clientes e servidores. Cada nó pode funcionar tanto como fornecedor quanto como consumidor de recursos: o P2P distribui a carga entre os próprios participantes.

- Os nós executam funções semelhantes e interagem cooperativamente.
- Podem ser fornecedores ou consumidores de recursos.
- A comunicação depende da aplicação (ex.: BitTorrent).
- Importância na implementação dos algoritmos para distribuição e recuperação de recursos.

<div class="adv-grid">
<div>

#### Vantagens

- Alta disponibilidade de recursos
- Tolerância a falhas
- Custo-benefício
- Autonomia e dinamismo
- Distribuição de carga

</div>
<div>

#### Desvantagens

- Gerenciamento complexo (dificuldade de coordenar os peers)
- Problemas de segurança (compartilhamento não autorizado, vulnerabilidades abertas)
- Qualidade de serviço variável (dependendo da conectividade dos peers)

</div>
</div>

#### Arquiteturas P2P

- **Puras**: todos os nós são *peers* iguais (sem autoridade central). Um peer pode ser removido sem grandes problemas; cada peer mantém sua própria lista de peers vizinhos, e mensagens são retransmitidas até se obter resultado ou condição de parada.

  <figure class="doc-figure"><img src="/sistemasDistribuidos/p2pcomunicacao.png" alt="Comunicação P2P Pura" /></figure>

- **Híbridas**: existência de pelo menos um servidor central, que atua como terminal de roteamento (estático ou dinâmico) e facilita a interconexão entre peers. A maior parte do processamento ainda ocorre entre os peers.

  <figure class="doc-figure"><img src="/sistemasDistribuidos/p2phibrida.png" alt="Comunicação P2P Híbrida" /></figure>

- **Super-Peer**: nós com maior capacidade (*super-peers*) recebem conexões dos peers comuns, guardam informações e atuam como intermediários entre eles, interconectados entre si de forma P2P pura. Os peers comuns entram na rede através de conexão, fazem upload da lista de recursos compartilhados e podem se conectar a mais de um super-peer.

  <figure class="doc-figure"><img src="/sistemasDistribuidos/p2psuper.png" alt="Comunicação P2P Super-Peer" /></figure>

## Localização (Posicionamento)

Refere-se ao modo como as entidades (processos, servidores, componentes) são mapeadas na infraestrutura física do sistema distribuído. Esse posicionamento é essencial para determinar propriedades-chave:

- **Desempenho**: a latência e o tempo de resposta são impactados pelo posicionamento físico dos recursos computacionais.
- **Confiabilidade**: a replicação e a redundância dos servidores ajudam a aumentar a tolerância a falhas.
- **Segurança**: a localização dos componentes pode influenciar a exposição a ataques e vulnerabilidades.

Quatro modelos principais definem como os recursos e processos são distribuídos: múltiplos servidores, uso de cache e proxy server, código móvel, e agentes móveis.

### Múltiplos Servidores

Um serviço pode ser distribuído entre vários servidores, permitindo balanceamento de carga e maior escalabilidade.

- Distribuir recursos entre servidores.
- Manter réplicas.
- Exemplos: web, sistemas de diretório (LDAP), clusters.

### Cache e Proxy Server

Técnicas que armazenam dados temporariamente para reduzir o tempo de acesso e a carga sobre os servidores centrais.

- Funciona como cache em CPUs: mantém uma cópia local.
- Enquanto a cópia estiver válida, utiliza-a; caso contrário, busca na origem e armazena.
- Exemplos: browsers.

Um **Proxy Server** é um intermediário entre um cliente e um servidor final, usado para melhorar o desempenho, aumentar a segurança e otimizar a comunicação. No contexto dos modelos de localização, os servidores proxy desempenham papel fundamental na *caching* de dados, na filtragem de conteúdo e na otimização do tráfego de rede.

1. O cliente faz uma requisição para um recurso (ex.: um site).
2. O proxy intercepta a requisição e verifica se já possui uma cópia local do recurso.
3. Se estiver em cache: o proxy o fornece diretamente ao cliente, reduzindo latência e consumo de banda.
4. Se não estiver em cache: o proxy solicita a informação ao servidor real e a armazena para futuras requisições.
5. O proxy retorna a resposta ao cliente.

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/types-of-proxy-server.png" alt="Tipos de Proxy Server" />
</figure>

| Tipo de proxy | Descrição |
| --- | --- |
| **Forward Proxy** | Atua entre um cliente interno e a internet; permite controle de acesso e filtragem de conteúdo (ex.: empresas restringindo acesso a sites). |
| **Reverse Proxy** | Atua entre um cliente externo e servidores internos; melhora a segurança ocultando os servidores reais e distribuindo carga (ex.: NGINX, Apache). |
| **Transparent Proxy** | Intercepta requisições automaticamente, sem configuração manual do cliente; usado por ISPs e empresas para filtrar tráfego de forma imperceptível. |
| **Proxy de Cache** | Armazena temporariamente recursos frequentemente acessados para reduzir latência e tráfego (ex.: Squid). |
| **Proxy de Segurança** | Filtra tráfego malicioso e protege usuários contra ataques. |

::: details Mais tipos de proxy (referência)
- **Anônimo / Alta anonimidade**: oculta a identidade do usuário ao acessar a internet; a versão "alta anonimidade" também apaga informações antes de contatar o site de destino.
- **Distorting proxy**: se identifica como proxy, mas mascara sua própria identidade alterando o IP para um endereço incorreto. Útil para simular acesso de outro país.
- **Data center proxy**: hospedado em data centers, não afiliado a um ISP. Respostas rápidas e baratas, mas menor anonimidade.
- **Residential proxy**: usa o IP de um dispositivo físico real. Mais confiável, porém mais caro.
- **Público / Compartilhado**: acesso gratuito ou compartilhado entre múltiplos usuários. Baixo custo, mas lento e com risco de reputação compartilhada.
- **SSL proxy**: realiza decriptação entre cliente e servidor, útil contra ameaças que o protocolo SSL revela, mas conteúdo criptografado não pode ser cacheado.
- **Rotating proxy**: atribui um IP diferente a cada conexão. Ideal para *web scraping* em larga escala.
:::

### Código Móvel

Nessa estratégia, o cliente interage com o sistema (servidor) e faz *download* de um *applet*. O código do applet é baixado e interpretado pelo cliente (móvel ou não); o usuário interage com o applet, que se comunica com o servidor.

- Usuário armazena e executa código localmente.
- Vantagem: boa resposta interativa (reduz atrasos de rede).
- Permite comunicação onde o servidor atua ativamente enquanto o cliente permanece reativo.
- Exemplos: applets Java, JavaScript.

Exemplos práticos: applets Java executados no navegador do cliente; JavaScript no navegador, carregado de um servidor e executado localmente; scripts de automação enviados para servidores para execução local; plataformas IoT que atualizam dispositivos enviando apenas o código necessário.

### Agentes Móveis

São programas que podem se mover de um computador para outro enquanto estão em execução, carregando consigo tanto código quanto dados. Essa característica permite que executem tarefas distribuídas, otimizando a comunicação e o acesso a recursos de forma eficiente.

- **Autonomia**: podem operar de forma independente, sem necessidade de intervenção contínua do usuário.
- **Mobilidade**: têm a capacidade de migrar entre diferentes sistemas para realizar suas tarefas.
- **Interação**: podem se comunicar com outros agentes ou sistemas distribuídos.
- **Adaptabilidade**: podem modificar seu comportamento de acordo com o ambiente no qual estão executando.
- Exemplos: gerenciamento de sistemas (instalação/atualização de software em redes corporativas), comércio eletrônico (comparação de preços), monitoramento distribuído (coleta de métricas em diferentes locais).

<div class="adv-grid">
<div>

#### Vantagens

- **Redução de tráfego de rede**: o agente se desloca até o local onde a informação está armazenada, processa os dados e retorna apenas com os resultados relevantes.
- **Eficiência no acesso a recursos**: permite operações locais, reduzindo latências de rede.
- **Execução distribuída de tarefas**: pode dividir e processar grandes volumes de informações em diferentes máquinas.

</div>
<div>

#### Desvantagens

- **Riscos à segurança**: podem ser ameaças para os sistemas que visitam, acessando dados não autorizados.
- **Vulnerabilidade dos agentes**: podem ser comprometidos, impedindo a execução correta de suas tarefas ou sendo manipulados por terceiros.
- **Mecanismos de proteção**: identificação do emissor, definição clara dos recursos locais acessíveis, *sandboxing*, autenticação e controle de acesso, criptografia.

</div>
</div>

| Aspecto | Código Móvel | Agente Móvel |
| --- | --- | --- |
| **Estado de execução** | Não leva estado em andamento; inicia do zero no destino. | Carrega código, dados e **estado ativo**. |
| **Autonomia** | Depende do controle externo. | Atua autonomamente. |
| **Objetivo** | Executar lógica específica no destino. | Realizar tarefa completa, possivelmente migrando por vários nós. |

## Padrões de Arquitetura: Camadas e Middleware

Os padrões de arquitetura são baseados nos elementos de arquitetura dos sistemas distribuídos e fornecem estruturas recorrentes para melhorar o desempenho e a organização de sistemas. Não são soluções completas, mas ajudam a estruturar a solução de maneira eficiente. Principais elementos: camadas lógicas, camadas físicas, clientes leves (*thin clients*) e serviços web.

### Camadas Lógicas

Um sistema complexo é dividido em camadas, onde cada camada utiliza os serviços da camada inferior. As camadas superiores não conhecem os detalhes das inferiores. Isso possibilita modularidade, facilidade de manutenção e escalabilidade.

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/camadaslogicasservico.png" alt="Camadas Lógicas de Serviço" />
</figure>

A camada de **plataforma** consiste das camadas de hardware e software de baixo nível: fornece serviços implementados de formas variadas nos computadores e funciona como interface do sistema, facilitando comunicação e coordenação.

### Middleware

Segundo Coulouris, middleware é a camada de software que fica "entre" as aplicações e os sistemas subjacentes (como sistemas operacionais e redes), com o objetivo de ocultar as diferenças e a heterogeneidade dos ambientes distribuídos.

Em outras palavras, ele fornece um conjunto de serviços básicos (mecanismos de comunicação, coordenação e compartilhamento de dados) que permitem que os componentes de um sistema distribuído interajam de forma transparente, facilitando o desenvolvimento de aplicações sem que os desenvolvedores precisem se preocupar com os detalhes de implementação das comunicações ou com as especificidades de cada plataforma.

Essa definição enfatiza que o middleware não é apenas um "conector" entre diferentes sistemas, mas sim uma camada de abstração que viabiliza a construção e operação de sistemas distribuídos complexos ao oferecer um ambiente uniforme e integrado para a interação entre componentes heterogêneos.

- Camada de software que mascara a heterogeneidade dos sistemas.
- Representado por um conjunto de processos/objetos em diferentes computadores que interagem.
- Objetivo: fornecer elementos básicos para a construção de componentes de software distribuídos.

**Modelos de middleware**: primeiros exemplos são chamadas de procedimentos remotos (Sun RPC) e comunicação em grupo (ISIS). Classificações atuais (não exaustivas): baseados em eventos, serviços, máquinas virtuais, agentes, banco de dados, espaços de tuplas, memória compartilhada distribuída e sistemas P2P.

::: tip Middleware moderno
As classificações não são exatas nem fechadas: plataformas modernas tendem a oferecer soluções híbridas. O middleware facilita o desenvolvimento de aplicações distribuídas, mas tem limitações: a confiabilidade depende das aplicações, e nem sempre é possível abstrair toda a comunicação sem considerar necessidades específicas.
:::

### Camadas Físicas

Complementam as camadas lógicas, organizando-as em servidores apropriados. Relacionadas à decomposição funcional de uma aplicação: apresentação, lógica de negócio e acesso a dados. A arquitetura de camadas físicas garante que a distribuição e a comunicação entre os componentes considerem as limitações e capacidades do ambiente físico, proporcionando uma implantação mais eficiente e robusta.

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/2camadas.png" alt="Duas Camadas" />
  <figcaption>Duas camadas</figcaption>
</figure>

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/3camadas.png" alt="Três Camadas" />
  <figcaption>Três camadas</figcaption>
</figure>

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/ncamadas.png" alt="N Camadas" />
  <figcaption>N camadas: <a href="http://www.dsc.ufcg.edu.br/~jacques/cursos/j2ee/html/intro/intro.htm" target="_blank" rel="noopener noreferrer">Introdução ao J2EE</a></figcaption>
</figure>

### Clientes Magros (Thin Clients)

Camada de software com interface local para o usuário, acessando serviços de um computador remoto (servidor/nuvem). Utiliza a rede para conectar em outro dispositivo e usa os recursos do dispositivo onde conectou.

<div class="adv-grid">
<div>

#### Vantagens

- Uso de dispositivos simples, baratos e com poucos recursos.
- Melhora com serviços interligados em rede.

</div>
<div>

#### Desvantagens

- Limitações em aplicações com altas taxas de interação, processamento ou gráficos.
- Latência de rede e do sistema operacional.

</div>
</div>

Exemplos: Computação de Rede Virtual (VNC), Remote Desktop (MS e Apple), LTSP, e dispositivos de hardware específicos (KVM-over-IP, Wyse, Citrix, N-computing).

### Serviços Web

Os serviços web são um tipo de arquitetura de software baseada em padrões abertos que permitem a interoperabilidade entre diferentes sistemas e tecnologias.

- **Encapsulamento e Interface**: os serviços web são acessíveis via APIs bem definidas.
- **Padrões da W3C**: seguem padrões abertos como XML, JSON, SOAP e REST.
- **Interoperabilidade**: permitem a comunicação entre diferentes plataformas e linguagens de programação.

Exemplos: SOAP (*Simple Object Access Protocol*), REST (*Representational State Transfer*), GraphQL, WebSockets.

---

**Próxima página:** [05: Modelos Fundamentais →](/sistemasDistribuidos/modelos-fundamentais)

<style scoped src="./shared.css"></style>
