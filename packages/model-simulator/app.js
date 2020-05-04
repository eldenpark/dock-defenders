const fs = require('fs');
const { logger } = require('jege/server');
const { PredictionServiceClient } = require('@google-cloud/automl').v1;

const log = logger('[model-simulator]');

const client = new PredictionServiceClient();

const content = fs.readFileSync(filePath);

async function predict() {
  const request = {
    name: client.modelPath(projectId, location, modelId),
    payload: {
      image: {
        imageBytes: content,
      },
    },
  };

  const [response] = await client.predict(request);

  for (const annotationPayload of response.payload) {
    console.log(`Predicted class name: ${annotationPayload.displayName}`);
    console.log(
      `Predicted class score: ${annotationPayload.classification.score}`
    );
  }
}

predict();

function main() {
  log('')

  log(11);
}

if (require.main === module) {
  main();
}
