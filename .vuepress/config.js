module.exports = {
  title: 'Laravel Nova',
  description: 'Master Your Universe',

  themeConfig: {
    repo: 'laravel/nova-docs',
    displayAllHeaders: true,
    lastUpdated: 'Last Updated',
    editLinks: true,
    sidebarDepth: 0,

    nav: [
      { text: 'Home', link: '/'},
      { text: 'Version', link: '/',
        items: [
          { text: '1.0', link: '/docs/1.0/' },
        ]
      },
      { text: 'Other', link: '/',
        items: [
          { text: 'Purchase', link: 'https://nova.laravel.com' },
        ]
      },
    ],

    sidebar: [
      {
        title: 'Getting Started',
        collapsable: false,
        children: [
          'docs/1.0/getting-started/',
          'docs/1.0/getting-started/quickstart',
        ]
      },
      {
        title: 'Dashboard',
        collapsable: false,
        children: [
          'docs/1.0/dashboard/metrics',
          'docs/1.0/dashboard/tools',
        ]
      },
      {
        title: 'Resources',
        collapsable: false,
        children: [
          '/docs/1.0/resources/overview',
          '/docs/1.0/resources/fields',
          '/docs/1.0/resources/filters',
          '/docs/1.0/resources/lenses',
          '/docs/1.0/resources/metrics',
          '/docs/1.0/resources/single-resource-metrics',
        ]
      },
      {
        title: 'Customization',
        collapsable: false,
        children: [
          '/docs/1.0/customization/',
          '/docs/1.0/customization/cards',
          '/docs/1.0/customization/dashboard-cards',
          '/docs/1.0/customization/resource-cards',
          '/docs/1.0/customization/custom-fields',
          '/docs/1.0/customization/themes',
        ]
      },
      {
        title: 'Nova JS Reference',
        collapsable: false,
        children: [
          '/docs/1.0/nova-js/',
          '/docs/1.0/nova-js/methods',
          '/docs/1.0/nova-js/properties',
          '/docs/1.0/nova-js/event-bus',
        ]
      },
    ]
  }
}
