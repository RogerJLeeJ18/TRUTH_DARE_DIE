import React from 'react';
import styled from 'styled-components';

const Message = styled.h1`
    font-size: 100px;
    margin: auto;
    width: 50%;
    padding: 10px;
    text-align: justify;
`;

function WinnerPage() {
  return (
    <Message>Congratulations, You Survived!... For Now</Message>
  );
}

export { WinnerPage };