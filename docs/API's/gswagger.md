# Swagger

O [Swagger](https://swagger.io/) é um conjunto de ferramentas e especificações abertas voltadas para o desenvolvimento, documentação e consumo de APIs RESTful. Ele faz parte do OpenAPI Initiative( *especificação OpenAPI (OAS)* ), um padrão mantido pela Linux Foundation, que define uma forma padronizada de descrever APIs em um formato legível por humanos e por máquinas.

- **Swagger UI** → Interface gráfica para visualizar e testar endpoints.
- **Swagger Editor** → Editor online/local para escrever a documentação.
- **Swagger Codegen** → Gera código cliente/servidor automaticamente.
- **OpenAPI Specification (OAS)** → O formato (YAML/JSON) que define a API.

Embora algumas bibliotecas como `fastapi` do python, gera a documentação automaticamente, outros frameworks como express precisam da configuração manual.

- Documentação automática: gera páginas interativas de referência para as APIs.
- Teste interativo: você pode testar endpoints diretamente no navegador.
- Facilita integração: clientes e desenvolvedores entendem rapidamente como usar a API.
- Geração de código: cria automaticamente stubs de servidor e SDKs de cliente em diversas linguagens (Node.js, Java, Go, Python, etc.).
- Padrão amplamente adotado: compatível com ferramentas como Postman, Redoc, FastAPI, Express, NestJS, Spring Boot, etc.

O swagger também pode ser utilizado com tokens para [autenticação](https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/)

## Estrutura

```yaml
openapi: 3.0.3
info:
  title: API de Pedidos
  version: 1.0.0
servers:
  - url: https://api.exemplo.com
paths:
  /pedidos:
    get:
      summary: Lista todos os pedidos
      tags: [Pedidos]
      responses:
        '200':
          description: Lista retornada
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pedido'
  /pedidos:
    post:
      summary: Cria um novo pedido
      tags: [Pedidos]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pedido'
      responses:
        '201':
          description: Pedido criado
components:
  schemas:
    Pedido:
      type: object
      properties:
        id:
          type: integer
        produto:
          type: string
        quantidade:
          type: integer
        valor:
          type: number
```

## Instalação com Yaml

Uma das formas de trabalhar com o swagger no express é utilizando o middleware consumindo um arquivo `yaml`

```bash
npm install express swagger-ui-express yaml

const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('yaml');

const app = express();
const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDoc = yaml.parse(file);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
```


Depois vamos criar o `swagger.yaml` que vai conter toda a documentação, para visualizar esse arquivo podemos utilizar o [Swagger editor](https://editor.swagger.io/).

```yaml
openapi: 3.0.3
info:
  title: Example Service API
  version: 1.0.0
  description: |
    Documentação dos endpoints REST do serviço.
    Inclui **GET /health** e **POST /api/sign**.

servers:
  - url: http://localhost:3000
    description: Ambiente local

paths:
  /health:
    get:
      tags: [Health]
      summary: Verificação de saúde (health check)
      description: Retorna o status básico do serviço e o horário do servidor.
      responses:
        "200":
          description: Sucesso
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/HealthResponse"
              examples:
                exemplo:
                  value:
                    ok: "ok"
                    service: "example-service"
                    time: "2025-10-27T22:00:00.000Z"
        "500":
          description: Erro interno
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

  /api/sign:
    post:
      tags: [SOAP Bridge]
      summary: Assinar transação via SOAP
      description: >
        Recebe `username`, `password` e `transaction`, constrói um envelope SOAP
        e encaminha ao serviço remoto. Retorna o XML da resposta SOAP.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/SignRequest"
            examples:
              exemplo:
                summary: Exemplo de requisição
                value:
                  username: "john_doe"
                  password: "123456"
                  transaction: "<transaction>data</transaction>"
      responses:
        "200":
          description: Resposta XML retornada pelo serviço SOAP remoto
          content:
            application/xml:
              schema:
                type: string
              examples:
                exemplo:
                  value: |
                    <?xml version="1.0" encoding="UTF-8"?>
                    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                      <soap:Body>
                        <SignResponse>
                          <status>OK</status>
                          <signature>abc123xyz</signature>
                        </SignResponse>
                      </soap:Body>
                    </soap:Envelope>
        "400":
          description: Campos obrigatórios ausentes
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
              examples:
                missing_fields:
                  value:
                    error: "MISSING_FIELDS"
        "502":
          description: Falha ao contatar serviço SOAP remoto
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
              examples:
                soap_error:
                  value:
                    error: "Falha ao contatar serviço SOAP"
                    detail: "ECONNREFUSED"

components:
  schemas:
    HealthResponse:
      type: object
      required: [ok, service, time]
      properties:
        ok:
          type: string
          example: "ok"
        service:
          type: string
          example: "example-service"
        time:
          type: string
          format: date-time
          example: "2025-10-27T22:00:00.000Z"

    SignRequest:
      type: object
      required: [username, password, transaction]
      properties:
        username:
          type: string
          example: "john_doe"
        password:
          type: string
          example: "123456"
        transaction:
          type: string
          description: Conteúdo XML ou string com dados da transação.
          example: "<transaction>...</transaction>"

    Error:
      type: object
      properties:
        error:
          type: string
        detail:
          type: string
      example:
        error: "MISSING_FIELDS"
        detail: "Campo obrigatório ausente"
```




## Instalação JSdoc

Outra opção é através do `jsdoc`, o que pode ser mais verboso. Para isso, instale as bibliotecas necessárias

```bash
npm install swagger-ui-express swagger-jsdoc
```

Depois criamos um arquivo para a configuração do swagger no projeto `swaggerConfig.js`

```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST/SOAP Signer API',
      version: '1.0.0',
      description: 'API de gateway para o serviço de assinatura de transações SOAP. Documentação gerada a partir de comentários JSDoc.',
      contact: {
        name: 'Seu Nome ou Equipe',
        email: 'contato@exemplo.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: 'Servidor Local da API'
      },
    ],
  },
  apis: ['./*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
```

Depois adicione a dependência do swagger e o arquivo de configuração ao app.

```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
console.log(`Docs:         GET http://localhost:${PORT}/api-docs`);
```

#### Rotas

Para isso pode ser utilizado jsdoc ou um arquivo yaml para cada endpoint. No exemplo abaixo, está a configuração de `health` e `api/sign`.

```
/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verificação de saúde (health check)
 *     description: Retorna o status básico do serviço e o horário do servidor.
 *     operationId: getHealth
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             examples:
 *               exemplo_en:
 *                 summary: Exemplo (inglês)
 *                 value:
 *                   ok: "ok"
 *                   service: "users-service"
 *                   time: "2025-10-26T22:00:00.000Z"
 *               exemplo_pt:
 *                 summary: Exemplo (português)
 *                 value:
 *                   ok: "ok"
 *                   service: "servico-de-usuarios"
 *                   time: "2025-10-26T22:00:00.000Z"
 *       500:
 *         description: Erro interno inesperado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     HealthResponse:
 *       type: object
 *       required: [ok, service, time]
 *       properties:
 *         ok:
 *           type: string
 *           description: Texto traduzido do identificador i18n 'ok'.
 *           example: "ok"
 *         service:
 *           type: string
 *           description: Texto traduzido do identificador i18n 'SERVICE_NAME'.
 *           example: "users-service"
 *         time:
 *           type: string
 *           format: date-time
 *           description: Horário do servidor no formato ISO 8601.
 *           example: "2025-10-26T22:00:00.000Z"
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         code:
 *           type: string
 */
```

```
// Definição de Schemas (Modelos) para reuso na documentação.
// Coloque isso no topo do seu arquivo principal ou em um arquivo separado.
/**
 * @openapi
 * components:
 * schemas:
 * Transaction:
 * type: object
 * required:
 * - id
 * - payer
 * - payee
 * - amount
 * - currency
 * - description
 * properties:
 * id:
 * type: string
 * description: ID único da transação.
 * example: 'txn-12345'
 * payer:
 * type: string
 * description: Nome/ID do pagador.
 * example: 'Alice Silva'
 * payee:
 * type: string
 * description: Nome/ID do beneficiário.
 * example: 'Bob Santos'
 * amount:
 * type: number
 * format: float
 * description: Valor da transação.
 * example: 100.50
 * currency:
 * type: string
 * description: Moeda da transação (ex: BRL, USD).
 * example: 'BRL'
 * description:
 * type: string
 * description: Descrição da transação.
 * example: 'Pagamento de fatura'
 */

/**
 * @openapi
 * /api/sign:
 * post:
 * summary: Envia uma transação para ser assinada pelo serviço SOAP
 * tags:
 * - Transactions
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - username
 * - password
 * - transaction
 * properties:
 * username:
 * type: string
 * example: 'signerUser'
 * password:
 * type: string
 * format: password
 * example: 'senhaSecreta'
 * transaction:
 * $ref: '#/components/schemas/Transaction'
 * responses:
 * 200:
 * description: Transação enviada com sucesso. Retorna o envelope SOAP de resposta.
 * content:
 * application/xml:
 * schema:
 * type: string
 * example: |
 * <soap:Envelope>...</soap:Envelope>
 * 400:
 * description: Campos obrigatórios ausentes.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: 'username, password e transaction são obrigatórios'
 * 502:
 * description: Falha ao se comunicar com o serviço SOAP.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: 'Falha ao contatar serviço SOAP'
 * detail:
 * type: string
 * example: 'Detalhe: connect ECONNREFUSED 127.0.0.1:8443'
 */
```