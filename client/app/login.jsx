import React from 'react';
import styled from 'styled-components';


const Form = styled.form`
  margin-left: 30%
  width: 400px;
  padding-left: 5%;
  padding-right: 5%
  padding-bottom: 3%;
  padding-top: 3%
  border: 1px solid black;
  border-radius: 15px;
`;

const Label = styled.label`
    display: inline-block;
    width: 90px;
    font-size: 50px;
`;

const Div = styled.div`
  margin-top: 1em;
`;

const Button = styled.button`
  background-color: black;
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  border-radius: 12px
`;

const Title = styled.h1`
  font-family: Nosifer;
  font-size: 50px;
  padding-left: 24%;
  color: black;
`;

const Input = styled.input`
    padding:5px 15px; 
    border:1px solid black;
    cursor:pointer;
    width: 200px;
    -webkit-border-radius: 5px;
    border-radius: 5px; 
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
                <Input type="text" name="username" />
              </Label>
            </Div>
            <Div>
              <Label htmlFor="password">Password:
                <Input type="password" name="password" />
              </Label>
            </Div>
            <Div>
              <Button type="submit" >Submit</Button>
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
