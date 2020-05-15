import styled from 'styled-components';
import React from 'react';

import About from '@@src/universal/components/About';
import color from '@@src/universal/styles/color';
import Dashboard from '@@src/universal/components/Dashboard/Dashboard';
import { w320 } from '@@src/universal/styles/media';

const simulatedData = process.env.SIMULATED_DATA as any;

const StyledApp = styled.div({
  margin: '0 auto',
  minHeight: '100vh',
  padding: '0px 0 50px 0',
  width: 690,
  ...w320({
    width: '100%',
  }),
});

const DescriptionHint = styled.div({
  '& i': {
    borderColor: color.lightBlack,
    borderStyle: 'solid',
    borderWidth: '0 1px 1px 0',
    display: 'inline-block',
    marginLeft: 6,
    padding: '3px',
    transform: 'rotate(45deg) translate(-0.15em, -0.15em)',
  },
  '& span': {
    color: color.lightBlue,
  },
  '&:hover': {
    textDecoration: 'underline',
  },
  color: color.lightBlack,
  fontSize: '0.9em',
  fontWeight: 200,
  padding: '12px 0',
  textAlign: 'center',
});

const App = () => {
  return (
    <StyledApp>
      <DescriptionHint>
        <a href="#dockdefenders">
          <b>Dock Defenders</b>
          &nbsp;- Read the&nbsp;
          <span>description</span>
          &nbsp;below
          <i />
        </a>
      </DescriptionHint>
      <Dashboard
        simulatedData={simulatedData}
      />
      <About />
    </StyledApp>
  );
};

export default App;
