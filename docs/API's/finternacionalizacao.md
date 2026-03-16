# Internacionalização

Internacionalização(*internationalization*), abreviada como `i18n` (porque há 18 letras entre “i” e “n”), é o processo de preparar um software para ser facilmente adaptado a diferentes idiomas e regiões, sem modificar o código-fonte.
Ou seja: você “internacionaliza” uma aplicação antes de traduzir, tornando-a multilíngue-ready.

!!! tip
    i18n ≠ tradução. Tradução é uma parte da localização (l10n), que é o ato de adaptar o conteúdo a um idioma, cultura e convenções específicas.

| Conceito                | Abreviação | O que é                                                                  |
| ----------------------- | ---------- | ------------------------------------------------------------------------ |
| **Internacionalização** | **i18n**   | Tornar o software pronto para múltiplos idiomas.                         |
| **Localização**         | **l10n**   | Adaptar conteúdo (textos, datas, moedas) a um local específico.          |
| **Globalização**        | **g11n**   | Processo geral de projetar, desenvolver e lançar um produto globalmente. |


- Acesso global: usuários de diferentes países entendem e usam seu app.
- Conformidade cultural: símbolos, unidades e formatos corretos.
- Expansão de mercado: facilita entrada em novos países.
- Experiência do usuário: o idioma nativo aumenta engajamento.
- Acessibilidade: mensagens e interfaces culturalmente coerentes.


| Locale | Data       | Número   | Moeda       |
| ------ | ---------- | -------- | ----------- |
| pt-BR  | 26/10/2025 | 1.234,56 | R$ 1.234,56 |
| en-US  | 10/26/2025 | 1,234.56 | $ 1,234.56  |
| fr-FR  | 26/10/2025 | 1 234,56 | 1 234,56 €  |


## Adicionando a API REST

Primeiro vamos instalar as dependências ao projeto.

```bash
npm install i18n
```

## Estrutura de pastas

Crie uma pasta `locales/` com subpastas por idioma e arquivos por *namespace*.

```
.
├─ locales/
│  ├─ en.json
│  ├─ pt.json
│  ├─ fr.json
│  └─ es.json
```

!!! info "Exemplo de conteúdo"

    === "**`locales/en.json`**"
        ```json
        {
          "ok": "ok",
          "SERVICE_NAME": "rest",
          "MISSING_FIELDS": "username, password, and transaction are required",
          "SOAP_FAILURE": "Failed to contact SOAP service",
          "HEALTH": "API working perfectly."
        }
        ```
    === "**`locales/pt.json`**"
        ```json
        {
          "ok": "ok",
          "SERVICE_NAME": "rest",
          "MISSING_FIELDS": "username, password e transaction são obrigatórios",
          "SOAP_FAILURE": "Falha ao contatar serviço SOAP",
          "HEALTH": "API funcionando perfeitamente."
        }
        ```
    === "**`locales/fr.json`**"
        ```json
        {
          "ok": "ok",
          "SERVICE_NAME": "rest",
          "MISSING_FIELDS": "Nom d'utilisateur, mot de passe et transaction requis",
          "SOAP_FAILURE": "Échec de la connexion au service SOAP",
          "HEALTH": "L'API fonctionne parfaitement."
        }
        ```
    === "**`locales/es.json`**"
        ```json
        {
          "ok": "ok",
          "SERVICE_NAME": "rest",
          "MISSING_FIELDS": "Se requieren nombre de usuario, contraseña y transacción",
          "SOAP_FAILURE": "No se pudo contactar con el servicio SOAP",
          "HEALTH": "API funcionando perfectamente."
        }
        ```

## Adicionando a API rest

Adicionar o import da biblioteca

```javascript
const i18n = require('i18n');
```

Adicionar a configuração do `i18n`

