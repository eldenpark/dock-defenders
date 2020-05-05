/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

const StyledStatusLog = styled.div({
  border: '1px solid gray',
  flexGrow: 1,
  height: 230,
  marginLeft: 15,
});

const StatusLog = ({
  logData,
}) => {
  console.log(222, logData)

  const list = logData.current.map((val) => {
    return (
      <div key={val}>
        {val}
      </div>
    )
  })

  return (
    <StyledStatusLog>
      {list}
    </StyledStatusLog>
  );
};

export default StatusLog;
