import React from 'react';
import styled from 'styled-components';

const StyledVideo = styled.div({
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
  position: 'relative',
});

const Video = ({
  dashboardData,
  videoRef,
}) => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const { video } = dashboardData;
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
      ctx.strokeStyle = '#59fff7';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, dX, dY);
    }
  }, [dashboardData, dashboardData.displayTime, videoRef]);

  return (
    <StyledVideo>
      <canvas ref={canvasRef} />
      <video ref={videoRef}>
        <source src="/docs/assets/quadcopter_002_merged.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </StyledVideo>
  );
};

export default Video;
