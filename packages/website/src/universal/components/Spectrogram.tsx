/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

const isProd = process.env.NODE_ENV === 'production';

const StyledInput = styled.div({
  borderRadius: 7,
  display: 'none',
  flexDirection: 'column',
  fontSize: 13,
  width: 200,
  '& input': {
    borderBottom: '1px solid #bfbfbf',
    cursor: 'pointer',
    paddingBottom: 2,
  },
  '& input:hover': {
    fontWeight: 600,
  },
  '& .filename-production': {
    paddingTop: 4,
  },
});

const Input = ({
  fileName,
  fileUrl,
  itemId,
}) => {
  return (
    <StyledInput>
      <input
        className="files"
        disabled={isProd ? true : false}
        type="file"
      />
      <p
        className="hide"
        id={`fileUrl-production-${itemId}`}>
          {fileUrl}
      </p>
      <p
        className={isProd ? 'fileName-production' : 'hide'}
        id={`fileName-production-${itemId}`}
      >
        {isProd && fileName}
      </p>
    </StyledInput>
  );
};

const StyledSpectrogram = styled.div({
  display: 'inline-block',
  width: 280,
  '& div:first-child': {
    backgroundColor: '#2b2b2b',
  },
  '& canvas': {
    width: 280,
    height: 85,
  },
  '& img': {
    height: 50,
    marginTop: 6,
    width: '100%',
  },
});

const Spectrogram = ({
}) => {
  return (
    <StyledSpectrogram>
      <div>
        <canvas id="canvas" />
      </div>
    </StyledSpectrogram>
  );
};

export default Spectrogram;
