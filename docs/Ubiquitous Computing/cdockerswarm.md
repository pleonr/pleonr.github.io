# Docker Swarm

Docker Swarm é uma ferramenta de orquestração de contêineres desenvolvida pela Docker Inc.

Ela permite criar e gerenciar um cluster de máquinas (nós) que executam contêineres de forma coordenada, garantindo alta disponibilidade, escalabilidade e balanceamento de carga. Enquanto o Docker tradicional lida com contêineres isolados em uma única máquina, o Swarm transforma várias máquinas (físicas ou virtuais) em um único host lógico.

| Conceito            | Descrição                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Cluster (Swarm)** | Conjunto de máquinas (nós) gerenciadas como uma única entidade.                                                |
| **Node (Nó)**       | Máquina (host) participante do cluster. Pode ser **manager** ou **worker**.                                    |
| **Manager Node**    | Responsável por gerenciar o estado do cluster, distribuir tarefas e executar o algoritmo de consenso.          |
| **Worker Node**     | Executa os contêineres e reporta seu status ao manager.                                                        |
| **Service**         | Conjunto de tarefas que executam uma mesma imagem de contêiner. É a unidade principal de implantação no Swarm. |
| **Task**            | Instância de um contêiner em execução dentro de um service.                                                    |
| **Overlay Network** | Rede virtual que permite a comunicação segura entre contêineres em diferentes hosts do cluster.                |


## Rodando no cluster

Precisamos indicar um dos nós do cluster como sendo o gerenciador:

```bash
docker swarm init --advertise-addr <IP_DO_MANAGER>
```

Isso cria o cluster e exibe um token para que outros nós possam se juntar. Depois os nós que vão participar do swarm devem se juntar ao manager:

```bash
docker swarm join --token <TOKEN> <IP_DO_MANAGER>:2377
```

Podemos listar os nós participantes com:

```bash
docker node ls
```

## Criando um serviço

Vamos criar um service chamado web com 3 réplicas do container nginx.

```bash
docker service create --name web --replicas 3 -p 80:80 nginx
```

Podemos listar e ver detalhes dos serviços em execução com:

```bash
docker service ls
docker service ps web
#docker service rm web remove o serviço
```

## Escalando serviços

```bash
docker service scale web=5 #definindo a quantidade de nós
```