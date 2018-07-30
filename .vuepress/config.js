module.exports = {
  title: 'Laravel Nova',
  description: 'Master Your Universe',
  base: '/docs/',

  themeConfig: {
    repo: 'laravel/nova',
    displayAllHeaders: true,

    nav: [
      {text: 'Home', link: 'https://nova.laravel.com'},
      {
        text: 'Version',
        link: '/',
        items: [{text: '1.0', link: '/1.0/'}],
      },
    ],

    sidebar: {
      '/1.0/': require('./1.0'),
    },
  },
};
