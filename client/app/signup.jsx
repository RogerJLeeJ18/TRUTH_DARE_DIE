import React from 'react';

function SignUp(props) {
  const element = (
    <div className="container">
      <div className="row">
        <div className="col-xs-10 col-xs-offset-1">
          <form onSubmit={(e) => {
            e.preventDefault();
            props.signUpHandle(e);
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
            <label htmlFor="toLoginPage">Already have an account? login here:
              <button onClick={(e) => {
                props.signUpButton(e);
              }}
              >Login
              </button>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
  return element;
}

export { SignUp };
