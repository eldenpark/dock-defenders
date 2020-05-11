import React from 'react';
import styled from 'styled-components';

import Card from './Card';
import color from '@@src/universal/styles/color';

const StyledStatusLog = styled(Card)<any>({
  backgroundColor: color.darkGrey,
});

const StyledVideoLog = styled.div({
  '&>span': {
    marginRight: 5,
  },
});

const LogBody = styled.div({
  height: 230,
  overflow: 'scroll',
});

const DisplayName = styled.span<any>(({
  active,
}) => ({
  color: active ? color.magenta : 'inherit',
}));

const LogItem: React.FC<any> = ({
  data,
  displayTime,
  isTargetFound,
  type,
}) => {
  const self = React.useRef(null) as any;
  const { payload = [] } = data;
  let content = <span>nodrone</span>;
  if (payload.length > 0) {
    const { displayName } = payload[0];
    const logBody = type === 'video'
      ? getVideoLogBody(payload[0])
      : getAudioLogBody(payload[0]);
    content = (
      <>
        <DisplayName
          active={isTargetFound}
          key={displayName}
        >
          {displayName}
        </DisplayName>
        {logBody}
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
  );
};

const StatusLog: React.FC<any> = ({
  dashboardData,
  title,
  type,
}) => {
  const [, updateState] = React.useState();
  const lastLogItemId = React.useRef(null);
  const memoizedLog = React.useRef<any[]>([]);

  React.useEffect(() => {
    const {
      audio,
      displayTime,
      isTargetFoundOnAudio,
      isTargetFoundOnVideo,
      tick,
      video,
    } = dashboardData;
    const data = type === 'video' ? video : audio;
    if (tick > 0 && lastLogItemId.current !== data.file) {
      const element = (
        <LogItem
          data={data}
          displayTime={displayTime}
          isTargetFound={type === 'video' ? isTargetFoundOnVideo : isTargetFoundOnAudio}
          key={displayTime}
          type={type}
        />
      );
      memoizedLog.current.push(
        element,
      );
      lastLogItemId.current = data.file;
      updateState({});
    }
  }, [memoizedLog, dashboardData, dashboardData.displayTime, type]);
  return (
    <StyledStatusLog
      title={title}
    >
      <LogBody>
        {memoizedLog.current}
      </LogBody>
    </StyledStatusLog>
  );
};

export default StatusLog;

function round(num, place) {
  const power = 10 ** place;
  return (Math.floor(num * power) / power).toFixed(place);
}

function getVideoLogBody(payload) {
  const score = round(payload.imageObjectDetection?.score, 3);
  const vertices = payload.imageObjectDetection?.boundingBox?.normalizedVertices.map((nVertices) => { // eslint-disable-line
    const x = round(nVertices.x, 3);
    const y = round(nVertices.y, 3);
    return `${x},${y}`;
  });
  return `coord(${vertices.join('/')}) acc(${score})`;
}

function getAudioLogBody(payload) {
  return `acc(${round(payload.classification.score, 3)})`;
}
