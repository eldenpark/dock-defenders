import React from 'react';
import styled from 'styled-components';

import Card from './Card';
import color from '@@src/universal/styles/color';

const StyledInfo = styled(Card)({
  fontSize: '0.92em',
});

const Time = styled.p({
  '& span': {
    marginRight: '0.4em',
  },
});

const Likelihood = styled.p({
  '& .high': {
    color: color.red,
  },
  '& .low': {
    color: color.lightGreen,
  },
  '& .medium': {
    color: color.yellow,
  },
  '&>span': {
    marginRight: '0.4em',
  },
});

const Info = ({
  dashboardData,
}) => {
  const likelihood = determineHowLikelyIsDrone(dashboardData);

  return (
    <StyledInfo>
      <Time>
        <span>
          Time elapsed:
        </span>
        <span>
          {dashboardData.displayTime}
        </span>
      </Time>
      <Likelihood>
        {likelihood}
      </Likelihood>
    </StyledInfo>
  );
};

export default Info;

function determineHowLikelyIsDrone(dashboardData) {
  const {
    audioAcc,
    isTargetFoundOnAudio,
    isTargetFoundOnVideo,
    videoAcc,
  } = dashboardData;
  if (isTargetFoundOnAudio && isTargetFoundOnVideo) {
    return (
      <>
        <span>Drone</span>
        <span className="high">very likely</span>
        <span>near</span>
        {`(${Math.max(audioAcc, videoAcc)})`}
      </>
    );
  }
  if (isTargetFoundOnAudio) {
    return (
      <>
        <span>Drone</span>
        <span className="medium">likely</span>
        <span>near</span>
        <span>{`(${audioAcc})`}</span>
      </>
    );
  }
  if (isTargetFoundOnVideo) {
    return (
      <>
        <span>Drone</span>
        <span className="medium">likely</span>
        <span>near</span>
        <span>{`(${videoAcc})`}</span>
      </>
    );
  }
  return (
    <>
      <span>Drone</span>
      <span className="low">less likely</span>
      <span>near</span>
    </>
  );
}
