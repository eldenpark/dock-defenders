import React from 'react';
import styled from 'styled-components';

import Card from './Card';
import color from '@@src/universal/styles/color';

const StyledSpectrogram = styled(Card)<any>(({
  isActive,
}) => ({
  backgroundColor: isActive ? color.paleMagenta : color.darkGrey,
  marginLeft: 0,
  transition: isActive ? 'none' : 'background-color 0.9s ease',
}));

const CanvasContainer = styled.div({
  '& canvas': {
    height: 85,
    width: 194,
  },
  backgroundColor: '#2b2b2b',
  position: 'relative',
});

const Meta = styled.div({
  backgroundColor: '#0000007a',
  fontSize: '0.7em',
  left: 0,
  padding: '1px 3px',
  position: 'absolute',
  top: 0,
});

const ImageContainer = styled.div({
  '& img': {
    height: 70,
    position: 'absolute',
    transform: 'translateX(194px)',
    transition: 'all 0.5s ease',
    width: 194,
  },
  height: 70,
  overflow: 'hidden',
  position: 'relative',
  width: 194,
});

const Spectrogram = ({
  dashboardData,
  spectrogramRef,
}) => {
  const [isActive, setIsActive] = React.useState(false);
  const [, updateState] = React.useState();
  const images = React.useRef<any>([]);
  const lastInsertedFileId = React.useRef(null);
  const imageContainerRef = React.useRef<any>(null);

  React.useEffect(() => {
    const { audio, isTargetFoundOnAudio } = dashboardData;
    const currentImages = images.current;

    let timer;
    if (isTargetFoundOnAudio) {
      setIsActive(true);
      timer = setTimeout(() => {
        setIsActive(false);
      }, 100);
    }

    if (audio.file && (lastInsertedFileId.current !== audio.file)) {
      const imageContainer = imageContainerRef.current;
      for (let i = 0; i < imageContainer.children.length; i += 1) {
        const child = imageContainer.children[i];
        const age = Number(child.getAttribute('data-age')!) + 1;
        child.setAttribute('data-age', age.toString());
        child.setAttribute('style', `transform: translateX(-${age * 194}px);`);
      }

      if (currentImages.length > 2) {
        currentImages.shift();
      }

      currentImages.push(
        <img
          alt="spectrogram"
          data-age={-1}
          key={audio.file}
          src={`/docs/assets/spectrograms/${audio.file}`}
        />,
      );

      lastInsertedFileId.current = audio.file;
      updateState({});
    }

    return () => {
      clearTimeout(timer);
    };
  }, [lastInsertedFileId, spectrogramRef, dashboardData, dashboardData.displayTime]);

  return (
    <StyledSpectrogram
      isActive={isActive}
      title="Microphone"
    >
      <div>
        <CanvasContainer>
          <canvas ref={spectrogramRef} />
          <Meta>Sampling rate: 0.2Hz</Meta>
        </CanvasContainer>
        <ImageContainer ref={imageContainerRef}>
          {images.current}
        </ImageContainer>
      </div>
    </StyledSpectrogram>
  );
};

export default Spectrogram;
