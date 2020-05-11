import React from 'react';
import styled from 'styled-components';

import { w320 } from '@@src/universal/styles/media';

const content = {
  class: `CSCI 599 - Special Topics; Hacking for Defense, Spring 2020 at the University of Southern California`,
  intro: `Currently micro UAV(uavs from 50cm diameter and smaller) pose a risk to US Navy ships specifically in port. The dangers they pose are explosive, biological, or spying in nature. We investigated the possible ways to mitigate the risk and split the solutions into two categories. The first category(which we focus on) is identification/tracking, and the second category is destroying or capturing the drone. The best way we have found to identify/track these micro UAVs is by combining multiple different sensors together and using an algorithm to decide if a drone is present.`,
  motivation: `Understandably, the baseline for a system that would protect and inform Navy crews is one of comprehensiveness and reliability. Our general strategy for addressing these broad and apparent needs converged on first identifying the needs and worries of Navy members themselves. In talks with sailors on active duty, defense system engineers of the DoD, scientists of NSWC Crane, and more, it was the general consensus that Navy ships are wholly unprepared for the unique threat vector of microUAVs. It also became clear that there were two distinct classes of drone threats: fully autonomous, and remotely operated. Fully autonomous microUAVs would be deployed uniquely by wealthier adversaries, with the means to fund the necessary research and hardware. These drones would have negligible electromagnetic footprint, and operate with localized navigation such as computer vision. On the other hand, remotely operated microUAVs are inexpensive, commercially available, and would likely be operated by smaller, non-state parties. Both yield significant payload capacity, given their size, and could be integral sources of hard point damage during a pinpoint attack.`,
};

const StyledAbout = styled.div({
  '& a': {
    color: '#0F79D0',
  },
  '& h1, & h2, & h3': {
    fontFamily: '"Noto Sans JP", "sans-serif"',
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

const Contributors = styled.div({
  '& a': {
    marginLeft: '0.4em',
  },
});

const About = () => {
  return (
    <StyledAbout>
      <h1>
        Dock Defenders
      </h1>
      <p>{content.class}</p>
      <p>{content.intro}</p>
      <h2>Motivation</h2>
      <p>{content.motivation}</p>
      <h2>Methodologies</h2>
      <p>To be described later</p>
      <h2>Documentation</h2>
      <h3>
        Final Report
      </h3>
      <p>
        <a href="https://docs.google.com/document/d/1O2uDoGs6mDqzvAIVoGMtDXby9XzD4Tt07XqDDN8YOTw/edit?usp=sharing">https://docs.google.com/document/d/1O2uDoGs6mDqzvAIVoGMtDXby9XzD4Tt07XqDDN8YOTw/edit?usp=sharing</a>
      </p>
      <h3>
        Presentation
      </h3>
      <p>
        <a href="https://docs.google.com/presentation/d/1wyyn-UVOS15ZEBQX_s6pCsFMzolrOI2l0KrYpmFAdS0/edit?usp=sharing">https://docs.google.com/presentation/d/1wyyn-UVOS15ZEBQX_s6pCsFMzolrOI2l0KrYpmFAdS0/edit?usp=sharing</a>
      </p>
      <h2>Contributors</h2>
      <Contributors>
        <ul>
          <li>
            Patrick Darrow
            <a href="mailto:pdarrow@usc.edu">pdarrow@usc.edu</a>
          </li>
          <li>
            Sophia Mallaro
            <a href="mailto:mallaro@usc.edu">mallaro@usc.edu</a>
          </li>
          <li>
            Elden Park
            <a href="mailto:parkseun@usc.edu">parkseun@usc.edu</a>
          </li>
          <li>
            Ryan Winters
            <a href="mailto:ryanwint@usc.edu">ryanwint@usc.edu</a>
          </li>
        </ul>
      </Contributors>
    </StyledAbout>
  );
};

export default About;
