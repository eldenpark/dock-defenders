import styled from 'styled-components';
import React from 'react';

// import About from '@@src/universal/components/About';
import Main from '@@src/universal/components/Main';

const StyledApp = styled.div({
  border: '1px solid gray',
  minHeight: '100vh',
  padding: '50px 0',
  width: 690,
});

const App = () => {
  return (
    <StyledApp>
      <Main />
      {/* <About /> */}
    </StyledApp>
  );
};

export default App;
