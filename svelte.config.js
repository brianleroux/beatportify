const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  preprocess: sveltePreprocess({
    scss: { renderSync: true },
    postcss: true
  }),
};
