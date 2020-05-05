const env = require('./env');

const processEnv = env.get();

const { argv } = require('yargs');
const { createLauncher, proc } = require('process-launch');
const { logger } = require('jege/server');
const path = require('path');

const log = logger('[dock-defenders]');

const outputPath = path.resolve(__dirname, '../output');

const processDefinitions = {
  'image-extractor': proc(
    'sh',
    [
      './launch.sh',
      ...argv._,
    ],
    {
      cwd: './packages/image-extractor',
      stdio: 'inherit',
    },
  ),
  'model-simulator': proc(
    'node',
    [
      'app.js',
      ...argv._,
    ],
    {
      cwd: `./packages/model-simulator`,
      env: {
        IMAGE_EXTRACT_PATH: path.resolve(outputPath, 'image-extract'),
        NODE_ENV: 'development',
        SIMULATED_DATA_PATH: path.resolve(outputPath, 'simulated-data'),
        SPECTROGRAM_PATH: path.resolve(outputPath, 'spectrogram'),
        ...processEnv,
      },
      stdio: 'inherit',
    },
  ),
  'sound-synthesizer': proc(
    'sh',
    [
      './launch.sh',
      ...argv._,
    ],
    {
      cwd: `./packages/sound-synthesizer`,
      stdio: 'inherit',
    },
  ),
  'spectrogram-creator': proc(
    'python3',
    [
      './app.py',
      outputPath,
    ],
    {
      cwd: './packages/spectrogram-creator',
      stdio: 'inherit',
    },
  ),
  'website-dev': proc(
    'node',
    [
      './scripts/launch.js',
      ...argv._,
    ],
    {
      cwd: `./packages/website`,
      env: {
        NODE_ENV: 'development',
        ...processEnv,
      },
      stdio: 'inherit',
    },
  ),
  'website-eject': proc(
    'node',
    [
      './scripts/launch.js',
      ...argv._,
    ],
    {
      cwd: `./packages/website`,
      env: {
        NODE_ENV: 'production',
        ...processEnv,
      },
      stdio: 'inherit',
    },
  ),
};

const processGroupDefinitions = {
  default: ['website-dev'],
};

function launcher() {
  try {
    log('launcher(): argv: %j', argv);

    const Launcher = createLauncher({
      processDefinitions,
      processGroupDefinitions,
    });

    Launcher.run({
      process: argv.process,
      processGroup: argv.processGroup,
    });
  } catch (err) {
    log('launcher(): Error reading file', err);
  }
}

module.exports = launcher;

if (require.main === module) {
  launcher();
}
