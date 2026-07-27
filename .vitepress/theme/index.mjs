import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { theme, useOpenapi } from 'vitepress-openapi/client'
import 'vitepress-openapi/dist/style.css'
// import '@catppuccin/vitepress/theme/macchiato/mauve.css'
import './everforest.css'
import spec from '../../public/openapi.json' with { type: 'json' }

const homeHeroLinks = [
  { title: 'Slides', details: 'Slides utilizados em aula.', link: 'http://www.leon.dev.br/slidev/' },
  // { title: 'Conteúdo', details: 'Material de apoio para nossas disciplinas', link: '/markdown-examples' }
]

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-after': () =>
        h(
          'div',
          { class: 'home-hero-links' },
          homeHeroLinks.map((item) =>
            h('a', { class: 'home-hero-link', href: item.link }, [
              h('strong', item.title),
              h('span', item.details)
            ])
          )
        )
    })
  },
  async enhanceApp({ app }) {
    const openapi = useOpenapi({
      spec,
      config: {
        server: {
          allowCustomServer: true
        },
        codeSamples: {
          availableLanguages: [
            { lang: 'curl', label: 'cURL', target: 'shell', client: 'curl', highlighter: 'bash', icon: 'curl' },
            { lang: 'javascript', label: 'JavaScript', target: 'js', client: 'fetch', highlighter: 'javascript', icon: '.js' },
            { lang: 'python', label: 'Python', target: 'python', client: 'requests', highlighter: 'python', icon: '.py' },
            { lang: 'go', label: 'Go', target: 'go', client: 'native', highlighter: 'go', icon: '.go' },
            { lang: 'rust', label: 'Rust', target: 'rust', client: 'reqwest', highlighter: 'rust', icon: '.rs' }
          ]
        }
      }
    })

    theme.enhanceApp({ app, openapi })
  }
}
