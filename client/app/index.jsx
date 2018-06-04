import React from 'react';
import { render } from 'react-dom';

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
      console.log(this.state);
    });
    event.preventDefault();
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1">
            <form onSubmit={this.handleSubmit}>Username:
              <input type="text" name="username" onChange={this.handleSubmit} />
              <br />Password:
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
