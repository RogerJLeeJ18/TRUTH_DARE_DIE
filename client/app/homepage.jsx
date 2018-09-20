import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { GameRoom } from './gameroom.jsx';
import { Dropdown } from './dropdown.jsx';

const Title = styled.h1`
  font-family: Nosifer;
  font-size: 50px;
  color: black;
  margin-top: 5%
  padding-left: 28%;
`;

const Form = styled.form`
  margin-left: 6%;
  width: 400px;
  padding-left: 5%;
  padding-right: 5%
  padding-bottom: 3%;
  padding-top: 2%
  float: left;
`;

const CreateForm = styled.form`
  margin-left: 6%;
  width: 400px;
  padding-left: 5%;
  padding-right: 5%
  padding-bottom: 3%;
  padding-top: 2%
  border-right: 1px solid black;
  float: left;
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

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      roomCreated: false,
      admin: false,
    };
    this.socketHandle = this.makeRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
  }

  makeRoom(event) {
    const roomName = event.target.socket.value;
    axios.post('/start', {
      room: roomName,
      username: this.props.userInfo.username
    }).then((result) => {
      this.setState(
        { roomName, roomCreated: !this.state.roomCreated, admin: !this.state.admin },
        () => {
          console.log(`${this.state.roomName} has been created`, result);
        }
      );
    }).catch((error) => {
      console.log(error);
    });
    event.preventDefault();
    this.props.socket.emit('create', roomName);
    console.log(roomName, 'this worked');
  }

  joinRoom(event) {
    const roomName = event.target.join.value;
    axios.get(`/rooms/${roomName}`).then(({ data }) => {
      if (data.admin === this.props.userInfo.username) {
        this.setState({
          roomName,
          roomCreated: !this.state.roomCreated,
          admin: !this.state.admin
        }, () => {
          console.log(this.state.admin);
          console.log(`you have joined ${this.state.roomName}`, data);
        });
      } else {
        this.setState({ roomName, roomCreated: !this.state.roomCreated }, () => {
          console.log(`you have joined ${this.state.roomName}`, data);
        });
      }
    }).catch((error) => {
      console.log(error, 'unable to join');
    });
    event.preventDefault();
    this.props.socket.emit('join', roomName);
    this.props.socket.emit('send-username', this.props.userInfo.username);
  }
  render() {
    const element = (
      <div className="container">
        <TopBar className="userInfo">
          <User>Hello, {this.props.userInfo.username}</User>
          <Deaths>Deaths: {this.props.userInfo.death_tokens}</Deaths>
          <Wins>Wins: {this.props.userInfo.win_tokens}</Wins>
        </TopBar>
        <Title>Truth Dare Or Die</Title>
        <CreateForm onSubmit={(e) => {
          e.preventDefault();
          this.makeRoom(e);
        }}
        >
          <Div>
            <Div>
              <Label>Make A Room</Label>
            </Div>
          </Div>
          <Div className="socketMakeRoom">
            <Div>
              <Input type="text" placeholder="Make a room here" name="socket" />
              <Button>Create</Button>
            </Div>
          </Div>
        </CreateForm>
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
    const gameRoom = (
      <GameRoom
        roomname={this.state.roomName}
        socket={this.props.socket}
        admin={this.state.admin}
        userInfo={this.props.userInfo}
      />);
    const { roomCreated } = this.state;
    return (
      <div>
        {roomCreated ? (gameRoom) : (element)}
      </div>);
  }
}

export { HomePage };
