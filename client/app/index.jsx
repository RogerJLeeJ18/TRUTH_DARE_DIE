import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { Login } from './login.jsx';
import { HomePage } from './homepage.jsx';
import { SignUp } from './signup.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoggedIn: false,
      public: false,
      private: false,
      sessionLink: '',
      userInfo: {},
      signUp: false,
    };
    this.login = this.login.bind(this);
    this.signUpButton = this.signUpButton.bind(this);
  }
  signUpHandle(event) {
    const username = event.target.username.value;
    const password = event.target.password.value;
    axios.post('/users', {
      username,
      password,
    }).then((result) => {
      this.setState({ isLoggedIn: !this.state.isLoggedIn }, () => {
        console.log('login successful', result);
      });
    }).catch((error) => {
      console.log(error);
    });
    event.preventDefault();
  }
  signUpButton(event) {
    this.setState({
      signUp: !this.state.signUp,
    }, () => {
      console.log(this.state.signUp);
    });
  }
  login(event) {
    const username = event.target.username.value;
    const password = event.target.password.value;
    axios.get('/users', {
      params: {
        username,
        password,
      },
    }).then((result) => {
      this.setState({ isLoggedIn: !this.state.isLoggedIn }, () => {
        console.log('login successful', result);
      });
    }).catch((error) => {
      console.log(error);
    });
    event.preventDefault();
  }
  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const password = this.state.password;
    const username = this.state.username;
    const signUp = this.state.signUp;
    if (!signUp) {
      return (
        <div>
          {isLoggedIn ? (
            <HomePage />
          ) : (
              <Login login={this.login} signUpButton={this.signUpButton} />
            )}
        </div>
      );
    }
    return (
      <SignUp signUpButton={this.signUpButton} signUpHandle={this.signUpHandle} />
    );
  }
}

render(<App />, document.getElementById('app'));
