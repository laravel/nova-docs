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
                    { text: 'Release Notes', link: '/releases.html' },
                    { text: 'Upgrade Guide', link: '/upgrade.html' },
                    { text: 'Support & Bug Reports', link: '/support.html' },
                    { text: 'Code of Conduct', link: '/code-of-conduct.html' },
                ]
            },
            {
                text: "Resources",
                items: [
                    { text: 'The Basics', link: '/resources/' },
                    { text: 'Fields', link: '/resources/fields.html' },
                    { text: 'Date Fields', link: '/resources/date-fields.html' },
                    { text: 'Repeater Fields', link: '/resources/repeater-fields.html' },
                    { text: 'Relationships', link: '/resources/relationships.html' },
                    { text: 'Validation', link: '/resources/validation.html' },
                    { text: 'Authorization', link: '/resources/authorization.html' },
                ]
            },
            {
                text: "Search",
                items: [
                    { text: 'The Basics', link: '/search/' },
                    { text: 'Global Search', link: '/search/global-search.html' },
                    { text: 'Scout Integration', link: '/search/scout-integration.html' },
                ]
            },
            {
                text: "Filters",
                items: [
                    { text: 'Defining Filters', link: '/filters/defining-filters.html' },
                    { text: 'Registering Filters', link: '/filters/registering-filters.html' },
                ]
            },
            {
                text: "Lenses",
                items: [
                    { text: 'Defining Lenses', link: '/lenses/defining-lenses.html' },
                    { text: 'Registering Lenses', link: '/lenses/registering-lenses.html' },
                ],
            },
            {
                text: "Actions",
                items: [
                    { text: 'Defining Actions', link: '/actions/defining-actions.html' },
                    { text: 'Registering Actions', link: '/actions/registering-actions.html' },
                ],
            },
            {
                text: "Metrics",
                items: [
                    { text: 'Defining Metrics', link: '/metrics/defining-metrics.html' },
                    { text: 'Registering Metrics', link: '/metrics/registering-metrics.html' },
                ],
            },
            {
                text: "Digging Deeper",
                items: [
                    { text: 'Dashboards', link: '/customization/dashboards.html' },
                    { text: 'Menus', link: '/customization/menus.html' },
                    { text: 'Notifications', link: '/customization/notifications.html' },
                    { text: 'Impersonation', link: '/customization/impersonation.html' },
                    { text: 'Tools', link: '/customization/tools.html' },
                    { text: 'Resource Tools', link: '/customization/resource-tools.html' },
                    { text: 'Cards', link: '/customization/cards.html' },
                    { text: 'Fields', link: '/customization/fields.html' },
                    { text: 'Filters', link: '/customization/filters.html' },
                    { text: 'CSS & JavaScript', link: '/customization/frontend.html' },
                    { text: 'Assets', link: '/customization/assets.html' },
                    { text: 'Localization', link: '/customization/localization.html' },
                    { text: 'Stubs', link: '/customization/stubs.html' },
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
