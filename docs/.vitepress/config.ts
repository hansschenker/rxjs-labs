import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'


export default withMermaid(
defineConfig({
srcDir: '.',
title: 'RxJS Labs',
description: 'Experiments and learnings around RxJS.',
cleanUrls: true,
themeConfig: {
nav: [
{ text: 'Introduction', link: '/' },
{ text: 'Guides', link: '/guides/getting-started' },
{ text: 'API', link: '/api/overview' },
{ text: 'Operators', link: '/operators/' },
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
],
'/operators/': [
{
text: 'Operator Families',
items: [
{ text: 'Start Here', link: '/operators/' },
{ text: 'Groups Index', link: '/operators/groups-index' },
{ text: 'Use Cases', link: '/operators/use-cases/' },
{ text: 'Glossary', link: '/operators/glossary' }
]
},
{
text: 'Groups',
items: [
{ text: '01 Creation / Generation', link: '/operators/groups/01-creation-generation' },
{ text: '02 Projection', link: '/operators/groups/02-projection' },
{ text: '03 Partitioning', link: '/operators/groups/03-partitioning' },
{ text: '04 Combining', link: '/operators/groups/04-combining' },
{ text: '05 Joining', link: '/operators/groups/05-joining' },
{ text: '06 Grouping', link: '/operators/groups/06-grouping' },
{ text: '07 Set Operations', link: '/operators/groups/07-set-operations' },
{ text: '08 Concurrency', link: '/operators/groups/08-concurrency' },
{ text: '09 Single Value', link: '/operators/groups/09-single-value' },
{ text: '10 Quantifiers', link: '/operators/groups/10-quantifiers' },
{ text: '11 Aggregation', link: '/operators/groups/11-aggregation' },
{ text: '12 Timing', link: '/operators/groups/12-timing' },
{ text: '13 Scheduling', link: '/operators/groups/13-scheduling' },
{ text: '14 Error Handling', link: '/operators/groups/14-error-handling' },
{ text: '15 Testing', link: '/operators/groups/15-testing' },
{ text: '16 Inspection', link: '/operators/groups/16-inspection' }
]
}
]
},
socialLinks: [{ icon: 'github', link: 'https://github.com/' }]
},
mermaid: {
// Aligns with your preference for strict rendering in docs
securityLevel: 'strict'
},
mermaidPlugin: {
class: 'mermaid'
}
})
)