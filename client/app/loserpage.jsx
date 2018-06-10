import React from 'react';
import styled from 'styled-components';

const Message = styled.h1`
    font-size: 200px;
    margin: auto;
    width: 50%;
    padding: 10px;
`;

// const Deaths = styled.li`
//   color: red;
//   font-size: 22px;
//   list-style-type: none;
//   float: right;
//   display: block;
//   text-align: center;
//   padding: 14px 16px;
//   background-color: black;
// `;

// const Saves = styled.li`
//   font-size: 22px;
//   list-style-type: none;
//   float: right;
//   display: block;
//   text-align: center;
//   padding: 14px 16px;
//   background-color: gold;
// `;

// const Wins = styled.li`
//   font-size: 22px;
//   list-style-type: none;
//   float: right;
//   display: block;
//   text-align: center;
//   padding: 14px 16px;
//   background-color: white;
// `;

// const User = styled.li`
//   color: white;
//   font-size: 22px;
//   list-style-type: none;
//   float: left;
//   display: block;
//   text-align: center;
//   padding: 14px 16px;
// `;

// const TopBar = styled.ul`
//   list-style-type: none;
//   margin: 0;
//   padding: 0;
//   overflow: hidden;
//   background-color: gray;
//   overflow: hidden;
//   position: fixed;
//   top: 0;
//   width: 100%;
// `;

function LoserPage() {
  return (
    <div>
    {/* <TopBar className="userInfo">
      <User>Hello, {this.props.userInfo.username}</User>
      <Saves>Saves: {this.props.userInfo.save_tokens}</Saves>
      <Deaths>Deaths: {this.props.userInfo.death_tokens}</Deaths>
      <Wins>Wins: {this.props.userInfo.win_tokens}</Wins>
    </TopBar> */}
    <Message>HA HA You're Dead</Message>
    </div>
  );
}

export { LoserPage };
