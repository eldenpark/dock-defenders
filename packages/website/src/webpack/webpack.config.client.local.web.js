const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const webpackConfigClientWeb = require('./webpack.config.client.web');

const config = {
  devtool: 'source-map',
  entry: {
    client: path.resolve(process.env.WEBSITE_SRC_PATH, 'client/client.tsx'),
    hotLoader: [
      'webpack-hot-middleware/client',
    ],
    react: ['react', 'react-dom'],
  },
  mode: 'development',
  optimization: {
    minimize: false,
  },
  output: {
    filename: '[name].[hash].js',
    publicPath: '/docs/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};

module.exports = merge(webpackConfigClientWeb, config);
