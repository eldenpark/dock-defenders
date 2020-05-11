import React from 'react';
import styled from 'styled-components';

import color from '@@src/universal/styles/color';

const StyledControl = styled.div({
  display: 'flex',
  margin: '30px 0 10px',
});

const Button = styled.button<any>(({
  disabled,
}) => ({
  alignItems: 'center',
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
    backgroundColor: color.submitButtonHover,
    color: 'black',
  },
  backgroundColor: color.submitButton,
  color: 'white',
  transition: 'all 0.3s ease',
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
