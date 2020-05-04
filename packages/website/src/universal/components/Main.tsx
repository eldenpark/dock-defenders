/* eslint-disable */

import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

// import About from '@@src/universal/components/About';
import Control from '@@src/universal/components/Control';
import {
  FileMap,
  FormType,
} from '@@src/universal/components/types';
import { log } from '@@src/universal/modules/Logger';
import pregeneratedData from '@@src/universal/pregeneratedData';
import Row from '@@src/universal/components/Row';

const StyledMain = styled.div({
  width: 650,
});

const Main = () => {
  React.useEffect(() => {
    console.log('Main(): useEffect(): main is rendered');
    const form = document.getElementById('form') as FormType;
    form.sources = [];
    form.labels = [];
  }, []);

  const startStopState = React.useRef<any>('Start');
  const [, updateState] = React.useState();
  const setStartStopState = React.useCallback((nextState) => {
    startStopState.current = nextState;
    updateState({});
  }, []);
  const [classificationIsReady, setClassificationIsReady] = React.useState(false);

  const handleClickSubmit = React.useCallback(createHandleClickSubmit(
    setClassificationIsReady,
    setStartStopState,
    startStopState,
  ), [startStopState]);

  return (
    <StyledMain>
      <form id="form">
        <Row
          itemId="0"
          pregeneratedData={pregeneratedData[0]}
        />
        <Control
          classificationIsReady={classificationIsReady}
          handleClickSubmit={handleClickSubmit}
          startStopState={startStopState}
        />
      </form>
      {/* <About /> */}
    </StyledMain>
  );
};

export default Main;

function createHandleClickSubmit(
  setClassificationIsReady,
  setStartStopState,
  startStopState: { current: string },
) {
  const file = undefined;

  return () => {
    console.log('createHandleclickSubmit(): startStop: %s', startStopState.current);

    if (startStopState.current === 'Start') {
      setStartStopState('Stop');
      const canvas: any = document.getElementById(`canvas`);
      const fileUrl = '/docs/assets/quadcopter_002_audio_merged.mp3';
      log('createHandleClickSubmit(): fileUrl: %s', fileUrl);

      if (fileUrl !== null) {
        axios.get(fileUrl, {
          responseType: 'blob',
        })
          .then((response) => {
            const { data } = response;
            // const _pregeneratedData = pregeneratedData[i];
            setClassificationIsReady(true);

            // console.log('createHandleclickSubmit(): NODE_ENV: production, i: %s, including data: %o, pregeneratedData: %o', data, _pregeneratedData);

            const label: any = document.getElementById(`classification`);
            if (label !== null) {
              // const { classification, displayName } = _pregeneratedData.classify;
              // const normalizedScore = (+classification.score * 100) / 100;
              // const newLabel = `<b>${displayName}</b> (${normalizedScore.toFixed(5)}%)`;
              // label.innerHTML = newLabel;
            }

            drawSpectrogram(data, canvas, startStopState);
          });
      }
    } else {
      setStartStopState('Start');
      setClassificationIsReady(false);

      console.log('createHandleclickSubmit(): stop, file: %o', file);
      setTimeout(() => {
        const canvas = document.getElementById(`canvas`) as HTMLCanvasElement;
        const context = canvas.getContext('2d')!;
        context.clearRect(0, 0, canvas.width, canvas.height);
      }, 200);
    }
  };
}

function drawSpectrogram(
  file: Blob,
  canvasElement: HTMLCanvasElement,
  startStopState,
) {
  console.log('drawSpectrogram()');

  try {
    new (window.AudioContext || window['webkitAudioContext'])();
  } catch (err) {
    console.error('Audio API is not available');
    return;
  }

  const canvasWidth = canvasElement.width;
  const audioContext = new (window.AudioContext || window['webkitAudioContext'])();
  const canvasContext = canvasElement.getContext('2d');

  let x = 0;
  const analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = 0.0;
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  const eightBufferLength = 8 * bufferLength + 1;
  const dataArray = new Uint8Array(bufferLength);

  navigator.getUserMedia = navigator.getUserMedia
    || navigator['webkitGetUserMedia']
    || navigator['mozGetUserMedia']
    || navigator['msGetUserMedia'];

  const imageDataFrame = canvasContext!.createImageData(2, canvasElement.height);

  for (let index = 0; index < imageDataFrame.data.length * 4; index += 8) {
    imageDataFrame.data[index] = imageDataFrame.data[index + 6] = 0;

    imageDataFrame.data[index + 3] =
      imageDataFrame.data[index + 4] =
      imageDataFrame.data[index + 5] =
      imageDataFrame.data[index + 7] = 255;
  }

  const source = audioContext.createBufferSource();

  const reader = new FileReader();
  reader.onload = (ev: any) => {
    audioContext.decodeAudioData(
      ev.target.result,
      (_buffer) => {
        source.buffer = _buffer;
        source.connect(analyser);
        source.connect(audioContext.destination);
        source.start(0);
        draw();
      },
      (err) => {
        console.log('drawSpectrogram(): erorr', err);
      },
    );
  };

  reader.readAsArrayBuffer(file);

  function draw() {
    if (startStopState.current === 'Stop') {
      requestAnimationFrame(draw);
    }
    analyser.getByteFrequencyData(dataArray);

    for (let index = 0, _o = eightBufferLength; index < bufferLength; ++index, _o -= 8) {
      imageDataFrame.data[_o] = imageDataFrame.data[_o + 1] = dataArray[index] * 2;
    }

    canvasContext!.putImageData(imageDataFrame, x, 0);

    if (x < canvasWidth) {
      x += 1;
    } else {
      x = 0;
    }
  }
}
