var versions = ["1.0", "2.0", "3.0", "4.0"];
var currentVersion = versions[versions.length - 1]

module.exports = (options = {}, context) => ({
  extendPageData($page) {
    const { regularPath, path, frontmatter } = $page;

    frontmatter.meta = [];

    versions.forEach(function(version) {
      if (regularPath.includes("/" + version + "/")) {
        frontmatter.meta.push({
          name: "docsearch:version",
          content: version + ".0"
        });

        frontmatter.canonicalUrl = context.base + regularPath.replace("/" + version + "/", "/" + currentVersion + "/").substring(1);
      }
    });
  }
});
