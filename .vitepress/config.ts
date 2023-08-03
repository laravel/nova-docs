import { defineConfigWithTheme } from "vitepress";
import type { ThemeConfig } from '@hempworks/pilgrim'
import config from '@hempworks/pilgrim/config'

export default defineConfigWithTheme<ThemeConfig>({
    // extends: config,
    title: 'Laravel Nova',
    description: 'Master Your Universe',
    base: '/docs/',
    cleanUrls: false,
    srcDir: 'src',

    markdown: {
        lineNumbers: false,
        theme: 'css-variables',
    },

    head: [
        ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
        [
            'link',
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        ],
        [
            'link',
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200;0,6..12,300;0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;0,6..12,800;0,6..12,900;0,6..12,1000;1,6..12,200;1,6..12,300;1,6..12,400;1,6..12,500;1,6..12,600;1,6..12,700;1,6..12,800;1,6..12,900;1,6..12,1000&display=swap',
            },
        ],

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
            { text: 'Home', link: 'https://bit.ly/3KppFiG' },
            { text: 'Purchase a License', link: 'https://bit.ly/3QlZywL' },
            { text: 'Video Tutorials', link: 'https://laracasts.com/series/laravel-nova-mastery-2023-edition' },
        ],
        versions:[
            { text: 'v4.0', link: '/docs/4.0/', current: true },
            { text: 'v3.0', link: 'https://github.com/laravel/nova-docs/tree/3.x'},
            { text: 'v2.0', link: 'https://github.com/laravel/nova-docs/tree/2.x'},
            { text: 'v1.0', link: 'https://github.com/laravel/nova-docs/tree/1.x'},
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
