import styled from 'styled-components';
import React from 'react';

import About from '@@src/universal/components/About';
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

const Warn = styled.div({
  color: '#717171',
  fontSize: '0.8em',
  fontWeight: 200,
  padding: '12px 0',
  textAlign: 'center',
});

const App = () => {
  return (
    <StyledApp>
      <Warn>This page is optimized for a viewport of width 700px or greater.</Warn>
      <Dashboard
        simulatedData={simulatedData}
      />
      <About />
    </StyledApp>
  );
};

export default App;
