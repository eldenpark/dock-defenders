import React from 'react';
import styled from 'styled-components';

import color from '@@src/universal/styles/color';
import { w320 } from '@@src/universal/styles/media';

const StyledAbout = styled.div({
  '& a': {
    color: color.lightBlue,
  },
  '& h1, & h2, & h3': {
    fontFamily: '"Noto Sans JP", "sans-serif"',
  },
  '& h2': {
    borderBottom: '1px solid #c9c9c9',
    padding: '5px 0 2px 0',
  },
  '& img': {
    alignSelf: 'center',
    margin: '15px 0',
    width: '70%',
  },
  '& p': {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 14,
  },
  marginTop: 32,
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
