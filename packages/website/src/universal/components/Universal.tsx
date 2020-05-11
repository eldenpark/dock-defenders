import { compose } from 'redux';
import styled, { createGlobalStyle } from 'styled-components';
import React from 'react';

import App from '@@src/universal/components/App';
import ErrorBoundary from '@@src/universal/components/ErrorBoundary';
import normalize from '@@src/universal/styles/normalize';

const Normalize = createGlobalStyle`
  ${normalize}
`;

const GlobalStyle = createGlobalStyle({
  '*': {
    boxSizing: 'border-box',
  },
  a: {
    '&:hover': {
      textDecoration: 'none',
    },
    color: 'inherit',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.5s ease, border-bottom 0.5s ease',
  },
  body: {
  },
  button: {
    backgroundColor: 'inherit',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    margin: 0,
    outline: 'none',
    padding: 0,
  },
  html: {
    fontFamily: '"Helvetica", "Arial", "sans-serif"',
    fontSize: 16,
    lineHeight: 1.51,
  },
  input: {
    border: 'none',
    outline: 'none',
  },
  p: {
    margin: 0,
  },
  ul: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
});

const StyledUniversal = styled.div({
  // fontSize: '1.34rem',
  minWidth: 318,
});

const Universal: React.FC<any> = () => {
  return (
    <ErrorBoundary>
      <StyledUniversal>
        <Normalize />
        <GlobalStyle />
        <App />
      </StyledUniversal>
    </ErrorBoundary>
  );
};

export default compose(
)(Universal);

declare global {
  interface Window {
    SimpleMDE;
  }
}
