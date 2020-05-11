import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

import color from '@@src/universal/styles/color';
import Control from './Control';
import Info from './Info';
import { log } from '@@src/universal/modules/Logger';
import Spectrogram from './Spectrogram';
import StatusLog from './StatusLog';
import Video from './Video';

const publicPath = process.env.PUBLIC_PATH;

const StyledDashboard = styled.div({
  backgroundColor: color.dashboardBackground,
  color: 'white',
  fontFamily: 'Helvetica, Arial, "Sans-Serif"',
  fontSize: '0.95em',
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
    width: _width,
  },
  '&>div:not(:first-child)': {
    marginTop: 10,
  },
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 0,
}));

const Dashboard = ({
  simulatedData,
}) => {
  const launchState = React.useRef<any>(0);
  const [, updateState] = React.useState();
  const setLaunchState = React.useCallback((nextState) => {
    launchState.current = nextState;
    updateState({});
  }, []);

  const videoRef = React.useRef(null);
  const spectrogramRef = React.useRef(null);
  const dashboardData = React.useRef({
    audio: {},
    audioAcc: 0,
    displayTime: '00:00',
    isTargetFoundOnAudio: false,
    isTargetFoundOnVideo: false,
    targetLabel: 'drone',
    tick: 0,
    video: {},
    videoAcc: 0,
  });
  const handleClickSubmit = React.useCallback(createHandleClickSubmit({
    dashboardData,
    launchState,
    setLaunchState,
    simulatedData,
    spectrogramRef,
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
            title="Object detection log"
            type="video"
          />
        </Column>
        <Column _width={210}>
          <Info dashboardData={dashboardData.current} />
          <Spectrogram
            dashboardData={dashboardData.current}
            spectrogramRef={spectrogramRef}
          />
          <StatusLog
            dashboardData={dashboardData.current}
            title="Sound classification log"
            type="audio"
          />
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

export default Dashboard;

function createHandleClickSubmit({
  dashboardData,
  launchState,
  setLaunchState,
  simulatedData,
  spectrogramRef,
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

      if (currentDashboardData.tick === simulatedDataLength || launchState.current === 0) {
        clearInterval(timer);
      } else {
        currentDashboardData.tick += 1;
        currentDashboardData.displayTime = makeSecondDisplayable(currentDashboardData.tick);
        currentDashboardData.video = simulatedData.video[videoIdx];
        currentDashboardData.isTargetFoundOnVideo = false;
        if (simulatedData.video[videoIdx].payload.length > 0) {
          const payload = simulatedData.video[videoIdx].payload[0];
          currentDashboardData.isTargetFoundOnVideo = payload.displayName === 'drone';
          currentDashboardData.videoAcc = round(payload.imageObjectDetection?.score, 3);
        }
        videoIdx += 1;

        if (currentDashboardData.tick % 5 === 1) {
          currentDashboardData.audio = simulatedData.audio[audioIdx];
          if (simulatedData.audio[audioIdx].payload.length > 0) {
            const payload = simulatedData.audio[audioIdx].payload[0];
            currentDashboardData.isTargetFoundOnAudio = payload.displayName === 'drone';
            currentDashboardData.audioAcc = round(payload.classification.score, 3);
          }
          audioIdx += 1;
        }

        updateState({});
      }
    }

    const video = videoRef.current;
    const spectrogram = spectrogramRef.current;

    if (launchState.current === 0) {
      setLaunchState(1);
      const fileUrl = `/${publicPath}/assets/quadcopter_002_audio_merged.mp3`;
      log('createHandleClickSubmit(): fileUrl: %s', fileUrl);

      if (fileUrl !== null) {
        axios.get(fileUrl, {
          responseType: 'blob',
        })
          .then((response) => {
            const { data } = response;
            drawSpectrogram(data, spectrogram, launchState);
            setTimeout(() => {
              video.play();
            }, 300);
          });
      }
    } else {
      setLaunchState(0);

      log('createHandleclickSubmit(): stop');
      setTimeout(() => {
        const context = spectrogram.getContext('2d')!;
        context.clearRect(0, 0, spectrogram.width, spectrogram.height);
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
  log('drawSpectrogram()');

  try {
    new (window.AudioContext || window['webkitAudioContext'])(); // eslint-disable-line
  } catch (err) {
    log('Audio API is not available');
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
        log('drawSpectrogram(): erorr', err);
      },
    );
  };

  reader.readAsArrayBuffer(file);

  function draw() {
    if (launchState.current === 1) {
      requestAnimationFrame(draw);
    }
    analyser.getByteFrequencyData(dataArray);

    for (let index = 0, _o = eightBufferLength; index < bufferLength; ++index, _o -= 8) { // eslint-disable-line
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

function round(num, place) {
  const power = 10 ** place;
  return (Math.floor(num * power) / power).toFixed(place);
}
