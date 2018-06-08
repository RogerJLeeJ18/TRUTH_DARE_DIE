import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { WebcamCapture } from './recorder.jsx';

class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: '',
      userInfo: {},
      messageHistory: [],
      truth: '',
      alive: true,
    };
    // bind function to send messages and truth answer to component
    this.userSendVideo = this.userSendVideo.bind(this);
    this.userSendMessage = this.userSendMessage.bind(this);
    this.userSendTruth = this.userSendTruth.bind(this);
    this.userSelectDare = this.userSelectDare.bind(this);
    this.userSelectTruth = this.userSelectTruth.bind(this);
  }
  componentDidMount() {
    this.props.socket.on('sentMessage', (message) => {
      this.setState({ messageHistory: [...this.state.messageHistory, message] });
    });
  }
  userSendTruth(event) {
    const truth = event.target.truth.value;
    this.setState({ truth }, () => {
      this.props.socket.emit('sendTruth', this.state.truth);
    });
    event.preventDefault();
  }
  userSendMessage(event) {
    const message = `${this.props.userInfo.username}: ${event.target.sendMessage.value}`;
    if (this.state.messageHistory.length > 15) {
      const messages = this.state.messageHistory;
      messages.splice(0, 1);
      messages.push(message);
      this.setState({ messageHistory: messages }, () => {
        this.props.socket.emit('sendMessage', message);
      });
      event.preventDefault();
    } else {
      this.setState({ messageHistory: [...this.state.messageHistory, message] }, () => {
        this.props.socket.emit('sendMessage', message);
      });
      event.preventDefault();
    }
  }
  userSelectTruth(event) {
    axios.get('/truths').then(({ data }) => {
      this.setState({ truth: data });
    }).catch((error) => {
      console.log(error);
    });
    this.props.socket.emit('truth');
  }
  userSelectDare(event) {
    axios.get('/dares').then(({ data }) => {
      this.setState({ truth: data });
    }).catch((error) => {
      console.log(error);
    });
    this.props.socket.emit('dare');
  }
  userSendVideo(event) {
    axios.post('/video')
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
          <input type="submit" name="Send Truth" />
        </form>
        <WebcamCapture userSendVideo={this.userSendVideo} />
        <div>
          <button
            type="submit"
            name="truth"
            onClick={(e) => {
              this.userSelectTruth(e);
            }}
          >TRUTH
          </button>
          or
          <button
            type="submit"
            name="dare"
            onClick={(e) => {
              this.userSelectDare(e);
            }}
          >DARE
          </button>
          {this.state.truth ? this.state.truth : this.state.dare}
        </div>
      </div>
    );
  }
}

export { GameRoom };
