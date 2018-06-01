import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  onSignIn(event) {
    console.log(event);
    this.setState({
      username: event.target.value,
    });
  }
  handleSubmit(event) {
    alert(`This worked with ${this.state.username}`);
    event.preventDefault();
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1" />
          <form onSubmit={this.handleSubmit}>
            <label>
          <input type="text" value={this.state.value} onChange={this.onSignIn} id="Signin"></input>
            </label>
          <input type="submit" value="Submit" name="Login"></input>
          </form>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
