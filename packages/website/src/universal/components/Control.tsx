/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

const StyledControl = styled.div({
  display: 'flex',
  marginTop: 30,
});

const Button = styled.button<any>(({
  bgColor,
  disabled,
}) => ({
  alignItems: 'center',
  backgroundColor: bgColor,
  borderRadius: 8,
  cursor: 'pointer',
  display: 'flex',
  fontSize: 15,
  height: 36,
  justifyContent: 'center',
  opacity: disabled ? 0.7 : 1,
  outline: 0,
  width: 100,
  '&:hover': {
    fontWeight: 800,
    transform: disabled ? 'none' : 'translate(1px,1px)',
  },
}));

const Submit = styled(Button)({
  backgroundColor: '#3c3938',
  color: 'white',
  width: 120,
});

const Right = styled.div({
  display: 'flex',
  '& > *': {
    marginRight: 19,
  },
});

const Control: React.FC<any> = ({
  handleClickSubmit,
  startStopState,
}) => {
  return (
    <StyledControl>
      <Submit
        onClick={handleClickSubmit}
        type="button"
      >
        {startStopState.current === 'Start' ? 'Start' : 'Start Over'}
      </Submit>
    </StyledControl>
  );
};

export default Control;
