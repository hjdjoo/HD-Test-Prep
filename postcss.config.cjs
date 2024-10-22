const postcssImport = require("postcss-import");
const postcssNested = require("postcss-nested");
const postcssPresetEnv = require("postcss-preset-env");
const autoprefixer = require("autoprefixer")
// const path = require("path")

module.exports = {
  plugins: [
    postcssImport(),
    postcssNested(),
    postcssPresetEnv({ stage: 1 }),
    autoprefixer(),
  ]
}