module.exports = {
  title: "Laravel Nova",
  description: "Master Your Universe",
  base: "/docs/",

  plugins: [
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: true
      },
    ],
    require("./plugins/metaVersion.js")
  ],

  head: [
    [
      "link",
      {
        href:
          "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,800,800i,900,900i",
        rel: "stylesheet",
        type: "text/css"
      }
    ],
    // Used for PWA
    [
      "link",
      {
        rel: "manifest",
        href: "/manifest.json"
      }
    ],
    [
      "link",
      {
        rel: "icon",
        href: "/icon.png"
      }
    ]
  ],

  themeConfig: {
    logo: "/assets/img/logo.svg",
    displayAllHeaders: false,
    activeHeaderLinks: false,
    searchPlaceholder: "Search...",
    lastUpdated: "Last Updated", // string | boolean
    sidebarDepth: 0,

    nav: [
      { text: "Home", link: "https://nova.laravel.com" },
      {
        text: "Version",
        link: "/",
        items: [
          { text: "1.0", link: "/1.0/" },
          { text: "2.0", link: "/2.0/" },
          { text: "3.0", link: "/3.0/" },
          { text: "4.0", link: "/4.0/" }
        ]
      }
    ],

    sidebar: {
      "/1.0/": require("./1.0"),
      "/2.0/": require("./2.0"),
      "/3.0/": require("./3.0"),
      "/4.0/": require("./4.0")
    },

    algolia: {
      indexName: "laravel_nova",
      appId: "FGRCZANQVY",
      apiKey: "7c0aaf326992f08ed7bfc461a1b61ef3",
      algoliaOptions: {
        facetFilters: ["version:4.0.0"]
      }
    }
  }
};
