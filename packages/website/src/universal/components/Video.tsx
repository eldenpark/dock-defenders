/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

const StyledVideo = styled.video({});

const Video = ({
  videoRef,
}) => {
  return (
    <StyledVideo
      ref={videoRef}
      width="480"
    >
      <source src="/docs/assets/quadcopter_002_merged.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </StyledVideo>
  );
};

export default Video;
