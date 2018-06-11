import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { Login } from './login.jsx';
import { HomePage } from './homepage.jsx';
import { SignUp } from './signup.jsx';
import { LoserPage } from './loserpage.jsx';
import { WinnerPage } from './winnerpage.jsx';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      public: false,
      private: false,
      userInfo: {},
      signUp: false,
    };
    this.login = this.login.bind(this);
    this.signUpButton = this.signUpButton.bind(this);
    this.signUpHandle = this.signUpHandle.bind(this);
  }
  signUpHandle(event) {
    const username = event.target.username.value;
    const password = event.target.password.value;
    axios.post('/users', {
      username,
      password,
    }).then((result) => {
      this.setState({ isLoggedIn: !this.state.isLoggedIn, signUp: !this.state.signUp }, () => {
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
    }).then(({ data }) => {
      this.setState({ isLoggedIn: !this.state.isLoggedIn, userInfo: data }, () => {
        console.log(this.state.userInfo);
        console.log(`${this.state.userInfo.username} has logged in!`);
      });
    }).catch((error) => {
      console.log(error);
    });
    event.preventDefault();
  }
  render() {
    const { isLoggedIn } = this.state;
    const { userInfo } = this.state;
    const { signUp } = this.state;
    if (!signUp) {
      return (
        <div>
          {isLoggedIn ? (
            <HomePage userInfo={userInfo} />
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