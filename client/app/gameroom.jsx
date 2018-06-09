import React from 'react';
import axios from 'axios';
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
    this.userSelectDare = this.userSelectDare.bind(this);
    this.userSelectTruth = this.userSelectTruth.bind(this);
  }
  componentDidMount() {
    this.props.socket.on('sentMessage', (message) => {
      this.setState({ messageHistory: [...this.state.messageHistory, message] });
    });
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
  userSendVideo(video) {
    console.log(video.get('file'));
    axios.post('/video', video)
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
  }
  userSelectPass(e) {
    axios.post('/votes', { vote: 'pass' })
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
    e.preventDefault();
  }
  userSelectFail(e) {
    axios.post('/votes', { vote: 'fail' })
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
    e.preventDefault();
  }
  userStartGame(e) {
    axios.post('/room', {
      room: this.props.roomname
    })
    e.preventDefault();
  }
  render() {
    const { username } = this.props.userInfo;
    const messageList = this.state.messageHistory.map(message => <li key={message}>{message}</li>);
    return (
      <div>{username}
        {this.props.admin ? (
          <div>
          <button
            type="submit"
            name="start"
            onClick={(e) => {
              this.userStartGame(e);
              e.preventDefault();
            }}
          >START
        </button>
        </div>
        ) : (<div />)
        }
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
        <iframe
          src="https://tokbox.com/embed/embed/ot-embed.js?embedId=8c5d069b-b5fb-458e-81fe-b2a7dcd20555&room=DEFAULT_ROOM&iframe=true"
          width="800px"
          height="640px"
          allow="microphone; camera"
        />

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
          <button
            type="submit"
            name="pass"
            onClick={(e) => {
              this.userSelectPass(e);
            }}
          >PASS
          </button>
          or
          <button
            type="submit"
            name="fail"
            onClick={(e) => {
              this.userSelectFail(e);
            }}
          >FAIL
          </button>
          {this.state.truth ? this.state.truth : this.state.dare}
        </div>
      </div>
    );
  }
}

export { GameRoom };
