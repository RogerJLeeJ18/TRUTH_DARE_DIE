import React from 'react';
import styled from 'styled-components';

const Message = styled.h1`
    font-size: 100px;
    margin: auto;
    width: 50%;
    padding: 10px;
    text-align: center;
`;

function WinnerPage() {
  return (
    <div>
    <Message>Congratulations,</Message>
    <Message>You Survived!...</Message>
    <Message>For Now</Message>
    </div>
  );
}

export { WinnerPage };
