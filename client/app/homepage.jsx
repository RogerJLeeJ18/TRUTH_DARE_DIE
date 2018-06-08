import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { GameRoom } from './gameroom.jsx';
import styled from 'styled-components';

const Title = styled.h1`
  font-family: Nosifer;
  font-size: 50px;
  color: black;
  margin-top: 5%
`;

const Form = styled.form`
  margin-left: 30%;
  width: 400px;
  padding-left: 5%;
  padding-right: 5%
  padding-bottom: 3%;
  padding-top: 2%
  border: 1px solid black;
  border-radius: 15px;
  background-color: gray;
`;

const Label = styled.label`
    display: inline-block;
    width: 500px;
    font-size: 30px;
    font-family: Nosifer;
    color: black;
`;

const Input = styled.input`
    padding:5px 15px; 
    border:1px solid black;
    width: 200px;
    padding-bottom: 8px;
    padding-top: 8px;
    padding-right: 4px;
    height: 50%
    font-size: 20px;
    -webkit-border-radius: 5px;
    border-radius: 5px; 
`;

const Div = styled.div`
  margin-top: 1em;
  margin-bottom: 1em;
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

const Choice = styled.label`
  font-size: 20px;
`;

const User = styled.li`
  color: white;
  font-size: 22px;
  list-style-type: none;
  float: left;
  display: block;
  text-align: center;
  padding: 14px 16px;
`;

const Deaths = styled.li`
  color: red;
  font-size: 22px;
  list-style-type: none;
  float: right;
  display: block;
  text-align: center;
  padding: 14px 16px;
  background-color: black;
`;

const Saves = styled.li`
  font-size: 22px;
  list-style-type: none;
  float: right;
  display: block;
  text-align: center;
  padding: 14px 16px;
  background-color: gold;
`;

const Wins = styled.li`
  font-size: 22px;
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

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      roomCreated: false,
      socket: io.connect('http://127.0.0.1:3000', { reconnection: false }),
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
    this.state.socket.emit('create', roomName);
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
    this.state.socket.emit('join', roomName);
  }
  render() {
    const element = (
      <div className="container">
        <TopBar className="userInfo">
          <User>Hello, {this.props.userInfo.username}</User>
          <Saves>Saves: {this.props.userInfo.save_tokens}</Saves>
          <Deaths>Deaths: {this.props.userInfo.death_tokens}</Deaths>
          <Wins>Wins: {this.props.userInfo.win_tokens}</Wins>
        </TopBar>
        <Title>Truth Dare Or Die</Title>
        <Form onSubmit={(e) => {
          e.preventDefault();
          this.makeRoom(e);
        }}
        >
          <Div>
            <Div>
              <Label>Make A Room</Label>
            </Div>
            <Choice htmlFor="public">Public
              <input type="checkbox" />
            </Choice>
            <br />
            <Choice htmlFor="private">Private
              <input type="checkbox" />
            </Choice>
          </Div>
          <Div className="socketMakeRoom">
            <Div>
              <Input type="text" placeholder="Make a room here" name="socket" />
              <Button>Create
              </Button>
            </Div>
          </Div>
        </Form>
        <Div>
          <Form onSubmit={(e) => {
          e.preventDefault();
          this.joinRoom(e);
          }}
          >
            <Div className="socketJoinRoom">
              <Div>
                <Label>Join A Room</Label>
              </Div>
              <Div>
                <Input type="text" placeholder="Join a room here" name="join" />
                <Button>Join
                </Button>
              </Div>
            </Div>
          </Form>
        </Div>
      </div>
    );
    const gameRoom = (<GameRoom roomname={this.state.roomName} socket={this.state.socket} userInfo={this.props.userInfo} />);
    const { roomCreated } = this.state;
    return (
      <div>
        {roomCreated ? (gameRoom) : (element)}
      </div>);
  }
}

export { HomePage };
