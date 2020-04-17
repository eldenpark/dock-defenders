const fs = require('fs');
const { logger } = require('jege/server');
const path = require('path');

const paths = require('./paths');
const pJson = require('../package.json');

const log = logger('[website]');
const WEBSITE_PACKAGE_NAME = 'website';

const websitePackagePath = (function getWebsitePackagePath() {
  const _path = path.resolve(paths.root, 'packages', WEBSITE_PACKAGE_NAME);

  if (fs.existsSync(_path) === undefined) {
    throw new Error('website package is not present');
  }

  return _path;
})();

exports.get = function get() {
  const processEnv = {
    BUILD_PATH: paths.build,
    DIST_PATH: paths.dist,
    REPOSITORY_URL: pJson.repository.url,
    ROOT_PATH: paths.root,
    WEBSITE_BUILD_PATH: path.resolve(websitePackagePath, '.build'),
    WEBSITE_DATA_PATH: path.resolve(websitePackagePath, 'data'),
    WEBSITE_SRC_PATH: path.resolve(websitePackagePath, 'src'),
  };

  let envString = '';
  Object.keys(processEnv)
    .forEach((envKey) => {
      envString += `${envKey}: ${processEnv[envKey]}, `;
    });
  log('env.get(): %s', envString);

  return processEnv;
};
