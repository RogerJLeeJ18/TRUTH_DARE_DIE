import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    console.log(`A name was submitted: ${this.input.value}`);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="chatRoom">
          ChatRoom:
          <input type="text" ref={(input) => { this.input = input; }} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

render(<ChatRoom />, document.getElementById('chatroom'));
