/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

const StyledSpectrogram = styled.div({
  marginLeft: 0,
  // '& img': {
  //   height: 50,
  //   marginTop: 6,
  //   width: '100%',
  // },
});

const CanvasContainer = styled.div({
  backgroundColor: '#2b2b2b',
  '& canvas': {
    width: '100%',
    height: 85,
  },
});

const Spectrogram = ({
}) => {
  return (
    <StyledSpectrogram>
      <div>
        <CanvasContainer>
          <canvas id="canvas" />
        </CanvasContainer>
        <div>
          images
        </div>
      </div>
    </StyledSpectrogram>
  );
};

export default Spectrogram;
