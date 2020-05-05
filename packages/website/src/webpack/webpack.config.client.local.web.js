const fs = require('fs');
const { logger } = require('jege/server');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const webpackConfigClientWeb = require('./webpack.config.client.web');

const log = logger('[website]');

let simulatedDataAudio;
let simulatedDataVideo;

try {
  simulatedDataAudio = require(process.env.SIMULATED_DATA_PATH);
} catch (err) {
  log('webpack.config.client.local.web.js: simulated-data path is not correctly given: %s', process.env.SIMULATED_DATA_PATH);
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
    publicPath: '/docs/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.SIMULATED_DATA': JSON.stringify(simulatedDataAudio),
    }),
  ],
};

module.exports = merge(webpackConfigClientWeb, config);
