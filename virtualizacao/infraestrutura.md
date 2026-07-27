---
title: Infraestrutura em Sistemas Distribuídos
---

[← Virtualização](/virtualizacao/)

# Infraestrutura em Sistemas Distribuídos

<p class="lesson-subtitle">Virtualização · Hypervisors · Conteinerização · Virtualização × Conteinerização</p>

Com o avanço dos modelos de computação distribuída, desde os sistemas primitivos até os contemporâneos, houve uma mudança significativa na forma como os recursos computacionais são utilizados. Inicialmente, sistemas utilizavam máquinas físicas dedicadas, exigindo configurações manuais e alto custo de manutenção.

À medida que os sistemas se tornaram mais heterogêneos e dinâmicos (impulsionados por paradigmas como a computação em nuvem, pervasiva e ubíqua), emergiu a necessidade de abstrair ainda mais a infraestrutura subjacente.

## Virtualização

Em vez de usar um único sistema físico para cada tarefa, a tecnologia de virtualização permite dividir o hardware em várias máquinas virtuais (VMs) que operam como sistemas independentes, com seu próprio sistema operacional e aplicações. Cada VM compartilha os recursos do hardware físico, mas opera de forma isolada das demais.

<figure class="doc-figure">
  <img src="/virtualizacao/virtualization.webp" alt="Virtualização" />
</figure>

Para gerenciar várias máquinas virtuais existe uma camada chamada **hypervisor**, como por exemplo VirtualBox, VMware, KVM. O hypervisor é responsável por dimensionar a máquina virtual, fornecer acesso, iniciar e desligar VMs, entre outras tarefas.

Existem dois tipos principais de hypervisors:

- **Hosted**: são softwares instalados na máquina e dependem de um sistema operacional, como VMware e VirtualBox.
- **Bare Metal**: esses softwares rodam diretamente no hardware do host, tendo um controle do host em mais baixo nível. Ex.: VMware ESXi, Microsoft Hyper-V e Citrix XenServer.

<div class="adv-grid">
<div>

#### Vantagens da Virtualização

- Isolamento total: cada VM opera de forma independente, com seu próprio sistema operacional, garantindo segurança e isolamento total.
- Compatibilidade: permite rodar múltiplos sistemas operacionais no mesmo hardware, como Windows e Linux.
- Facilidade de migração: as VMs podem ser facilmente migradas entre servidores físicos, facilitando o balanceamento de carga e a recuperação de desastres.
- Ambientes robustos e estáveis: cada VM possui seus próprios recursos alocados, tornando-as adequadas para aplicações pesadas.

</div>
<div>

#### Desvantagens da Virtualização

- Consumo de recursos: cada VM carrega um sistema operacional completo, o que consome mais memória e processamento.
- Inicialização mais lenta: devido ao sistema operacional independente, o tempo de inicialização das VMs tende a ser mais lento.
- Overhead do hypervisor: o hypervisor consome recursos do sistema físico, o que pode reduzir a eficiência em comparação com contêineres.

</div>
</div>

::: tip Divisão de recursos
A virtualização divide os recursos físicos (memória, disco e CPU) entre as VMs, que ficam isoladas umas das outras apesar de compartilharem o mesmo hardware. É o modelo usado, por exemplo, pelas instâncias EC2 da Amazon.
:::

## Conteinerização

A conteinerização é uma tecnologia que permite empacotar um aplicativo e suas dependências em um "container", que é um ambiente isolado, mais leve, e que roda em cima do sistema operacional.

A conteinerização compartilha o kernel do sistema operacional do host com múltiplos containers, usando recursos nativos. Cada container é uma instância isolada do ambiente necessário para o aplicativo, incluindo dependências e bibliotecas, mas sem precisar de um sistema operacional completo, sendo mais leve que a virtualização.

<figure class="doc-figure">
  <img src="/virtualizacao/container.png" alt="Conteinerização" />
</figure>

<div class="adv-grid">
<div>

#### Vantagens da Conteinerização

- Portabilidade: aplicações podem ser executadas de forma consistente em diferentes ambientes.
- Isolamento: contêineres são isolados, reduzindo conflitos entre dependências.
- Eficiência: contêineres são leves em comparação com máquinas virtuais, economizando recursos.
- Escalabilidade: fácil replicação e escalabilidade horizontal.

</div>
<div>

#### Desvantagens da Conteinerização

- Complexidade: configurações complexas podem ser desafiadoras para iniciantes.
- Persistência de dados: contêineres são efêmeros por padrão; gerenciar dados persistentes requer configuração adicional.
- Segurança: embora isolados, contêineres compartilham o mesmo kernel do sistema operacional host, o que pode representar um risco de segurança em algumas situações.

</div>
</div>

## Virtualização × Conteinerização

| Aspecto | Virtualização | Conteinerização |
| --- | --- | --- |
| Isolamento | Completo, com SO próprio | Compartilhamento do kernel do host |
| Consumo de recursos | Alto, devido ao SO completo | Baixo, devido ao compartilhamento do kernel |
| Inicialização | Mais lenta | Mais rápida |
| Portabilidade | Boa, depende dos hypervisors | Muito alta, independente de infraestrutura |
| Escalabilidade | Escalável, mas com overhead maior | Facilmente escalável, ideal para microsserviços |
| Segurança | Maior isolamento | Isolamento limitado |
| Uso ideal | Aplicações pesadas, múltiplos SOs | Microsserviços, aplicações leves e portáveis |

---

CANONICAL. Containerization vs. Virtualization. Disponível em: https://ubuntu.com/blog/containerization-vs-virtualization. Acesso em: 1 fev. 2025.

---

**Próxima página:** [Docker →](/virtualizacao/docker)

<style scoped src="./shared.css"></style>
