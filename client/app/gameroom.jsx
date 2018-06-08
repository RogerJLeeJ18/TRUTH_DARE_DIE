import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Webcam from 'react-webcam';
import { WebcamCapture } from './recorder.jsx';

class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: '',
      userInfo: {},
      messageHistory: [],
      truth: '',
    };
    // bind function to send messages and truth answer to component
    this.userSendMessage = this.userSendMessage.bind(this);
    this.userSendTruth = this.userSendTruth.bind(this);
  }
  componentDidMount() {
    this.props.socket.on('sentMessage', (message) => {
      this.setState({ messageHistory: [...this.state.messageHistory, message] });
    });
  }
  userSendTruth(event) {
    const truth = event.target.sendMessage.value;
    this.setState({ truth }, () => {
      this.props.socket.emit('sendTruth', this.state.truth);
    });
    event.preventDefault();
  }
  userSendMessage(event) {
    const message = `${this.props.userInfo.username}: ${event.target.sendMessage.value}`;
    this.setState({ messageHistory: [...this.state.messageHistory, message] }, () => {
      this.props.socket.emit('sendMessage', message);
      console.log(message);
    });
    event.preventDefault();
  }
  render() {
    const { username } = this.props.userInfo;
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
        <form onSubmit={(e) => {
          this.userSendTruth(e);
          e.preventDefault();
        }}
        >
          <label htmlFor="truth">
            <input type="text" name="truth" />
          </label>
        </form>
        <WebcamCapture />
      </div>
    );
  }
}

export { GameRoom };
