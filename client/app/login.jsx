import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-family: Nosifer;
  font-size: 50px;
  padding-left: 26%;
  color: black;
`;

const Form = styled.form`
  margin-left: 30%;
  width: 400px;
  padding-left: 5%;
  padding-right: 5%
  padding-bottom: 3%;
  padding-top: 2%
  border: 1px solid black;
  border-radius: 15px;
  background-color: gray;
  `;

const Input = styled.input`
    padding:5px 15px; 
    border:1px solid black;
    width: 200px;
    padding-bottom: 8px;
    padding-top: 8px;
    height: 50%
    font-size: 20px;
    -webkit-border-radius: 5px;
    border-radius: 5px; 
`;

const Label = styled.label`
    display: inline-block;
    width: 90px;
    font-size: 30px;
    font-family: Nosifer;
`;

const Div = styled.div`
  margin-top: 1em;
`;

const Button = styled.button`
  background-color: black;
  border: none;
  color: white;
  padding: 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  border-radius: 12px
`;

function Login(props) {
  const element = (
    <div className="container">
      <Title>Truth Dare or Die</Title>
      <div className="row">
        <div className="col-xs-10 col-xs-offset-1">
          <Form
            onSubmit={(e) => {
            e.preventDefault();
            props.login(e);
          }}
            classame="form"
          >
            <Div>
              <Label htmlFor="username">Username:
                <Input type="text" name="username" placeholder="username" />
              </Label>
            </Div>
            <Div>
              <Label htmlFor="password">Password:
                <Input type="password" name="password" placeholder="password" />
              </Label>
            </Div>
            <Div>
              <Button type="submit" >Login</Button>
            </Div>
            <Div>
              <label htmlFor="toSignUpPage">Don't have an account? Sign up here:
                <Button onClick={(e) => {
              e.preventDefault();
              props.signUpButton(e);
            }}
                >
            Sign up
                </Button>
              </label>
            </Div>
          </Form>
        </div>
      </div>
    </div>
  );
  return element;
}

export { Login };
