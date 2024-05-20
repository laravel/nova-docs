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
        // theme: 'css-variables',
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
        versions: [
            { text: 'v5.0', link: '/docs/v5/', current: true },
            { text: 'v4.0', link: '/docs/v4/' },
            { text: 'v3.0', link: 'https://github.com/laravel/nova-docs/tree/3.x'},
            { text: 'v2.0', link: 'https://github.com/laravel/nova-docs/tree/2.x'},
            { text: 'v1.0', link: 'https://github.com/laravel/nova-docs/tree/1.x'},
        ],
        sidebar: {
            '/v5/': [
                {
                    text: "Getting Started",
                    items: [
                        { text: 'Installation', link: '/v5/installation.html' },
                        { text: 'Release Notes', link: '/v5/releases.html' },
                        { text: 'Upgrade Guide', link: '/v5/upgrade.html' },
                        { text: 'Support & Bug Reports', link: '/v5/support.html' },
                        { text: 'Code of Conduct', link: '/v5/code-of-conduct.html' },
                    ]
                },
                {
                    text: "Resources",
                    items: [
                        { text: 'The Basics', link: '/v5/resources/' },
                        { text: 'Fields', link: '/v5/resources/fields.html' },
                        { text: 'Date Fields', link: '/v5/resources/date-fields.html' },
                        { text: 'Repeater Fields', link: '/v5/resources/repeater-fields.html' },
                        { text: 'Relationships', link: '/v5/resources/relationships.html' },
                        { text: 'Validation', link: '/v5/resources/validation.html' },
                        { text: 'Authorization', link: '/v5/resources/authorization.html' },
                    ]
                },
                {
                    text: "Search",
                    items: [
                        { text: 'The Basics', link: '/v5/search/' },
                        { text: 'Global Search', link: '/v5/search/global-search.html' },
                        { text: 'Scout Integration', link: '/v5/search/scout-integration.html' },
                    ]
                },
                {
                    text: "Filters",
                    items: [
                        { text: 'Defining Filters', link: '/v5/filters/defining-filters.html' },
                        { text: 'Registering Filters', link: '/v5/filters/registering-filters.html' },
                    ]
                },
                {
                    text: "Lenses",
                    items: [
                        { text: 'Defining Lenses', link: '/v5/lenses/defining-lenses.html' },
                        { text: 'Registering Lenses', link: '/v5/lenses/registering-lenses.html' },
                    ],
                },
                {
                    text: "Actions",
                    items: [
                        { text: 'Defining Actions', link: '/v5/actions/defining-actions.html' },
                        { text: 'Registering Actions', link: '/v5/actions/registering-actions.html' },
                    ],
                },
                {
                    text: "Metrics",
                    items: [
                        { text: 'Defining Metrics', link: '/v5/metrics/defining-metrics.html' },
                        { text: 'Registering Metrics', link: '/v5/metrics/registering-metrics.html' },
                    ],
                },
                {
                    text: "Digging Deeper",
                    items: [
                        { text: 'Dashboards', link: '/v5/customization/dashboards.html' },
                        { text: 'Menus', link: '/v5/customization/menus.html' },
                        { text: 'Notifications', link: '/v5/customization/notifications.html' },
                        { text: 'Impersonation', link: '/v5/customization/impersonation.html' },
                        { text: 'Tools', link: '/v5/customization/tools.html' },
                        { text: 'Resource Tools', link: '/v5/customization/resource-tools.html' },
                        { text: 'Cards', link: '/v5/customization/cards.html' },
                        { text: 'Fields', link: '/v5/customization/fields.html' },
                        { text: 'Filters', link: '/v5/customization/filters.html' },
                        { text: 'CSS & JavaScript', link: '/v5/customization/frontend.html' },
                        { text: 'Assets', link: '/v5/customization/assets.html' },
                        { text: 'Localization', link: '/v5/customization/localization.html' },
                        { text: 'Stubs', link: '/v5/customization/stubs.html' },
                    ],
                }
            ],
            '/v4/': [
                {
                    text: "Getting Started",
                    items: [
                        { text: 'Installation', link: '/v4/installation.html' },
                        { text: 'Release Notes', link: '/v4/releases.html' },
                        { text: 'Upgrade Guide', link: '/v4/upgrade.html' },
                        { text: 'Support & Bug Reports', link: '/v4/support.html' },
                        { text: 'Code of Conduct', link: '/v4/code-of-conduct.html' },
                    ]
                },
                {
                    text: "Resources",
                    items: [
                        { text: 'The Basics', link: '/v4/resources/' },
                        { text: 'Fields', link: '/v4/resources/fields.html' },
                        { text: 'Date Fields', link: '/v4/resources/date-fields.html' },
                        { text: 'Repeater Fields', link: '/v4/resources/repeater-fields.html' },
                        { text: 'Relationships', link: '/v4/resources/relationships.html' },
                        { text: 'Validation', link: '/v4/resources/validation.html' },
                        { text: 'Authorization', link: '/v4/resources/authorization.html' },
                    ]
                },
                {
                    text: "Search",
                    items: [
                        { text: 'The Basics', link: '/v4/search/' },
                        { text: 'Global Search', link: '/v4/search/global-search.html' },
                        { text: 'Scout Integration', link: '/v4/search/scout-integration.html' },
                    ]
                },
                {
                    text: "Filters",
                    items: [
                        { text: 'Defining Filters', link: '/v4/filters/defining-filters.html' },
                        { text: 'Registering Filters', link: '/v4/filters/registering-filters.html' },
                    ]
                },
                {
                    text: "Lenses",
                    items: [
                        { text: 'Defining Lenses', link: '/v4/lenses/defining-lenses.html' },
                        { text: 'Registering Lenses', link: '/v4/lenses/registering-lenses.html' },
                    ],
                },
                {
                    text: "Actions",
                    items: [
                        { text: 'Defining Actions', link: '/v4/actions/defining-actions.html' },
                        { text: 'Registering Actions', link: '/v4/actions/registering-actions.html' },
                    ],
                },
                {
                    text: "Metrics",
                    items: [
                        { text: 'Defining Metrics', link: '/v4/metrics/defining-metrics.html' },
                        { text: 'Registering Metrics', link: '/v4/metrics/registering-metrics.html' },
                    ],
                },
                {
                    text: "Digging Deeper",
                    items: [
                        { text: 'Dashboards', link: '/v4/customization/dashboards.html' },
                        { text: 'Menus', link: '/v4/customization/menus.html' },
                        { text: 'Notifications', link: '/v4/customization/notifications.html' },
                        { text: 'Impersonation', link: '/v4/customization/impersonation.html' },
                        { text: 'Tools', link: '/v4/customization/tools.html' },
                        { text: 'Resource Tools', link: '/v4/customization/resource-tools.html' },
                        { text: 'Cards', link: '/v4/customization/cards.html' },
                        { text: 'Fields', link: '/v4/customization/fields.html' },
                        { text: 'Filters', link: '/v4/customization/filters.html' },
                        { text: 'CSS & JavaScript', link: '/v4/customization/frontend.html' },
                        { text: 'Assets', link: '/v4/customization/assets.html' },
                        { text: 'Localization', link: '/v4/customization/localization.html' },
                        { text: 'Stubs', link: '/v4/customization/stubs.html' },
                    ],
                }
            ],
        },
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
