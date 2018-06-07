import React from 'react';

function Login(props) {
  const element = (
    <div className="container">
      <div className="row">
        <div className="col-xs-10 col-xs-offset-1">
          <form onSubmit={(e) => {
            e.preventDefault();
            props.login(e);
          }}
          >
            <label htmlFor="username">Username:
              <input type="text" name="username" placeholder="username" />
            </label>
            <br />
            <label htmlFor="password">Password:
              <input type="password" name="password" placeholder="password" />
            </label>
            <br />
            <button type="submit" >Submit</button>
            <br />
            <label htmlFor="toSignUpPage">Don't have an account? Sign up here:
              <button onClick={(e) => {
              e.preventDefault();
              props.signUpButton(e);
            }}
              >
            Sign up
              </button>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
  return element;
}

export { Login };
