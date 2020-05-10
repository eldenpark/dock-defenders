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
}));

const Submit = styled(Button)({
  '&:hover': {
    backgroundColor: '#ededed',
    color: 'black',
  },
  backgroundColor: '#3c3938',
  color: 'white',
  transition: 'all 0.5s ease',
  width: 120,
});

const Control: React.FC<any> = ({
  handleClickSubmit,
  launchState,
}) => {
  return (
    <StyledControl>
      <Submit
        onClick={handleClickSubmit}
        type="button"
      >
        {launchState.current === 0 ? 'Simulate' : 'Start Over'}
      </Submit>
    </StyledControl>
  );
};

export default Control;
