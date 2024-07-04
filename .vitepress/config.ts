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
            { text: 'v5.0', link: '/docs/5.0/', current: true },
            { text: 'v4.0', link: '/docs/4.0/' },
            { text: 'v3.0', link: 'https://github.com/laravel/nova-docs/tree/3.x'},
            { text: 'v2.0', link: 'https://github.com/laravel/nova-docs/tree/2.x'},
            { text: 'v1.0', link: 'https://github.com/laravel/nova-docs/tree/1.x'},
        ],
        sidebar: {
            '/5.0/': [
                {
                    text: "Getting Started",
                    items: [
                        { text: 'Installation', link: '/5.0/installation.html' },
                        { text: 'Release Notes', link: '/5.0/releases.html' },
                        { text: 'Upgrade Guide', link: '/5.0/upgrade.html' },
                        { text: 'Support & Bug Reports', link: '/5.0/support.html' },
                        { text: 'Code of Conduct', link: '/5.0/code-of-conduct.html' },
                    ]
                },
                {
                    text: "Resources",
                    items: [
                        { text: 'The Basics', link: '/5.0/resources/' },
                        { text: 'Fields', link: '/5.0/resources/fields.html' },
                        { text: 'Date Fields', link: '/5.0/resources/date-fields.html' },
                        { text: 'File Fields', link: '/5.0/resources/file-fields.html' },
                        { text: 'Repeater Fields', link: '/5.0/resources/repeater-fields.html' },
                        { text: 'Relationships', link: '/5.0/resources/relationships.html' },
                        { text: 'Validation', link: '/5.0/resources/validation.html' },
                        { text: 'Authorization', link: '/5.0/resources/authorization.html' },
                    ]
                },
                {
                    text: "Search",
                    items: [
                        { text: 'The Basics', link: '/5.0/search/' },
                        { text: 'Global Search', link: '/5.0/search/global-search.html' },
                        { text: 'Scout Integration', link: '/5.0/search/scout-integration.html' },
                    ]
                },
                {
                    text: "Filters",
                    items: [
                        { text: 'Defining Filters', link: '/5.0/filters/defining-filters.html' },
                        { text: 'Registering Filters', link: '/5.0/filters/registering-filters.html' },
                    ]
                },
                {
                    text: "Lenses",
                    items: [
                        { text: 'Defining Lenses', link: '/5.0/lenses/defining-lenses.html' },
                        { text: 'Registering Lenses', link: '/5.0/lenses/registering-lenses.html' },
                    ],
                },
                {
                    text: "Actions",
                    items: [
                        { text: 'Defining Actions', link: '/5.0/actions/defining-actions.html' },
                        { text: 'Registering Actions', link: '/5.0/actions/registering-actions.html' },
                    ],
                },
                {
                    text: "Metrics",
                    items: [
                        { text: 'Defining Metrics', link: '/5.0/metrics/defining-metrics.html' },
                        { text: 'Registering Metrics', link: '/5.0/metrics/registering-metrics.html' },
                    ],
                },
                {
                    text: "Digging Deeper",
                    items: [
                        { text: 'Dashboards', link: '/5.0/customization/dashboards.html' },
                        { text: 'Menus', link: '/5.0/customization/menus.html' },
                        { text: 'Notifications', link: '/5.0/customization/notifications.html' },
                        { text: 'Impersonation', link: '/5.0/customization/impersonation.html' },
                        { text: 'Tools', link: '/5.0/customization/tools.html' },
                        { text: 'Resource Tools', link: '/5.0/customization/resource-tools.html' },
                        { text: 'Cards', link: '/5.0/customization/cards.html' },
                        { text: 'Fields', link: '/5.0/customization/fields.html' },
                        { text: 'Filters', link: '/5.0/customization/filters.html' },
                        { text: 'CSS & JavaScript', link: '/5.0/customization/frontend.html' },
                        { text: 'Assets', link: '/5.0/customization/assets.html' },
                        { text: 'Localization', link: '/5.0/customization/localization.html' },
                        { text: 'Stubs', link: '/5.0/customization/stubs.html' },
                    ],
                }
            ],
            '/4.0/': [
                {
                    text: "Getting Started",
                    items: [
                        { text: 'Installation', link: '/4.0/installation.html' },
                        { text: 'Release Notes', link: '/4.0/releases.html' },
                        { text: 'Upgrade Guide', link: '/4.0/upgrade.html' },
                        { text: 'Support & Bug Reports', link: '/4.0/support.html' },
                        { text: 'Code of Conduct', link: '/4.0/code-of-conduct.html' },
                    ]
                },
                {
                    text: "Resources",
                    items: [
                        { text: 'The Basics', link: '/4.0/resources/' },
                        { text: 'Fields', link: '/4.0/resources/fields.html' },
                        { text: 'Date Fields', link: '/4.0/resources/date-fields.html' },
                        { text: 'File Fields', link: '/4.0/resources/file-fields.html' },
                        { text: 'Repeater Fields', link: '/4.0/resources/repeater-fields.html' },
                        { text: 'Relationships', link: '/4.0/resources/relationships.html' },
                        { text: 'Validation', link: '/4.0/resources/validation.html' },
                        { text: 'Authorization', link: '/4.0/resources/authorization.html' },
                    ]
                },
                {
                    text: "Search",
                    items: [
                        { text: 'The Basics', link: '/4.0/search/' },
                        { text: 'Global Search', link: '/4.0/search/global-search.html' },
                        { text: 'Scout Integration', link: '/4.0/search/scout-integration.html' },
                    ]
                },
                {
                    text: "Filters",
                    items: [
                        { text: 'Defining Filters', link: '/4.0/filters/defining-filters.html' },
                        { text: 'Registering Filters', link: '/4.0/filters/registering-filters.html' },
                    ]
                },
                {
                    text: "Lenses",
                    items: [
                        { text: 'Defining Lenses', link: '/4.0/lenses/defining-lenses.html' },
                        { text: 'Registering Lenses', link: '/4.0/lenses/registering-lenses.html' },
                    ],
                },
                {
                    text: "Actions",
                    items: [
                        { text: 'Defining Actions', link: '/4.0/actions/defining-actions.html' },
                        { text: 'Registering Actions', link: '/4.0/actions/registering-actions.html' },
                    ],
                },
                {
                    text: "Metrics",
                    items: [
                        { text: 'Defining Metrics', link: '/4.0/metrics/defining-metrics.html' },
                        { text: 'Registering Metrics', link: '/4.0/metrics/registering-metrics.html' },
                    ],
                },
                {
                    text: "Digging Deeper",
                    items: [
                        { text: 'Dashboards', link: '/4.0/customization/dashboards.html' },
                        { text: 'Menus', link: '/4.0/customization/menus.html' },
                        { text: 'Notifications', link: '/4.0/customization/notifications.html' },
                        { text: 'Impersonation', link: '/4.0/customization/impersonation.html' },
                        { text: 'Tools', link: '/4.0/customization/tools.html' },
                        { text: 'Resource Tools', link: '/4.0/customization/resource-tools.html' },
                        { text: 'Cards', link: '/4.0/customization/cards.html' },
                        { text: 'Fields', link: '/4.0/customization/fields.html' },
                        { text: 'Filters', link: '/4.0/customization/filters.html' },
                        { text: 'CSS & JavaScript', link: '/4.0/customization/frontend.html' },
                        { text: 'Assets', link: '/4.0/customization/assets.html' },
                        { text: 'Localization', link: '/4.0/customization/localization.html' },
                        { text: 'Stubs', link: '/4.0/customization/stubs.html' },
                    ],
                }
            ],
        },
        search: {
            provider: 'local',
            options: {
                placeholder: 'Search Nova Docs...',
                _render(src, env, md) {
                    const html = md.render(src, env)
                    if (env.frontmatter?.search === false) return ''
                    if (env.relativePath.startsWith('4.0')) return ''
                    return html
                }
            }
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
