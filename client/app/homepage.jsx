import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { GameRoom } from './gameroom.jsx';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      roomCreated: false,
    };
    this.socketHandle = this.socketHandle.bind(this);
  }
  socketHandle(event) {
    const roomName = event.target.socket.value;
    axios.post('/start', {
      room: roomName,
    }).then((result) => {
      this.setState({ roomName, roomCreated: !this.state.roomCreated }, () => {
        console.log(`room ${this.state.roomName} has been created`, result);
      });
    }).catch((error) => {
      console.log(error);
    });
    event.preventDefault();
    const socket = io.connect();
    socket.emit('create', roomName);
    console.log(roomName, 'this worked');
  }
  render() {
    const element = (
      <div className="container">
        <form>
          <label htmlFor="public">Public
            <input type="checkbox" />
          </label>
          <label htmlFor="private">Private
            <input type="checkbox" />
          </label>
        </form>
        <div className="socketInput">
          <form onSubmit={(e) => {
            e.preventDefault();
            this.socketHandle(e);
            }}
          >
            <input type="text" placeholder="make/join a room here" name="socket" />
          </form>
        </div>
        <div className="userInfo">
        Username:{this.props.userInfo.username}
          <br />
          Saves:{this.props.userInfo.save_tokens}
          <br />
          Deaths:{this.props.userInfo.death_tokens}
        </div>
      </div>
    );
    const gameRoom = (<GameRoom roomname={this.state.roomName} userInfo={this.props.userInfo} />);
    const { roomCreated } = this.state;
    return (
      <div>
        {roomCreated ? (gameRoom) : (element)}
      </div>);
  }
}

export { HomePage };
