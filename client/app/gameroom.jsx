import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import io from 'socket.io-client';

class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: '',
      userInfo: {},
      messageHistory: [],
      truth: '',
      endpoint: 'http://127.0.0.1:3000',
    };
    // bind function to send messages and truth answer to component
    this.userSendMessage = this.userSendMessage.bind(this);
    this.userSendTruth = this.userSendTruth.bind(this);
  }

  userSendTruth(event) {
    const truth = event.target.sendMessage.value;
    const socket = io.connect(this.state.endpoint, { 'reconnect': false });
    this.setState({ truth }, () => {
      socket.emit('sendTruth', this.state.truth);
    });
    event.preventDefault();
  }
  userSendMessage(event) {
    const message = `${this.props.userInfo.username}: ${event.target.sendMessage.value}`;
    const socket = io.connect(this.state.endpoint, { 'reconnect': false });
    this.setState({ messageHistory: [...this.state.messageHistory, message] }, () => {
      socket.emit('sendMessage', message);
    });
    event.preventDefault();
  }
  render() {
    const { username } = this.props.userInfo;
    const socket = io(this.state.endpoint, { 'reconnect': false });
    socket.on('sendMessage', (message) => {
      this.setState({ messageHistory: [...this.state.messageHistory, message] }, () => {
        console.log(message);
      });
    });
    const messageList = this.state.messageHistory.map(message =>
      <li key={message}>{message}</li>);
    return (
      <div>
        <form onSubmit={(e) => {
          this.userSendMessage(e);
          e.preventDefault();
        }}
        >
          <label htmlFor="chatRoom">
            ChatRoom:
            <input type="text" name="sendMessage" />
          </label>
          <input type="submit" value="Send" />
        </form>
        <div className="chatroom">{messageList}</div>
        <form onSubmit={(e) => {
          this.userSendTruth(e);
          e.preventDefault();
        }}
        >
          <label htmlFor="truth">
            <input type="text" name="truth" />
          </label>
        </form>
      </div>
    );
  }
}

export { GameRoom };
