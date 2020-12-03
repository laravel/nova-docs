module.exports = [
  {
    title: "Getting Started",
    collapsable: false,
    children: ["installation", "contributions", "support", "code-of-conduct"]
  },
  {
    title: "Resources",
    collapsable: false,
    children: prefix("resources", [
      "",
      "fields",
      "date-fields",
      "file-fields",
      "relationships",
      "validation",
      "authorization"
    ])
  },
  {
    title: "Search",
    collapsable: false,
    children: prefix("search", ["global-search", "scout-integration"])
  },
  {
    title: "Filters",
    collapsable: false,
    children: prefix("filters", ["defining-filters", "registering-filters"])
  },
  {
    title: "Lenses",
    collapsable: false,
    children: prefix("lenses", ["defining-lenses", "registering-lenses"])
  },
  {
    title: "Actions",
    collapsable: false,
    children: prefix("actions", ["defining-actions", "registering-actions"])
  },
  {
    title: "Metrics",
    collapsable: false,
    children: prefix("metrics", ["defining-metrics", "registering-metrics"])
  },
  {
    title: "Customization",
    collapsable: false,
    children: prefix("customization", [
      "dashboards",
      "tools",
      "resource-tools",
      "cards",
      "fields",
      "filters",
      "frontend",
      "themes",
      "assets",
      "localization",
      "stubs"
    ])
  }
  // {
  //   title: 'Nova JS Reference',
  //   collapsable: false,
  //   children: prefix('nova-js', ['', 'methods', 'properties', 'event-bus']),
  // },
];

function prefix(prefix, children) {
  return children.map(child => `${prefix}/${child}`);
}
