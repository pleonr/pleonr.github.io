---
title: "Sistemas Distribuídos: 11"
---

[← Sistemas Distribuídos](/sistemasDistribuidos/)

# Internet das Coisas (IoT)

<p class="lesson-subtitle">História e evolução da Web · Arquitetura em camadas · Modelos de comunicação (RFC 7452) · Aplicações</p>

## Internet

Rede mundial que interconecta diversas redes de países, empresas e organizações. Suporta múltiplas aplicações e comunicação entre pessoas, empresas e objetos.

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/historyofinternet.png" alt="História da Internet" />
</figure>

## Evolução da Internet e Web

<div class="cols2">
<div>

- **Web 1.0**: *read only web*, web do conhecimento, conexão entre pessoas, sem interatividade com os sites.
- **Web 2.0**: *read-write web*, web da comunicação, via de mão dupla, grande interatividade pelas plataformas (redes sociais).

</div>
<div>

- **Web 3.0**: cruzamento de dados: informações lidas por dispositivos, fornecendo informações semânticas; objetos interagem com pessoas e outros objetos.

**Internet das Coisas (IoT)**: conecta "coisas" (objetos físicos com sensores, controle e comunicação), integra dispositivos com software embarcado e conectividade, e permite trocas inteligentes de informações como um sistema nervoso digital.

</div>
</div>

<figure class="doc-figure">
  <img src="/sistemasDistribuidos/webtimeline.jpg" alt="Linha do tempo da Web" />
</figure>

## Histórico e Definições

<div class="cols2">
<div>

Kevin Ashton é às vezes chamado de "Inventor da IoT", pois usou o termo pela primeira vez em 1999 para descrever um sistema em que a internet se conecta ao mundo físico por meio de sensores onipresentes.

- **Termo IoT**: criado em 1999, uso de RFID para logística.
- **Definições recorrentes**: presença de objetos inteligentes conectados, comunicação com base em padrões, autonomia e interoperabilidade.
- Referências: CASAGRAS, Atzori et al., Vermesan et al., Minerva et al.

</div>
<div>

<p class="pull-quote">"The Internet of Things has the potential to change the world, just as the Internet did. Maybe even more so."</p>
<p class="pull-quote">"A Internet das coisas tem o potencial para mudar o mundo, bem como a internet fez. Talvez até mais."</p>

<img src="/sistemasDistribuidos/kevinashton2.webp" class="img-center" alt="Kevin Ashton" style="max-width: 280px" />

</div>
</div>

## Arquitetura em Camadas

A arquitetura em camadas na IoT organiza os componentes de sistemas IoT de maneira hierárquica, facilitando a integração, gerenciamento e segurança. Existem modelos com 3 e 5 camadas, dependendo do nível de detalhamento desejado.

<div class="cols2">
<div>

**3 Camadas (básica)**
- Sensores/Atuadores
- Comunicação
- Aplicações

</div>
<div>

**5 Camadas (expandida)**
- Percepção
- Rede
- Gerenciamento de recursos
- Processamento
- Aplicação

</div>
</div>

### Modelo de 3 Camadas

1. **Camada de Percepção** (*Perception Layer*): responsável por coletar dados do ambiente físico. Inclui sensores, RFID, câmeras, atuadores etc. Interface entre o mundo real e o mundo digital.
2. **Camada de Rede** (*Network Layer*): transmite os dados coletados para sistemas de processamento. Utiliza tecnologias como Wi-Fi, 4G/5G, ZigBee, LoRa etc. Pode incluir *gateways* e roteadores.
3. **Camada de Aplicação** (*Application Layer*): processa e exibe os dados ao usuário final. Ex: *dashboards*, aplicativos móveis, sistemas de controle. Fornece serviços específicos conforme a aplicação (agro, saúde, indústria etc.).

### Modelo de 5 Camadas

<div class="cols2">
<div>

1. **Camada de Percepção**: coleta de dados físicos com sensores e atuadores.
2. **Camada de Rede**: transmissão dos dados para camadas superiores.
3. **Camada de Processamento** (*Processing Layer*): processamento local ou na nuvem (edge, fog ou cloud computing); agrega, filtra e analisa os dados recebidos com resposta rápida.

