import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json' with { type: 'json' }
import usuariosSpec from '../public/openapi-usuarios.json' with { type: 'json' }
import alucard from './shiki-themes/alucard.json' with { type: 'json' }

const openapiSidebar = useSidebar({
  spec,
  linkPrefix: '/operations/'
})

const usuariosSidebar = useSidebar({
  spec: usuariosSpec,
  linkPrefix: '/apisMicrosservicos/operations/'
})

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: "Prof. Leon Blog",
  description: "Place to share content.",
  appearance: true,
  srcExclude: ['exemplos/**'],
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  markdown: {
    theme: {
      // light: 'catppuccin-latte',
      // dark: 'catppuccin-macchiato',
      light: alucard,
      dark: 'everforest-dark',
    },
    math: true,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      {
        text: 'Content',
        items: [
          { text: 'Desenvolvimento Web', link: '/desenvolvimento-web' },
          { text: 'Virtualização', link: '/virtualizacao/' },
          { text: 'Sistemas Distribuídos', link: '/sistemasDistribuidos/' },
          { text: 'APIs e Microsserviços', link: '/apisMicrosservicos/' },
          { text: 'LaTeX', link: '/latex' }
          // { text: 'Markdown Examples', link: '/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/api-examples' },
          // { text: 'Users API', link: '/users-api' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Desenvolvimento Web',
        link: '/desenvolvimento-web',
        collapsed: true,
        items: [
          {
            text: 'Fundamentos HTML',
            link: '/htmlFundamentos/',
            collapsed: true,
            items: [
              {
                text: 'Introdução ao HTML',
                collapsed: true,
                items: [
                  { text: 'Visão geral', link: '/htmlFundamentos/html-introducao' },
                  { text: 'Exemplos interativos', link: '/htmlFundamentos/html-introducao-exemplos' }
                ]
              },
              {
                text: 'Tags e Elementos',
                collapsed: true,
                items: [
                  { text: 'Visão geral', link: '/htmlFundamentos/html-tags-elementos' },
                  { text: 'Exemplos interativos', link: '/htmlFundamentos/html-tags-elementos-exemplos' }
                ]
              },
              {
                text: 'Organização e Pontos de Atenção',
                collapsed: true,
                items: [
                  { text: 'Visão geral', link: '/htmlFundamentos/html-organizacao' },
                  { text: 'Exemplos interativos', link: '/htmlFundamentos/html-organizacao-exemplos' }
                ]
              }
            ]
          },
          {
            text: 'Fundamentos CSS',
            link: '/cssFundamentos/',
            collapsed: true,
            items: [
              {
                text: 'Aula 01: Introdução ao CSS',
                collapsed: true,
                items: [
                  { text: 'Visão geral', link: '/cssFundamentos/css-introducao' },
                  { text: 'Exemplos interativos', link: '/cssFundamentos/css-introducao-exemplos' }
                ]
              },
              {
                text: 'Aula 02: Propriedades CSS',
                collapsed: true,
                items: [
                  { text: 'Visão geral', link: '/cssFundamentos/css-propriedades' },
                  { text: 'Exemplos interativos', link: '/cssFundamentos/css-propriedades-exemplos' }
                ]
              },
              {
                text: 'Aula 03: Box Model & Flexbox',
                collapsed: true,
                items: [
                  { text: 'Visão geral', link: '/cssFundamentos/css-fundamentos' },
                  { text: 'Exemplos: Box Model', link: '/cssFundamentos/css-exemplos-box-model' },
                  { text: 'Exemplos: Posicionamento', link: '/cssFundamentos/css-exemplos-posicionamento' },
                  { text: 'Exemplos: Display', link: '/cssFundamentos/css-exemplos-display' },
                  { text: 'Exemplos: Flexbox', link: '/cssFundamentos/css-exemplos-flexbox' }
                ]
              }
            ]
          },
          {
            text: 'Fundamentos JavaScript',
            link: '/jsFundamentos/',
            collapsed: true,
            items: [
              {
                text: 'Aula 01: Introdução ao JavaScript',
                collapsed: true,
                items: [
                  { text: 'Visão geral', link: '/jsFundamentos/js-introducao' },
                  { text: 'Exemplos interativos', link: '/jsFundamentos/js-introducao-exemplos' }
                ]
              },
              {
                text: 'Aula 02: Funções, Condicionais e Loops',
                collapsed: true,
                items: [
                  { text: 'Visão geral', link: '/jsFundamentos/js-funcoes-controle' },
                  { text: 'Exemplos interativos', link: '/jsFundamentos/js-funcoes-controle-exemplos' }
                ]
              },
              {
                text: 'Aula 03: DOM, Eventos e Assincronismo',
                collapsed: true,
                items: [
                  { text: 'Visão geral', link: '/jsFundamentos/js-dom-eventos' },
                  { text: 'Exemplos interativos', link: '/jsFundamentos/js-dom-eventos-exemplos' }
                ]
              }
            ]
          }
        ]
      },
      {
        text: 'Virtualização',
        link: '/virtualizacao/',
        collapsed: true,
        items: [
          { text: 'Infraestrutura em Sistemas Distribuídos', link: '/virtualizacao/infraestrutura' },
          { text: 'Docker', link: '/virtualizacao/docker' },
          { text: 'Docker Swarm', link: '/virtualizacao/docker-swarm' }
        ]
      },
      {
        text: 'Sistemas Distribuídos',
        link: '/sistemasDistribuidos/',
        collapsed: true,
        items: [
          { text: '01: Introdução', link: '/sistemasDistribuidos/introducao' },
          { text: '02: Evolução e Definição', link: '/sistemasDistribuidos/evolucao-definicao' },
          { text: '03: Modelos Físicos', link: '/sistemasDistribuidos/modelos-fisicos' },
          { text: '04: Modelos de Arquitetura', link: '/sistemasDistribuidos/modelos-arquitetura' },
          { text: '05: Modelos Fundamentais', link: '/sistemasDistribuidos/modelos-fundamentais' },
          { text: '06: Dependabilidade e Falhas', link: '/sistemasDistribuidos/dependabilidade-falhas' },
          { text: '07: Comunicação', link: '/sistemasDistribuidos/comunicacao' },
          { text: '08: Concorrência', link: '/sistemasDistribuidos/concorrencia' },
          { text: '09: Bancos de Dados Distribuídos', link: '/sistemasDistribuidos/bancos-distribuidos' },
          { text: '10: Cloud Computing', link: '/sistemasDistribuidos/cloud-computing' },
          { text: '11: Internet das Coisas (IoT)', link: '/sistemasDistribuidos/iot' }
        ]
      },
      {
        text: 'APIs e Microsserviços',
        link: '/apisMicrosservicos/',
        collapsed: true,
        items: [
          { text: 'Aula 01: Introdução e Motivações', link: '/apisMicrosservicos/introducao' },
          { text: 'Aula 02: Tipos de API', link: '/apisMicrosservicos/tipos-de-api' },
          { text: 'Aula 03: Boas Práticas', link: '/apisMicrosservicos/boas-praticas' },
          { text: 'Aula 04: Documentação', link: '/apisMicrosservicos/documentacao' },
          { text: 'Aula 05: Node.js + Express', link: '/apisMicrosservicos/exemplo-node-express' },
          { text: 'Aula 06: Python + FastAPI', link: '/apisMicrosservicos/exemplo-python-fastapi' },
          { text: 'Aula 07: Go + Gin', link: '/apisMicrosservicos/exemplo-golang-gin' },
          { text: 'Aula 08: Elixir + Phoenix', link: '/apisMicrosservicos/exemplo-elixir-phoenix' },
          {
            text: 'API de Usuários (ao vivo)',
            link: '/apisMicrosservicos/exemplos-api',
            collapsed: true,
            items: [
              ...usuariosSidebar.generateSidebarGroups()
            ]
          }
        ]
      },
      {
        text: 'LaTeX',
        link: '/latex'
      }
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // },
      // {
      //   text: 'Users API',
      //   collapsed: true,
      //   items: [
      //     { text: 'Overview', link: '/users-api' },
      //     ...openapiSidebar.generateSidebarGroups()
      //   ]
      // }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pleonr' },
      { icon: 'instagram', link: 'https://instagram.com/pablo.leonrodrigues' },
      { icon: 'gmail', link: 'mailto:pablo.leonrodrigues@gmail.com' }
    ]
  },

  transformPageData(pageData) {
    const pageTitle = pageData.params?.pageTitle
    if (pageTitle) {
      pageData.title = pageTitle
      pageData.frontmatter ??= {}
      pageData.frontmatter.title = pageTitle
    }
  }
}))
