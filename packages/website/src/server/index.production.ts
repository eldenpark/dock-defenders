import express from 'express';
import ExpressIsomorphic, {
  Extend,
} from 'express-isomorphic';
import fs from 'fs';
import http from 'http';
import { logger } from 'jege/server';
import path from 'path';
import { withWebpack } from 'express-isomorphic-extension/webpack';

import IsomorphicState from './IsomorphicState';
import webpackConfig from '../webpack/webpack.config.client.prod.web';

const log = logger('[website]');

const extend: Extend<IsomorphicState> = async (app, serverState) => {
  const { DIST_PATH } = process.env;
  const webpackBuild = require(path.resolve(DIST_PATH!, 'build.json'));

  withWebpack({
    serverState,
    webpackBuild,
  })(app);

  const { path: outputPath, publicPath } = webpackConfig.output;

  app.use(publicPath, express.static(outputPath));

  return Promise.all([])
    .then(() => {
      serverState.update(() => ({
        builtAt: webpackBuild.builtAt,
        publicPath,
      }));
    });
};

export default async function main() {
  log(
    'local(): Starting, NODE_ENV: %s, BUILD_PATH: %s, DIST_PATH: %s',
    process.env.NODE_ENV,
    process.env.BUILD_PATH,
    process.env.DIST_PATH,
  );

  const processEnv = process.env;
  if (!processEnv.WEBSITE_BUILD_PATH || !processEnv.WEBSITE_DATA_PATH || !processEnv.DIST_PATH) {
    throw new Error('Some env variables among {buildPath, dataPath, distPath} are wrong');
  }

  const { app, eject, serverState } = await ExpressIsomorphic.create({ // eslint-disable-line
    extend,
    makeHtmlPath: path.resolve(processEnv.WEBSITE_BUILD_PATH, 'makeHtml.bundle.js'),
  });

  const port = 6001;

  const httpServer = http.createServer(app);

  httpServer.listen(port, () => {
    log('productionServer listening on: %s', port);
  });

  // const { createdFiles } = serverState.state;
  // await ejectFiles(eject, port, createdFiles);
}

// async function ejectFiles(eject, port, createdFiles) {
//   createdFiles.map(async (file) => {
//     const directoryPath = path.resolve(process.env.DIST_PATH!, file.category);
//     if (!fs.existsSync(directoryPath)) {
//       log('ejectFiles(): creating directory: %s', directoryPath);
//       fs.mkdirSync(directoryPath);
//     }
//   });

//   const processEnv = process.env;

//   await eject({
//     filePath: path.resolve(processEnv.ROOT_PATH!, 'index.html'),
//     requestUrl: `http://localhost:${port}/`,
//   });
// }
