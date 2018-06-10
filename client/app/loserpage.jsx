import React from 'react';
import styled from 'styled-components';

const Message = styled.h1`
    font-size: 200px;
    margin: auto;
    width: 50%;
    padding: 10px;
    text-align: center;
`;

function LoserPage() {
  return (
    <div>
    <Message>HA HA You're Dead</Message>
    </div>
  );
}

export { LoserPage };
