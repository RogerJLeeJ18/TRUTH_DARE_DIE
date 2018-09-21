import React from 'react';

const Room = (props) => (
  <li onClick={() => (props.clickRoom())} >
    { props.room.room }
    { props.room.rating }
  </li>
)

module.exports = Room;
