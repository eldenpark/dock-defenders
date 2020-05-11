import React from 'react';
import styled from 'styled-components';

import { w320 } from '@@src/universal/styles/media';

const StyledAbout = styled.div({
  '& h1, & h2': {
    fontFamily: '"Noto Sans JP", "sans-serif"',
  },
  wordBreak: 'break-word',
  ...w320({
    padding: '0 9px',
  }),
});

const content = {
  intro: `Currently micro UAV(uavs from 50cm diameter and smaller) pose a risk to US Navy ships specifically in port. The dangers they pose are explosive, biological, or spying in nature. We investigated the possible ways to mitigate the risk and split the solutions into two categories. The first category(which we focus on) is identification/tracking, and the second category is destroying or capturing the drone. The best way we have found to identify/track these micro UAVs is by combining multiple different sensors together and using an algorithm to decide if a drone is present.`,
  motivation: `Understandably, the baseline for a system that would protect and inform Navy crews is one of comprehensiveness and reliability. Our general strategy for addressing these broad and apparent needs converged on first identifying the needs and worries of Navy members themselves. In talks with sailors on active duty, defense system engineers of the DoD, scientists of NSWC Crane, and more, it was the general consensus that Navy ships are wholly unprepared for the unique threat vector of microUAVs. It also became clear that there were two distinct classes of drone threats: fully autonomous, and remotely operated. Fully autonomous microUAVs would be deployed uniquely by wealthier adversaries, with the means to fund the necessary research and hardware. These drones would have negligible electromagnetic footprint, and operate with localized navigation such as computer vision. On the other hand, remotely operated microUAVs are inexpensive, commercially available, and would likely be operated by smaller, non-state parties. Both yield significant payload capacity, given their size, and could be integral sources of hard point damage during a pinpoint attack.`,
};

const About = () => {
  return (
    <StyledAbout>
      <h1>
        Dock Defenders
      </h1>
      <p>{content.intro}</p>
      <h2>Motivation</h2>
      <p>{content.motivation}</p>
      <h2>Report</h2>
      <p>
        <a href="https://docs.google.com/document/d/1O2uDoGs6mDqzvAIVoGMtDXby9XzD4Tt07XqDDN8YOTw/edit?usp=sharing">https://docs.google.com/document/d/1O2uDoGs6mDqzvAIVoGMtDXby9XzD4Tt07XqDDN8YOTw/edit?usp=sharing</a>
      </p>
      <h2>CSCI599 - Special Topics (Hacking for Defense)</h2>
      <div>
        <ul>
          <li>Patrick Darrow</li>
          <li>Sophia Mallaro</li>
          <li>Elden Park</li>
          <li>Ryan Winters</li>
        </ul>
      </div>
    </StyledAbout>
  );
};

export default About;
