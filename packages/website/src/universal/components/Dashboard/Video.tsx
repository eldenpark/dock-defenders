import React from 'react';
import styled from 'styled-components';

import Card from './Card';
import color from '@@src/universal/styles/color';

const publicPath = process.env.PUBLIC_PATH;

const StyledVideo = styled(Card)<any>(({
  isActive,
}) => ({
  '& canvas': {
    height: 238.5,
    position: 'absolute',
    width: 424,
    zIndex: 1000,
  },
  '& video': {
    height: 238.5,
    width: 424,
  },
  '&>div': {
    position: 'relative',
  },
  backgroundColor: isActive ? color.paleMagenta : color.darkGrey,
  transition: isActive ? 'none' : 'background-color 0.9s ease',
}));

const Meta = styled.div({
  backgroundColor: '#0000007a',
  fontSize: '0.7em',
  left: 0,
  padding: '1px 3px',
  position: 'absolute',
  top: 0,
});

const Video = ({
  dashboardData,
  videoRef,
}) => {
  const canvasRef = React.useRef(null);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    const { isTargetFoundOnVideo, video } = dashboardData;
    const { payload } = video;
    const canvas = canvasRef.current as any;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (payload && payload.length > 0 && canvas) {
      const { height, width } = canvas;
      const { normalizedVertices } = payload[0].imageObjectDetection?.boundingBox;
      const x = width * normalizedVertices[0].x;
      const y = height * normalizedVertices[0].y;
      const dX = width * (normalizedVertices[1].x - normalizedVertices[0].x);
      const dY = height * (normalizedVertices[1].y - normalizedVertices[0].y);

      ctx.beginPath();
      ctx.strokeStyle = color.magenta;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, dX, dY);
    }

    let timer;
    if (isTargetFoundOnVideo) {
      setIsActive(true);
      timer = setTimeout(() => {
        setIsActive(false);
      }, 100);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [dashboardData, dashboardData.displayTime, videoRef]);

  return (
    <StyledVideo
      isActive={isActive}
      title="Camera"
    >
      <div>
        <Meta>Sampling rate: 1Hz</Meta>
        <canvas ref={canvasRef} />
        <video ref={videoRef}>
          <source src={`/${publicPath}/assets/quadcopter_002_merged.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </StyledVideo>
  );
};

export default Video;
