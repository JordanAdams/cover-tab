const BabiliPlugin = require('babili-webpack-plugin');
const baseConfig = require('./webpack.config');

module.exports = Object.assign({}, baseConfig, {
  devtool: 'source-map',
  plugins: baseConfig.plugins.concat([
    new BabiliPlugin()
  ])
});
