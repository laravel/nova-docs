import { defineConfigWithTheme } from "vitepress";
import type { ThemeConfig } from '@hempworks/pilgrim'
import config from '@hempworks/pilgrim/config'

export default defineConfigWithTheme<ThemeConfig>({
    extends: config,
    title: 'Laravel Nova',
    description: 'Master Your Universe',
    base: '/docs/',
    cleanUrls: false,
    srcDir: 'src',

    head: [
        ['link', {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: 'https://nova.laravel.com/apple-touch-icon.png',
        }],
        ['link', {
            rel: 'icon',
            sizes: '16x16',
            type: 'image/png',
            href: 'https://nova.laravel.com/favicon-16x16.png',
        }],
        ['link', {
            rel: 'icon',
            sizes: '32x32',
            type: 'image/png',
            href: 'https://nova.laravel.com/favicon-32x32.png',
        }],
        ['link', {
            rel: 'manifest',
            href: 'https://nova.laravel.com/site.webmanifest',
        }],
        ['link', {
            rel: 'mask-icon',
            href: 'https://nova.laravel.com/safari-pinned-tab.svg',
            color: '#5bbad5'
        }],
        ['meta', {
            name: 'msapplication-TileColor',
            content: '#5bbad5',
        }],
    ],

    themeConfig: {
        githubUrl: 'https://github.com/laravel/nova-issues/discussions',
        logo: {
            light: '/logo.svg',
            dark: '/logo-dark.svg',
        },
        nav: [
            { text: 'Home', link: 'https://nova.laravel.com/' },
            { text: 'Purchase a License', link: 'https://nova.laravel.com/licenses' },
            { text: 'Video Tutorials', link: 'https://laracasts.com/series/laravel-nova-mastery-2023-edition' },
        ],
        versions:[
            { text: 'v4.0', link: '/docs/4.0/', current: true },
            { text: 'v3.0', link: '/docs/3.0/'},
            { text: 'v2.0', link: '/docs/2.0/'},
            { text: 'v1.0', link: '/docs/1.0/'},
        ],
        sidebar: [
            {
                text: "Getting Started",
                items: [
                    { text: 'Installation', link: '/installation' },
                    { text: 'Releases', link: '/releases' },
                    { text: 'Upgrade', link: '/upgrade' },
                    { text: 'Support', link: '/support' },
                    { text: 'Code of Conduct', link: '/code-of-conduct' },
                ]
            },
            {
                text: "Resources",
                items: [
                    { text: 'The Basics', link: '/resources/' },
                    { text: 'Fields', link: '/resources/fields' },
                    { text: 'Date Fields', link: '/resources/date-fields' },
                    { text: 'Repeater Fields', link: '/resources/repeater-fields' },
                    { text: 'Relationships', link: '/resources/relationships' },
                    { text: 'Validation', link: '/resources/validation' },
                    { text: 'Authorization', link: '/resources/authorization' },
                ]
            },
            {
                text: "Search",
                items: [
                    { text: 'Getting Started', link: '/search/' },
                    { text: 'Global Search', link: '/search/global-search' },
                    { text: 'Scout Integration', link: '/search/scout-integration' },
                ]
            },
            {
                text: "Filters",
                items: [
                    { text: 'Defining Filters', link: '/filters/defining-filters' },
                    { text: 'Registering Filters', link: '/filters/registering-filters' },
                ]
            },
            {
                text: "Lenses",
                items: [
                    { text: 'Defining Lenses', link: '/lenses/defining-lenses' },
                    { text: 'Registering Lenses', link: '/lenses/registering-lenses' },
                ],
            },
            {
                text: "Actions",
                items: [
                    { text: 'Defining Actions', link: '/actions/defining-actions' },
                    { text: 'Registering Actions', link: '/actions/registering-actions' },
                ],
            },
            {
                text: "Metrics",
                items: [
                    { text: 'Defining Metrics', link: '/metrics/defining-metrics' },
                    { text: 'Registering Metrics', link: '/metrics/registering-metrics' },
                ],
            },
            {
                text: "Digging Deeper",
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
                    { text: 'Frontend', link: '/customization/frontend' },
                    { text: 'Assets', link: '/customization/assets' },
                    { text: 'Localization', link: '/customization/localization' },
                    { text: 'Stubs', link: '/customization/stubs' },
                ],
            }
        ],
        search: {
            provider: 'local',
            options: {
                placeholder: 'Search Nova Docs...',
            },
        }
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
