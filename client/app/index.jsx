import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    this.setState({ [event.target.name]: event.target.value }, () => {
      axios.get('/users', {
        params: {
          username: this.state.username,
          password: this.state.password,
        },
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
              <label htmlFor="username">Username:
                <input type="text" name="username" placeholder="Username" onChange={this.handleSubmit} />
              </label>
              <br />
              <label htmlFor="password">Password:
                <input type="password" name="password" placeholder="Password" onChange={this.handleSubmit} />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
