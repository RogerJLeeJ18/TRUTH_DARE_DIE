import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import _ from 'underscore';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loggedIn: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    this.setState({ [event.target.name]: event.target.value, loggedIn: true }, () => {
      axios.post('/users', {
        username: this.state.username,
        password: this.state.password,
      }).then((result) => {
        console.log(result, 'this is the result');
      }).catch((err) => {
        console.log(err, 'this is the err');
      });
      console.log(this.state);
    });
    event.preventDefault();
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1">
            <form>
              <label>Username:</label>
              <input type="text" name="username" onChange={this.handleSubmit} />
              <br />
              <label>Password:</label>
              <input type="password" name="password" onChange={this.handleSubmit} />
              <button type="submit" >Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
