import { defineConfigWithTheme } from "vitepress";
import type { ThemeConfig } from 'pilgrim-theme'
import config from 'pilgrim-theme/config'

export default defineConfigWithTheme<ThemeConfig>({
  extends: config,
  title: 'Laravel Nova',
  description: 'Master Your Universe',
  base: '/docs/4.0/',
  cleanUrls: true,
  srcDir: 'src',

  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo-dark.svg',
    },
    nav: [
      { text: 'Docs', link: 'https://nova.laravel.com/docs' },
      { text: 'Releases', link: 'https://nova.laravel.com/releases' },
      { text: 'Course', link: 'https://laracasts.com/' },
    ],
    githubUrl: 'https://github.com/laravel/nova-issues',
    showVersionPicker: true,
    versions: [
      { text: 'v1.0', link: '/docs/1.0/' },
      { text: 'v2.0', link: '/docs/2.0/' },
      { text: 'v3.0', link: '/docs/3.0/' },
      { text: 'v4.0', link: '/docs/4.0/', current: true },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/installation' },
          { text: 'Release Notes', link: '/releases' },
          { text: 'Upgrade', link: '/upgrade' },
          { text: 'Support', link: '/support' },
          { text: 'Code of Conduct', link: '/code-of-conduct' },
        ],
      },
      {
        text: 'Resources',
        items: [
          { text: 'The Basics', link: '/resources/' },
          { text: 'Fields', link: '/resources/fields' },
          { text: 'Date Fields', link: '/resources/date-fields' },
          { text: 'File Fields', link: '/resources/file-fields' },
          { text: 'Repeater Fields', link: '/resources/repeater-fields' },
          { text: 'Relationships', link: '/resources/relationships' },
          { text: 'Validation', link: '/resources/validation' },
          { text: 'Authorization', link: '/resources/authorization' },
        ],
      },
      {
        text: 'Search',
        items: [
          { text: 'The Basics', link: '/search/' },
          { text: 'Global Search', link: '/search/global-search' },
          { text: 'Scout Integration', link: '/search/scout-integration' },
        ],
      },
      {
        text: 'Filters',
        items: [
          { text: 'Defining Filters', link: '/filters/defining-filters' },
          { text: 'Registering Filters', link: '/filters/registering-filters' },
        ],
      },
      {
        text: 'Lenses',
        items: [
          { text: 'Defining Lenses', link: '/lenses/defining-lenses' },
          { text: 'Registering Lenses', link: '/lenses/registering-lenses' },
        ],
      },
      {
        text: 'Actions',
        items: [
          { text: 'Defining Actions', link: '/actions/defining-actions' },
          { text: 'Registering Actions', link: '/actions/registering-actions' },
        ],
      },
      {
        text: 'Metrics',
        items: [
          { text: 'Defining Metrics', link: '/metrics/defining-metrics' },
          { text: 'Registering Metrics', link: '/metrics/registering-metrics' },
        ],
      },
      {
        text: 'Digging Deeper',
        items: [
          { text: 'Dashboards', link: '/customization/dashboards' },
          { text: 'Menus', link: '/customization/menus' },
          { text: 'Notifications', link: '/customization/notifications' },
          { text: 'Impersonation', link: '/customization/impersonation' },
          { text: 'Tools', link: '/customization/tools' },
          { text: 'Resource Tools', link: '/customization/resource-tools' },
          { text: 'Cards', link: '/customization/cards' },
          { text: 'Fields', link: '/customization/fields' },
          { text: 'Filters', link: '/customization/filters' },
          { text: 'Front-end', link: '/customization/frontend' },
          { text: 'Assets', link: '/customization/assets' },
          { text: 'Localization', link: '/customization/localization' },
          { text: 'Stubs', link: '/customization/stubs' },
        ],
      },
    ],
    search: {
      provider: 'algolia',
      options: {
        indexName: 'laravel_nova',
        appId: 'FGRCZANQVY',
        apiKey: '7c0aaf326992f08ed7bfc461a1b61ef3',
        placeholder: 'Search Nova Docs...',
      }
    },
  },
  vite: {
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
  }
})