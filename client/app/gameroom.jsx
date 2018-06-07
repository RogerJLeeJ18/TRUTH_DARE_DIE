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
    };
    this.userSendMessage = this.userSendMessage.bind(this);
  }
  userSendTruth(event) {
    const truth = event.target.sendMessage.value;
    const socket = io.connect();
    this.setState({ messageHistory: [...this.state.messageHistory, truth] }, () => {
      socket.emit('sendMessage', truth);
    });
    event.preventDefault();
  }
  userSendMessage(event) {
    const message = event.target.sendMessage.value;
    const socket = io.connect();
    this.setState({ messageHistory: [...this.state.messageHistory, message] }, () => {
      console.log(this.state.messageHistory);
      socket.emit('sendMessage', message);
    });
    event.preventDefault();
  }
  render() {
    const messageList = this.state.messageHistory.map(message => <li key={message}>{message}</li>);
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
        <form>
          <label htmlFor="truth">
            <input type="text" name="truth" />
          </label>
        </form>
      </div>
    );
  }
}

export { GameRoom };
