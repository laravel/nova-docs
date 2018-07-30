module.exports = [
  {
    title: 'Getting Started',
    collapsable: false,
    children: [''].concat(prefix('getting-started', [
    ])),
  },
  {
    title: 'Resources',
    collapsable: false,
    children: prefix('resources', [
      '',
      'fields',
      'filters',
      'lenses',
      'metrics',
      'single-resource-metrics',
    ]),
  },
  {
    title: 'Dashboard',
    collapsable: false,
    children: prefix('dashboard', ['metrics', 'tools']),
  },
  {
    title: 'Customization',
    collapsable: false,
    children: prefix('customization', [
      '',
      'cards',
      'dashboard-cards',
      'resource-cards',
      'custom-fields',
      'themes',
    ]),
  },
  {
    title: 'Nova JS Reference',
    collapsable: false,
    children: prefix('nova-js', ['', 'methods', 'properties', 'event-bus']),
  },
];

function prefix(prefix, children) {
  return children.map(child => `${prefix}/${child}`);
}
