# Comunicação Socket

Primeiro vamos criar um servidor importando a biblioteca socket, e fazer o bind no IP 0.0.0.0 e porta 12345 (escuta todas as interfaces).
O servidor vai ficar em espera por mensagens de clientes. Ao receber vai enviar uma resposta de mensagem recebida.

```python
# servidor_udp.py
import socket

servidor_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
servidor_socket.bind(("0.0.0.0", 12345))

print("Servidor UDP aguardando mensagens...")

while True:
    mensagem, endereco = servidor_socket.recvfrom(1024)
    print(f"Recebido de {endereco}: {mensagem.decode()}")
    servidor_socket.sendto("Mensagem recebida com sucesso!".encode(), endereco)
```

O cliente por sua vez pega o endereço do servidor de uma variável de ambiente SERVER_HOST e envia mensagens para o servidor.
Após cada envio espera a resposta do servidor.

```python
# cliente_udp.py
import socket
import os
import time

HOST = os.getenv("SERVER_HOST", "servidor")
PORT = 12345

cliente_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

for i in range(5):
    mensagem = f"Mensagem {i+1} do cliente"
    cliente_socket.sendto(mensagem.encode(), (HOST, PORT))
    resposta, _ = cliente_socket.recvfrom(1024)
    print("Resposta do servidor:", resposta.decode())
    time.sleep(1)

cliente_socket.close()
```

O Dockerfile abaixo utiliza a imagem do python para executar o servidor. Copia todos os arquivos e executa o CMD de acordo com o docker-compose.

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . .

CMD ["python", "servidor_udp.py"]
# Esse exemplo é para o servidor, o docker-compose usa o command para sobrescrever esse CMD
```

Por fim o `docker-compose` orchestra esses containers de acordo com suas funções.


!!! info "docker-compose"
    === "**servidor**"
        - Constrói a imagem localmente.
        - Expõe a porta 12345/udp.
        - Executa o servidor_udp.py.
        - Conecta à rede rede_udp.
    === "**cliente1, cliente2, cliente3**"
        - Constrói a mesma imagem do servidor.
        - Dependem do servidor (esperam ele iniciar).
        - Usam SERVER_HOST=servidor (resolvido via DNS da rede Docker).
        - Executam cliente_udp.py.
        - Conecta à rede rede_udp.
    === "**rede_udp**"
        - Garante que os serviços se vejam por nome (DNS Docker).

```yaml
version: "3.9"

services:
  servidor:
    build:
      context: .
    container_name: servidor_udp
    ports:
      - "12345:12345/udp"
    networks:
      - rede_udp
    command: python servidor_udp.py

  cliente1:
    build:
      context: .
    depends_on:
      - servidor
    environment:
      - SERVER_HOST=servidor
    networks:
      - rede_udp
    command: python cliente_udp.py

  cliente2:
    build:
      context: .
    depends_on:
      - servidor
    environment:
      - SERVER_HOST=servidor
    networks:
      - rede_udp
    command: python cliente_udp.py

  cliente3:
    build:
      context: .
    depends_on:
      - servidor
    environment:
      - SERVER_HOST=servidor
    networks:
      - rede_udp
    command: python cliente_udp.py

networks:
  rede_udp:
    driver: bridge
```

Para executar utilize `docker-compose up --build`