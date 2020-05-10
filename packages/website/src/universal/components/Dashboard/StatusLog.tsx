/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

const StyledStatusLog = styled.div({
  flexGrow: 1,
  height: 230,
  overflow: 'scroll',
});

const StyledVideoLog = styled.div({
  '& .target': {
    color: 'red',
  },
  '&>span': {
    marginRight: 5,
  },
  fontSize: '0.8em',
});

const DisplayName = styled.span<any>(({
  active,
}) => ({
  color: active ? '#59fff7' : 'inherit',
}));

const VideoLog: React.FC<any> = ({
  data,
  displayTime,
  targetLabel,
}) => {
  const self = React.useRef(null) as any;
  const { payload = [] } = data;
  let content;
  if (payload.length > 0) {
    const { displayName } = payload[0];
    const vertices = payload[0].imageObjectDetection?.boundingBox?.normalizedVertices.map((nVertices) => {
      const x = round(nVertices.x, 5);
      const y = round(nVertices.y, 5);
      return <span key={nVertices.x + nVertices.y}>{`${x},${y}`}</span>
    });
    console.log(222);
    content = (
      <>
        <DisplayName
          active={displayName === targetLabel}
          key={displayName}>
          {displayName}
        </DisplayName>
        {vertices}
      </>
    );
  }

  React.useEffect(() => {
    if (payload.length > 0) {
      self.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return (
    <StyledVideoLog ref={self}>
      <span>{displayTime}</span>
      {content}
    </StyledVideoLog>
  )
};

const StatusLog: React.FC<any> = ({
  dashboardData,
  type,
}) => {
  const [, updateState] = React.useState();
  const memoizedLog = React.useRef<any[]>([]);
  React.useEffect(() => {
    const { displayTime, targetLabel, tick, video } = dashboardData;
    if (tick > 0) {
      const element = type === 'video'
        ? (
          <VideoLog
            data={video}
            displayTime={displayTime}
            key={displayTime}
            targetLabel={targetLabel}
          />
        )
        : (
          <div></div>
        );
      memoizedLog.current.push(<div key={displayTime}>{element}</div>);
      updateState({});
    }
  }, [memoizedLog, dashboardData.displayTime]);
  return (
    <StyledStatusLog>
      {memoizedLog.current}
    </StyledStatusLog>
  );
};

export default StatusLog;

function round(num, place) {
  const power = Math.pow(10, place);
  return Math.round(num * power) / power;
}
