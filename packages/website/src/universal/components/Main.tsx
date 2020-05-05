/* eslint-disable */

import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

import Control from '@@src/universal/components/Control';
import { log } from '@@src/universal/modules/Logger';
import Spectrogram from '@@src/universal/components/Spectrogram';
import StatusLog from '@@src/universal/components/StatusLog';
import Video from '@@src/universal/components/Video';

const simulatedData = process.env.SIMULATED_DATA as any;

const StyledMain = styled.div({
  '& > div': {
    marginBottom: 42,
  }
});

const FirstRow = styled.div({
  display: 'flex',
  justifyContent: 'center',
});

const SecondRow = styled.div({
  display: 'flex',
});

const Main = () => {
  const startStopState = React.useRef<any>('Start');
  const [, updateState] = React.useState();
  const setStartStopState = React.useCallback((nextState) => {
    startStopState.current = nextState;
    updateState({});
  }, []);

  const videoRef = React.useRef(null);
  const logData = React.useRef([]);
  const handleClickSubmit = React.useCallback(createHandleClickSubmit(
    logData,
    updateState,
    setStartStopState,
    startStopState,
    videoRef,
  ), [startStopState]);

  return (
    <StyledMain>
      <FirstRow>
        <Video
          videoRef={videoRef}
        />
      </FirstRow>
      <SecondRow>
        <Spectrogram />
        <StatusLog logData={logData}/>
      </SecondRow>
      <div>
        <Control
        handleClickSubmit={handleClickSubmit}
        startStopState={startStopState}
      />
      </div>
    </StyledMain>
  );
};

export default Main;

function createHandleClickSubmit(
  logData,
  updateState,
  setStartStopState,
  startStopState: { current: string },
  videoRef,
) {
  const file = undefined;

  return () => {
    const timer = setInterval(updateLog, 1000);
    let tick = 0;

    function updateLog() {
      log('updateLog(), simulatedData: %o', simulatedData);

      if (tick === simulatedData.length) {
        clearInterval(timer);
        return;
      } else {
        console.log(3);
        tick += 1;
        logData.current.push(Date.now());
        updateState({});
      }
    }

    log('createHandleclickSubmit(): startStop: %s', startStopState.current);
    log('simulatedData: %j', process.env.SIMULATED_DATA);

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
            console.log(1, data);
            // const _pregeneratedData = pregeneratedData[i];
            const label: any = document.getElementById(`classification`);
            if (label !== null) {
              // const { classification, displayName } = _pregeneratedData.classify;
              // const normalizedScore = (+classification.score * 100) / 100;
              // const newLabel = `<b>${displayName}</b> (${normalizedScore.toFixed(5)}%)`;
              // label.innerHTML = newLabel;
            }

            drawSpectrogram(data, canvas, startStopState);
            const video = videoRef.current;
            setTimeout(() => {
              video.play();
            }, 300);
          });
      }
    } else {
      setStartStopState('Start');

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

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.0;

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
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const reader = new FileReader();
  reader.onload = (ev: any) => {
    audioContext.decodeAudioData(
      ev.target.result,
      (_buffer) => {
        source.buffer = _buffer;
        source.connect(analyser);
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
