const { logger } = require('jege/server');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const getMarkdown = require('./getMarkdown');
const webpackConfigClientWeb = require('./webpack.config.client.web');

const log = logger('[website]');

let aboutHtml;
let simulatedData;
let publicPath;

try {
  getMarkdown();
  simulatedData = require(process.env.SIMULATED_DATA_PATH);
  publicPath = process.env.PUBLIC_PATH;
  aboutHtml = process.env.ABOUT_HTML;
} catch (err) {
  log('webpack.config.client.local.web.js: simulated-data path is not correctly given: %s', process.env.SIMULATED_DATA_PATH);
  throw new Error('process.env.SIMULATED_DATA_PATH is not defined');
}

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
    publicPath: `/${publicPath}/`,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.ABOUT_HTML': JSON.stringify(aboutHtml),
      'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
      'process.env.SIMULATED_DATA': JSON.stringify(simulatedData),
    }),
  ],
};

module.exports = merge(webpackConfigClientWeb, config);
