/* eslint-disable */

import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

import Control from './Control';
import Info from './Info';
import { log } from '@@src/universal/modules/Logger';
import Spectrogram from './Spectrogram';
import StatusLog from './StatusLog';
import Video from './Video';

const StyledDashboard = styled.div({
  backgroundColor: '#121111',
  color: 'white',
  fontFamily: 'Helvetica, Arial, "Sans-Serif"',
  padding: '10 10',
});

const DashboardBody = styled.div({
  display: 'flex',
  justifyContent: 'center',
});

const Column = styled.div<any>(({
  _width,
}) => ({
  '&:last-child': {
    marginLeft: 10,
  },
  '&>div': {
    backgroundColor: '#1b1b1b',
    borderRadius: 2,
    flexGrow: 0,
    padding: 8,
    width: _width,
  },
  '&>div:not(:first-child)': {
    marginTop: 10,
  },
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 0,
  // flexBasis: _width || 'auto',
  // width: _width,
}))

const Main = ({
  simulatedData,
}) => {
  const launchState = React.useRef<any>(0);
  const [, updateState] = React.useState();
  const setLaunchState = React.useCallback((nextState) => {
    launchState.current = nextState;
    updateState({});
  }, []);

  const videoRef = React.useRef(null);
  const dashboardData = React.useRef({
    audio: {},
    displayTime: '00:00',
    targetLabel: 'drone',
    tick: 0,
    video: {},
  });
  const handleClickSubmit = React.useCallback(createHandleClickSubmit({
    launchState,
    dashboardData,
    setLaunchState,
    simulatedData,
    updateState,
    videoRef,
  }), [launchState, setLaunchState]);

  return (
    <StyledDashboard>
      <DashboardBody>
        <Column _width={440}>
          <Video
            dashboardData={dashboardData.current}
            videoRef={videoRef}
          />
          <StatusLog
            dashboardData={dashboardData.current}
            type="video"
          />
        </Column>
        <Column _width={210}>
          <Info displayTime={dashboardData.current.displayTime} />
          <Spectrogram />
          {/* <StatusLog/> */}
        </Column>
      </DashboardBody>
      <div>
        <Control
          handleClickSubmit={handleClickSubmit}
          launchState={launchState}
        />
      </div>
    </StyledDashboard>
  );
};

export default Main;

function createHandleClickSubmit({
  dashboardData,
  launchState,
  setLaunchState,
  simulatedData,
  updateState,
  videoRef,
}) {
  return () => {
    const simulatedDataLength = Math.max(simulatedData.audio.lengh, simulatedData.video.length);
    const timer = setInterval(updateLog, 1000);
    let audioIdx = 0;
    let videoIdx = 0;

    log('createHandleClickSubmit(): launchState: %s, simulatedData: %o', launchState.current, simulatedData);

    function updateLog() {
      const currentDashboardData = dashboardData.current;

      log('updateLog(), previousTick: %s, videoIdx: %s', currentDashboardData.tick, videoIdx);

      if (currentDashboardData.tick === simulatedDataLength || launchState.current === 0) {
        clearInterval(timer);
        return;
      } else {
        currentDashboardData.tick += 1;
        currentDashboardData.displayTime = makeSecondDisplayable(currentDashboardData.tick);
        currentDashboardData.video = simulatedData.video[videoIdx];
        videoIdx += 1;

        updateState({});
      }
    }

    const video = videoRef.current;

    if (launchState.current === 0) {
      setLaunchState(1);
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

            drawSpectrogram(data, canvas, launchState);
            setTimeout(() => {
              video.play();
            }, 300);
          });
      }
    } else {
      setLaunchState(0);

      console.log('createHandleclickSubmit(): stop');
      setTimeout(() => {
        const canvas = document.getElementById(`canvas`) as HTMLCanvasElement;
        const context = canvas.getContext('2d')!;
        context.clearRect(0, 0, canvas.width, canvas.height);
        video.pause();
      }, 300);
    }
  };
}

function drawSpectrogram(
  file: Blob,
  canvasElement: HTMLCanvasElement,
  launchState,
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
  const canvasContext = canvasElement.getContext('2d') as CanvasRenderingContext2D;

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
    imageDataFrame.data[index] = 0;
    imageDataFrame.data[index + 3] = 255;
    imageDataFrame.data[index + 4] = 255;
    imageDataFrame.data[index + 5] = 255;
    imageDataFrame.data[index + 6] = 0;
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
    if (launchState.current === 1) {
      requestAnimationFrame(draw);
    }
    analyser.getByteFrequencyData(dataArray);

    for (let index = 0, _o = eightBufferLength; index < bufferLength; ++index, _o -= 8) {
      imageDataFrame.data[_o - 1] = dataArray[index] * 2;
      imageDataFrame.data[_o] = dataArray[index] * 2;
      imageDataFrame.data[_o + 1] = dataArray[index] * 1;
    }

    canvasContext!.putImageData(imageDataFrame, x, 0);

    if (x < canvasWidth) {
      x += 1;
    } else {
      x = 0;
    }
  }
}

function makeSecondDisplayable(tick) {
  const minutes = Math.floor(tick / 60);
  const seconds = tick - minutes * 60;
  return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string)
    .slice(-length);
}
