import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: '',
      userInfo: {},
      messageHistory: [],
    };
  }
  userSendMessage(event) {
    
    event.preventDefault();
  }
  render() {
    return (
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
    );
  }
}

export { GameRoom };
