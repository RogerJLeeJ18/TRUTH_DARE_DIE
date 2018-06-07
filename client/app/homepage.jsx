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
      endpoint: 'http://127.0.0.1:3000',
    };
    this.socketHandle = this.makeRoom.bind(this);
  }
  makeRoom(event) {
    const roomName = event.target.socket.value;
    axios.post('/start', {
      room: roomName,
    }).then((result) => {
      this.setState({ roomName, roomCreated: !this.state.roomCreated }, () => {
        console.log(`${this.state.roomName} has been created`, result);
      });
    }).catch((error) => {
      console.log(error);
    });
    event.preventDefault();
    const socket = io.connect(this.state.endpoint, { 'reconnect': false });
    socket.emit('create', roomName);
    console.log(roomName, 'this worked');
  }
  joinRoom(event) {
    const roomName = event.target.join.value;
    axios.get(`/rooms/${roomName}`).then((result) => {
      this.setState({ roomName, roomCreated: !this.state.roomCreated }, () => {
        console.log(`you have joined ${this.state.roomName}`, result);
      });
    }).catch((error) => {
      console.log(error, 'unable to join');
    });
    event.preventDefault();
    const socket = io.connect(this.state.endpoint, { reconnect: false });
    socket.emit('join', roomName);
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
        <div className="socketMakeRoom">
          <form onSubmit={(e) => {
            e.preventDefault();
            this.makeRoom(e);
            }}
          >
            <input type="text" placeholder="Make a room here" name="socket" />
          </form>
        </div>
        <div className="socketJoinRoom">
          <form onSubmit={(e) => {
            e.preventDefault();
            this.joinRoom(e);
          }}
          >
            <input type="text" placeholder="Join a room here" name="join" />
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