</div>
<div>

4. **Camada de Serviço** (*Service Layer*): gerencia os serviços oferecidos pelo sistema IoT, abstrai a lógica de negócio e direciona os dados para os aplicativos corretos. *Middleware* e APIs estão presentes aqui.
5. **Camada de Aplicação**: interface com o usuário, exibe os resultados processados, adapta-se ao domínio de aplicação (*smart home*, saúde, cidades inteligentes etc.).

</div>
</div>

### Comparativo rápido

| Camada | 3 Camadas | 5 Camadas |
| --- | --- | --- |
| Percepção | ✓ | ✓ |
| Rede | ✓ | ✓ |
| Processamento | ✗ | ✓ |
| Serviço | ✗ | ✓ |
| Aplicação | ✓ | ✓ |

## Modelos de Comunicação IoT (RFC 7452)

A [RFC 7452](https://www.rfc-editor.org/rfc/rfc7452) descreve os principais modelos de comunicação usados em aplicações de IoT, considerando os desafios de dispositivos com recursos limitados. Esses modelos ajudam a guiar o projeto de sistemas eficientes e interoperáveis.

### 1. Dispositivo para Dispositivo (Device-to-Device: D2D)

Comunicação direta entre dois dispositivos IoT. Pode usar protocolos como CoAP ou MQTT. Exemplo: um sensor de movimento aciona diretamente uma lâmpada inteligente.

- Baixa latência.
- Sem necessidade de um servidor central.
- Desafiador em termos de segurança e descoberta de serviços.

<div class="cols2">
<div>

### 2. Dispositivo para Servidor (Device-to-Server: D2S)

Dispositivos se comunicam com servidores na nuvem ou *edge*. Os dados são armazenados, processados ou analisados remotamente.

- Alta escalabilidade.
- Centralização do processamento.
- Ideal para análise de *big data* ou *dashboards*.

</div>
<div>

### 3. Servidor para Servidor (Server-to-Server: S2S)

Troca de dados entre servidores que coletam informações de diferentes dispositivos ou regiões. Exemplo: integração entre sistemas de uma cidade inteligente (trânsito e energia).

- Integração de sistemas diversos.
- Escalável e flexível.
- Pode usar REST, HTTP, CoAP etc.

</div>
</div>

<div class="cols2">
<div>

### 4. Dispositivo para Interface do Usuário (Device-to-User Interface)

Dispositivo envia dados diretamente a um cliente (aplicativo móvel, navegador etc.), interface humana com o sistema IoT.

- Foco na interação com o usuário.
- Pode ocorrer via web, apps móveis ou painéis embarcados.
- Exemplo: sensor envia notificação para app de *smartphone*.

</div>
<div>

### Considerações da RFC 7452

- **Eficiência de rede**: essencial para dispositivos com pouca energia e largura de banda.
- **Escalabilidade**: arquiteturas devem crescer conforme o número de dispositivos aumenta.
- **Segurança e privacidade**: fundamentais em qualquer modelo de comunicação.
- **Descoberta de serviços**: dispositivos devem ser capazes de encontrar e se conectar com outros facilmente.

</div>
</div>

### Protocolos típicos em IoT

| Protocolo | Uso típico | Modelo comum |
| --- | --- | --- |
| CoAP | Comunicação leve (REST) | D2D, D2S |
| MQTT | Publish/Subscribe | D2S, S2S |
| HTTP/REST | Comunicação web | D2S, S2S, UI |

## Aplicações de IoT

<div class="cols2">
<div>

- **Residências**: segurança, climatização, sustentabilidade.
- **Transporte**: rastreamento, horários, detecção de falhas.
- **Automóveis**: direção autônoma, estacionamento automático.
- **Agronegócio**: monitoramento de clima, solo, rastreamento animal.

**Limitações e desafios**: segurança e privacidade, interoperabilidade, evolução tecnológica rápida, critérios para adoção.

</div>
<div>

**Novos termos em IoT**

- **IoMT**: Internet das Coisas Médicas / Multimídia / Militares
- **IIoT**: Industrial
- **AIoT**: Agricultura
- **IoCT**: Cidades
- **IoFT**: Finanças
- **IoG**: Bens
- **IoV**: Veículos
- **IoE**: Energia

**Dado vs Informação**: um número isolado (ex: 38) não é informação útil. Contextualizado ("38°C na pessoa X"), armazenado e comunicado, torna-se **informação útil**. Daí a necessidade de coleta, armazenamento e análise.

</div>
</div>

---

## Referências

AHMAD FAIZAR. *Evolution of Web: Web 1.0, Web 2.0, Web 3.0*. Disponível em: http://ahmadfaizar.blogspot.com/2018/08/evolution-of-web-web-10-web-20-web-30.html.

GIGANET. *A Brief History of the Internet*. Disponível em: https://www.giganet.uk/2022/03/18/a-brief-history-of-the-internet/.

PRASAD, Anand R.; BUFORD, John F. *Future Internet Services and Service Architectures*. 2011.

BOTTA, A.; DE DONATO, W.; PERSICO, V.; et al. Integration of Cloud computing and Internet of Things. *Future Generation Computer Systems*, 2016, 56(C): 684-700.

CHIANG, M.; ZHANG, T. Fog and IoT: An Overview of Research Opportunities. *IEEE Internet of Things Journal*, 2016, 3: 854-864.

WATERS, Ira. *Introduction to Cloud Computing*. University of Waterloo.

VENKATASUBRAMANIAN, Nalini. *Cloud Computing*. University of California.

RIZZARDI, Giovani. PPGCA, UPF. Slides da disciplina de estágio de docência. 2018.

CYBER SECURITY BRAZIL. "SaaS está morto", declara CEO da Microsoft. Disponível em: https://www.cybersecbrazil.com.br/post/saas-est%C3%A1-morto-declara-ceo-da-microsoft. Acesso em: 14 jan. 2025.

WEBER, T. S. *Um roteiro para exploração dos conceitos básicos de tolerância a falhas*. 2014. Disponível em: https://www.researchgate.net/publication/228681453_Um_roteiro_para_exploracao_dos_conceitos_basicos_de_tolerancia_a_falhas.

WEISER, Mark. The Computer for the 21st Century. *SIGMOBILE Mob. Comput. Commun. Rev.*, 1999, p. 3-11. Disponível em: https://dl.acm.org/doi/pdf/10.1145/329124.329126.

BDC NETWORK. *Taking Full Advantage of Smart Building Technology*. Disponível em: https://www.bdcnetwork.com/video/taking-full-advantage-smart-building-technology. Acesso em: 1 fev. 2025.

BRAINVIRE. *The Future of Mobile Computing*. Disponível em: https://www.brainvire.com/The-future-of-mobile-computing/. Acesso em: 1 fev. 2025.

NORTON. *DDoS Attacks*. Disponível em: https://us.norton.com/blog/emerging-threats/ddos-attacks. Acesso em: 1 fev. 2025.

SKETCHPLANATIONS. *The Two Generals' Problem*. Disponível em: https://sketchplanations.com/the-two-generals-problem. Acesso em: 1 fev. 2025.

FORTINET. *What is a Proxy Server? Definition, Uses & More*. Gorilla Cyber Glossary. Disponível em: https://www.fortinet.com/resources/cyberglossary/proxy-server. Acesso em: 12 ago. 2025.

UNIVERSITY OF ILLINOIS. Viable Solutions (seção "Deadlock") no curso CS 341: System Programming, Coursebook. Disponível em: https://cs341.cs.illinois.edu/coursebook/Deadlock#viable-solutions.

COFFMAN, Edward G.; ELPHICK, Melanie; SHOSHANI, Arie. System deadlocks. *ACM Computing Surveys (CSUR)*, v. 3, n. 2, p. 67-78, 1971. DOI: 10.1145/356586.356588.

DIJKSTRA, Edsger W. *Hierarchical ordering of sequential processes*. Disponível em: http://www.cs.utexas.edu/users/EWD/ewd03xx/EWD310.PDF. Acesso em: 7 set. 2025.

CANONICAL. Containerization vs. Virtualization. Disponível em: https://ubuntu.com/blog/containerization-vs-virtualization. Acesso em: 1 fev. 2025.

---

*Material adaptado do Professor Marcelo Trindade Rebonatto.*

<style scoped src="./shared.css"></style>
