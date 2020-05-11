import styled from 'styled-components';
import React from 'react';

import About from '@@src/universal/components/About';
import Dashboard from '@@src/universal/components/Dashboard/Dashboard';

const simulatedData = process.env.SIMULATED_DATA as any;

const StyledApp = styled.div({
  margin: '0 auto',
  minHeight: '100vh',
  padding: '50px 0',
  width: 690,
});

const App = () => {
  return (
    <StyledApp>
      <Dashboard
        simulatedData={simulatedData}
      />
      <About />
    </StyledApp>
  );
};

export default App;
