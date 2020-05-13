import React from 'react';
import styled from 'styled-components';

import { w320 } from '@@src/universal/styles/media';

const StyledAbout = styled.div({
  '& a': {
    color: '#0F79D0',
  },
  '& h1, & h2, & h3': {
    fontFamily: '"Noto Sans JP", "sans-serif"',
  },
  '& h2': {
    borderBottom: '1px solid #c9c9c9',
    padding: '5px 0 2px 0',
  },
  '& p': {
    marginBottom: 14,
  },
  marginTop: 45,
  wordBreak: 'break-word',
  ...w320({
    padding: '0 9px',
  }),
});

const About = () => {
  const html = process.env.ABOUT_HTML as string;

  return (
    <StyledAbout
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};

export default About;
