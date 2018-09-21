import React from 'react';
const Room = require('./room.jsx');

const RoomList = (props) => {
  return (
    <ul>
      {props.rooms.map((room) => (
        <Room room={room} clickRoom={props.clickRoom}/>
      ))}
    </ul>
  );
};

module.exports = RoomList;