```javascript
i18n.configure({
  locales: ['pt', 'en'], // Idiomas suportados
  defaultLocale: 'pt', // Idioma padrão
  directory: path.join(__dirname, 'locales'), // Pasta onde estão os arquivos .json
  extension: '.json',
  logDebugFn: function (msg) {
    console.log('i18n debug:', msg);
  },
  autoReload: true, // Recarrega arquivos em desenvolvimento
  updateFiles: false, // Não gera novos arquivos automaticamente
  syncFiles: true, // Garante que todos os arquivos tenham as mesmas chaves
  cookie: 'lang', // Nome do cookie que pode ser usado para setar a linguagem
  queryParameter: 'lang', // Parâmetro de query que pode ser usado para setar linguagem
});

app.use(i18n.init);
```

### healthcheck

```javascript
+app.get('/health', (req, res) => {
  const t = req.t || ((k) => k);
  res.setHeader('Content-Language', req.language || 'en');
  res.json({
    ok: true,
    service: req.__('SERVICE_NAME'),
    message: req.__('MESSAGE'),
    time: new Date().toISOString()
  });
});
```

### Ordem de prioridade:

`Content-Language` reflete o idioma detectado (por `?lang=pt-BR` ou header `Accept-Language`).

1. **Querystring**: `?lang=pt-BR|en|fr|es`
2. **Header**: `Accept-Language: pt-BR,pt;q=0.9,en;q=0.8`
3. **Fallback**: `en`

### Testes

Alguns testes usando curl

```bash
# Saúde (fallback: en)
curl -s http://localhost:4000/health | jq

# Saúde em pt-BR (header)
curl -s -H "Accept-Language: pt-BR" http://localhost:4000/health | jq

# Saúde em fr (query)
curl -s "http://localhost:4000/health?lang=fr" | jq

# Validação ausente em espanhol
curl -s -X POST -H "Content-Type: application/json" -H "Accept-Language: es" \
  -d '{}' http://localhost:4000/api/sign | jq
```


## Localization

O jeito mais elegante e eficiente de integrar funções de formatação de data e moeda com o `i18n` é criar um middleware o locale injetado na requisição (req.locale) pelo i18n.

```javascript
function mapLocale(i18nLocale) {
  switch (i18nLocale.toLowerCase()) {
    case 'pt':
      return 'pt-BR';
    case 'en':
      return 'en-US';
    default:
      return 'en-US'; // Fallback
  }
}

function formatCurrency(amount, i18nLocale, currencyCode) {
  const locale = mapLocale(i18nLocale);
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
    }).format(amount);
  } catch (e) {
    console.error(`Erro ao formatar moeda para locale ${locale}:`, e.message);
    return `${currencyCode} ${amount}`;
  }
}

function formatDate(dateValue, i18nLocale, options = {}) {
  const date = (dateValue instanceof Date) ? dateValue : new Date(dateValue);
  const locale = mapLocale(i18nLocale);

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC'
  };

  const finalOptions = Object.keys(options).length > 0 ? options : defaultOptions;

  try {
    return new Intl.DateTimeFormat(locale, finalOptions).format(date);
  } catch (e) {
    console.error(`Erro ao formatar data para locale ${locale}:`, e.message);
    return date.toISOString();
  }
}

module.exports = {
  formatCurrency,
  formatDate,
};
```

### Adicionar a API

```javascript
const { formatCurrency, formatDate } = require('./localeHelpers');

function localeMiddleware(req, res, next) {
  const locale = req.locale;
  res.locale = {
    formatCurrency: (amount, currencyCode) => formatCurrency(amount, locale, currencyCode),
    formatDate: (dateValue, options) => formatDate(dateValue, locale, options),
  };
  next();
}

app.use(i18n.init);
app.use(localeMiddleware);
```

Endpoint health atualizado para usar o localization

```javascript
app.get('/health', (req, res) => {
  const formattedTime = res.locale.formatDate(new Date(), {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'America/Sao_Paulo',
  });

  res.json({
    ok: res.__('ok'),
    service: res.__('SERVICE_NAME'),
    message: res.__('MESSAGE'),
    time: formattedTime,
  });
});
```