<script>
export default {
  name: "CarbonAds",

  watch: {
    $route(to, from) {
      if (
        to.path !== from.path &&
        // Only reload if the ad has been loaded
        // otherwise it's possible that the script is appended but
        // the ads are not loaded yet. This would result in duplicated ads.
        this.$el.querySelector("#carbonads")
      ) {
        this.$el.innerHTML = "";
        this.load();
      }
    }
  },

  mounted() {
    // this.load();
  },

  methods: {
    load() {
      const s = document.createElement("script");
      s.id = "_carbonads_js";
      s.src = `//cdn.carbonads.com/carbon.js?serve=CE7I62JL&placement=novalaravelcom`;
      this.$el.appendChild(s);
    }
  },

  render(h) {
    return h("div", { class: "carbon-ads" });
  }
};
</script>

<style lang="stylus"></style>
