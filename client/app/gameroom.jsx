import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { LoserPage } from './loserpage.jsx';
import { WinnerPage } from './winnerpage.jsx';

const Title = styled.h1`
  font-family: Nosifer;
  font-size: 28px;
  color: black;
  margin-top: 4%
`;

const Chat = styled.h1`
  font-size: 26px;
  padding-left: 6%
  font-family: Gothic;
`;

const User = styled.li`
  color: white;
  font-size: 24px;
  list-style-type: none;
  float: left;
  display: block;
  text-align: center;
  padding: 14px 16px;
`;

const Deaths = styled.li`
  color: red;
  font-size: 24px;
  list-style-type: none;
  float: right;
  display: block;
  text-align: center;
  padding: 14px 16px;
  background-color: black;
`;

const Saves = styled.li`
  font-size: 24px;
  list-style-type: none;
  float: right;
  display: block;
  text-align: center;
  padding: 14px 16px;
  background-color: gold;
`;

const Wins = styled.li`
  font-size: 24px;
  list-style-type: none;
  float: right;
  display: block;
  text-align: center;
  padding: 14px 16px;
  background-color: white;
`;


const TopBar = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: gray;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
`;

const Section = styled.form`
  float: left;
  padding-left: 4px
`;

const Section2 = styled.form`
  float: right;
`;

const Message = styled.div`
  list-style-type: none;
  font-size: 22px;
  padding-left: 8px;
`;

const Input = styled.input`
    border:1px solid black;
    width: 200px;
    padding-left: 4px;
    padding-bottom: 8px;
    padding-top: 8px;
    padding-right: 2px;
    height: 50%
    font-size: 20px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    padding-left: 4px;
`;

const Button = styled.button`
  background-color: black;
  border: none;
  color: white;
  padding: 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  border-radius: 12px
`;

class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      messageHistory: [],
      truth: '',
      alive: true,
      currentUsersTurnDisplay: '',
      currentUsersTurn: false,
      hasVoted: false,
      afterTurnMessage: ''
    };
    // bind function to send messages and truth answer to component
    this.userSendMessage = this.userSendMessage.bind(this);
    this.userSelectDare = this.userSelectDare.bind(this);
    this.userSelectTruth = this.userSelectTruth.bind(this);
  }
  componentDidMount() {
    this.props.socket.on('sentMessage', (message) => {
      this.setState({ messageHistory: [...this.state.messageHistory, message] });
    });
    this.props.socket.on('this-user-turn', (message) => {
      this.setState({
        currentUsersTurnDisplay: message,
        currentUsersTurn: true
      }, () => {
        console.log(this.state);
      });
    });
    this.props.socket.on('user-turn', (message) => {
      this.setState({
        currentUsersTurnDisplay: message,
        currentUsersTurn: false
      });
    });
    this.props.socket.on('alive', (message) => {
      this.setState({ hasVoted: false, afterTurnMessage: message });
    });
    this.props.socket.on('failure', (message) => {
      this.setState({ alive: false });
      this.props.socket.emit('died', `${this.props.userInfo.username} has died!`);
    });
    this.props.socket.on('gameStart', (message) => {
      this.setState({ hasVoted: false, truth: message });
    });
    this.props.socket.on('death', (message) => {
      this.setState({ hasVoted: false, afterTurnMessage: message });
    });
    this.props.socket.on('finished', (message) => {
      this.setState({ hasVoted: false, winner: true });
    });
  }
  userSendMessage(event) {
    const message = `${this.props.userInfo.username}: ${event.target.sendMessage.value}`;
    if (this.state.messageHistory.length >= 15) {
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
  userSelectTruth(e) {
    axios.get('/truths').then(({ data }) => {
      this.setState({ truth: data });
    }).catch((error) => {
      console.log(error);
    });
    this.props.socket.emit('truth');
    e.preventDefault();
  }
  userSelectDare(e) {
    axios.get('/dares').then(({ data }) => {
      this.setState({ truth: data });
    }).catch((error) => {
      console.log(error);
    });
    this.props.socket.emit('dare');
    e.preventDefault();
  }
  userSelectPass(e) {
    this.setState({ hasVoted: true }, () => {
      axios.post('/votes', { vote: 'pass', username: this.props.userInfo.username })
        .then((result) => {
          console.log(result);
        }).catch((err) => {
          console.log(err);
        });
    });
    e.preventDefault();
  }
  userSelectFail(e) {
    this.setState({ hasVoted: true }, () => {
      axios.post('/votes', { vote: 'fail', username: this.props.userInfo.username })
        .then((result) => {
          console.log(result);
        }).catch((err) => {
          console.log(err);
        });
    });
    e.preventDefault();
  }
  userStartGame(e) {
    this.setState({ truth: '', hasVoted: false });
    axios.post('/room', {
      room: this.props.roomname
    });
    this.props.socket.emit('start');
    e.preventDefault();
  }
  render() {
    const { username } = this.props.userInfo;
    const messageList = this.state.messageHistory.map(message => <li key={message}>{message}</li>);
    const truthOrDare = (
      <div>
        <Button type="submit" name="truth" onClick={(e) => { this.userSelectTruth(e); }}>TRUTH</Button>
        <Button type="submit" name="dare" onClick={(e) => { this.userSelectDare(e); }}>DARE</Button>
      </div>);
    let passOrFail;
    if (this.state.hasVoted) {
      passOrFail = (<div>Your vote has been cast!</div>);
    } else {
      passOrFail = (
        <div>
          <Button type="submit" name="pass" onClick={(e) => { this.userSelectPass(e); }}>PASS</Button>
          <Button type="submit" name="fail" onClick={(e) => { this.userSelectFail(e); }}>FAIL</Button>
        </div>);
    }
    const aliveRoom = (
      <div>
        <TopBar className="userInfo">
          <User>Stay Alive {username}</User>
          {this.state.currentUsersTurnDisplay}
          {this.state.afterTurnMessage}
          <Deaths>Deaths: {this.props.userInfo.death_tokens}</Deaths>
          <Wins>Wins: {this.props.userInfo.win_tokens}</Wins>
        </TopBar>
        <Title>Welcome to {this.props.roomname}</Title>
        <Chat htmlFor="chatRoom">
          Chats
        </Chat>
        <Section onSubmit={(e) => {
          this.userSendMessage(e);
          e.preventDefault();
        }}
        >
          <Input type="text" name="sendMessage" />
          <Input type="submit" value="Send" />
          <Message className="chatroom">{messageList}</Message>
        </Section>
        <Section2>
          <div>
            {this.props.admin ? (
              <Button
                type="submit"
                name="start"
                onClick={(e) => {
                    this.userStartGame(e);
                    e.preventDefault();
                  }}
              >START
              </Button>
            ) : (<div />)
            }
            {this.state.currentUsersTurn ? (truthOrDare) : (passOrFail)}
            {this.state.truth ? this.state.truth : this.state.dare}
          </div>
          <div>
            <Button 
              type="submit"
            
              onClick={(e) => {
                console.log(e, " is e in tweet");
                e.preventDefault();
              }}
            >I TWEETED
              </Button>
          </div>
          <iframe title="webChat" src="https://tokbox.com/embed/embed/ot-embed.js?embedId=91f9a6c8-1c02-486f-bb04-c24e6d922ebb&room=killroom1&iframe=true" width="800" height="640" allow="microphone; camera" />
        </Section2>
      </div>);
    return (
      <div>
        {/* need to see if this works */}
        {this.state.winner ? (<WinnerPage />) : (this.state.alive ? (aliveRoom) : (<LoserPage />))}
      </div>
    );
  }
}

export { GameRoom };
