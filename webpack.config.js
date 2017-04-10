const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.json$/, use: 'json-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src', 'index.html'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'manifest.json'),
        to: path.resolve(__dirname, 'dist')
      }
    ])
  ]
}
