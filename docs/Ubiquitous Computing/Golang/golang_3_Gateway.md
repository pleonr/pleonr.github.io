# API Gateway

Um Gateway da API é um componente de rede que funciona entre o cliente e os serviços de backend.
Em vez de se comunicar diretamente com seu backend, os clientes enviam suas chamadas apenas para o gateway da API. (*Comunicação indireta*)

<figure markdown="span">
  ![](../../../assets/sd/apigatway.png)
</figure>

Lá, as solicitações recebidas podem ser processadas diretamente ou encaminhadas para os serviços subjacentes.
Dentre os serviços realizados por um gateway estão:

- Autenticação
- Controle de acesso
- Roteamento
- Balanceamento de carga
- Rate Limit
- Cache
- Monitoramento
- Monetização

O projeto de gateway que vamos usar como [exemplo](../../static/gateway.zip){:download="gateway"} tem a seguinte estrutura de pastas

```
├── docker-compose.yml
├── gateway/
│   ├── internal/
│   ├── main.go
│   └── Dockerfile
└── mockapi/
    ├── main.go
    └── Dockerfile
```

Para subir a estrutura de containers utilize

```bash
docker-compose up --build
```

Mande a requisição para o Gateway, ou várias requisições...

```bash
curl http://localhost:8000/

for i in {1..6}; do curl -i http://localhost:8000/; done
```

## Load Balancer (Balanceamento de Carga)

Distribui requisições entre múltiplos servidores backend, melhorando desempenho e tolerância a falhas.
Estratégias comuns
- Round-Robin (usada aqui)
- Least Connections
- Hash de IP

### Implementação em Go Round-Robin

```go
type LoadBalancer struct {
  servers []string
  index   int
  mutex   sync.Mutex
}

func (lb *LoadBalancer) NextServer() string {
  lb.mutex.Lock()
  defer lb.mutex.Unlock()
  server := lb.servers[lb.index]
  lb.index = (lb.index + 1) % len(lb.servers)
  return server
}
```


### Implementação em Go com Least Connections
```go
func getLeastConnBackend() string {
	mu.Lock()
	defer mu.Unlock()

	least := ""
	minConn := int(^uint(0) >> 1)

	for _, b := range backends {
		if failures[b] >= maxFailures {
			continue
		}
		if connCounts[b] < minConn {
			minConn = connCounts[b]
			least = b
		}
	}
	return least
}
```

## Circuit Breaker

Evita que o gateway continue tentando acessar servidores que estão falhando repetidamente.

1. O gateway detecta várias falhas consecutivas.
2. Ele "abre o circuito" e para de enviar requisições para o backend falho.
3. Após um tempo de espera, tenta novamente.

### Implementação

```go
type CircuitBreaker struct {
    failures   int
    lastFailed time.Time
    tripped    bool
}
```

Se o número de falhas exceder um limite (`failureThreshold`), o circuito "abre" por um tempo (`breakerTimeout`).

## Rate Limiting

Limita o número de requisições permitidas por IP em um intervalo de tempo.

- Proteger contra abuso e ataques DDoS.
- Melhorar estabilidade dos serviços backend.

### Implementação

```go
type Visitor struct {
    count    int
    lastSeen time.Time
}

var visitors = map[string]*Visitor{}
```

Se um IP exceder o número máximo de requisições no intervalo configurado, o acesso é negado com `429 Too Many Requests`.