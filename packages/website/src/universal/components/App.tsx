import styled from 'styled-components';
import React from 'react';

import Main from '@@src/universal/components/Main';

const StyledApp = styled.div({
  padding: '50px 0',
});

const App = () => {
  return (
    <StyledApp>
      {/* <video width="480" controls>
        <source src="/docs/assets/quadcopter_002_merged.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <div>
        <Main />
      </div>
    </StyledApp>
  );
};

export default App;
