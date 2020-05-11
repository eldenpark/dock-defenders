import React from 'react';
import styled from 'styled-components';

import color from '@@src/universal/styles/color';

const StyledCard = styled.div({
  backgroundColor: color.darkGrey,
  borderRadius: 2,
  flexGrow: 0,
  padding: '0 8 8 8',
});

const Title = styled.p({
  color: color.paleGray,
  display: 'flex',
  fontSize: '0.8em',
  fontWeight: 600,
  justifyContent: 'center',
  letterSpacing: '0.04em',
  padding: '4 0',
});

const Card: React.FC<any> = ({
  children,
  className,
  title,
}) => {
  return (
    <StyledCard
      className={className}
    >
      <Title>
        {title}
      </Title>
      <div>
        {children}
      </div>
    </StyledCard>
  );
};

export default Card;
