const fs = require('fs');
const { logger } = require('jege/server');
const path = require('path');
const { PredictionServiceClient } = require('@google-cloud/automl').v1;

const log = logger('[model-simulator]');

const client = new PredictionServiceClient();

const models = {
  audio: {
    location: 'us-central1',
    modelId: 'ICN6742517562824720384',
    projectId: '1079667904118',
  },
  video: {
    location: 'us-central1',
    modelId: 'IOD5458710194047418368',
    projectId: '1079667904118',
  },
};

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function simulate(model, inputPath) {
  const result = [];
  const files = fs.readdirSync(inputPath);

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (!file.startsWith('.')) {
      const filePath = path.resolve(inputPath, file);
      const content = fs.readFileSync(filePath);
      const request = {
        name: client.modelPath(model.projectId, model.location, model.modelId),
        payload: {
          image: {
            imageBytes: content,
          },
        },
      };

      log('simulate(): request, filePath: %s', filePath);
      const [response] = await client.predict(request);
      log('simulate(): response: %j', response);
      result.push({
        file,
        payload: response.payload,
      });

      await wait(1000);
    }
  }
  return result;
}

function writeResult(resultPath, content) {
  const resultFilePath = path.resolve(resultPath, `sd_${Date.now()}.json`);
  log('simulate(): finished getting data, writing at: %s', resultFilePath);
  fs.writeFileSync(resultFilePath, JSON.stringify(content));
}

async function main() {
  const {
    IMAGE_EXTRACT_PATH,
    SIMULATED_DATA_PATH,
    SPECTROGRAM_PATH,
  } = process.env;
  const audio = await simulate(models.audio, SPECTROGRAM_PATH);
  const video = await simulate(models.video, IMAGE_EXTRACT_PATH);
  writeResult(SIMULATED_DATA_PATH, {
    audio,
    video,
  });
}

if (require.main === module) {
  main();
}
