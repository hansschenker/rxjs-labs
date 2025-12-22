import { defineConfig } from 'vitepress';

export default defineConfig({
  srcDir: '.',
  title: 'RxJS Labs',
  description: 'Experiments and learnings around RxJS.',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Introduction', link: '/' },
      { text: 'Guides', link: '/guides/getting-started' },
      { text: 'API', link: '/api/overview' }
    ],
    sidebar: {
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Getting Started', link: '/guides/getting-started' },
            { text: 'Patterns', link: '/guides/patterns' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API',
          items: [{ text: 'Overview', link: '/api/overview' }]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ]
  }
});
