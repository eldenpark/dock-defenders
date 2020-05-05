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
    modelId: 'IOD3283753049004179456',
    projectId: '1079667904118',
  },
};

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function simulate(model, inputPath, resultPath) {
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

      await wait(300);
    }
  }

  const resultFilePath = path.resolve(resultPath, `${model.modelId}-${Date.now()}.json`);
  fs.writeFileSync(resultFilePath, JSON.stringify(result));
}

async function main() {
  const {
    SIMULATED_DATA_PATH,
    SPECTROGRAM_PATH,
  } = process.env;
  await simulate(models.audio, SPECTROGRAM_PATH, SIMULATED_DATA_PATH);
  // simulate('video');
}

if (require.main === module) {
  main();
}
