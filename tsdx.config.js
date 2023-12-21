const postcss = require('rollup-plugin-postcss')

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        modules: true, // Enable CSS modules if needed, set to false otherwise
        extensions: ['.css'], // File extensions to process
      })
    )

    return config
  },
}
