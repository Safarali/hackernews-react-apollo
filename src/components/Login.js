import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation} from 'react-apollo';
import { AUTH_TOKEN } from '../constants';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;


const Login = (props) => {

  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const confirm = async data => {
    console.log(data)
    const token = login ? data.login.token : data.signup.token;
    saveUserData(token);
    props.history.push('/');
  };

  const saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
    console.log(token);
    
  }

  

  return (
    <div>
      <h4 className="mv3">{login ? 'Login' : 'Sign up'}</h4>
      <div className="flex flex-column">
        {!login && (
          <input 
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input 
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          placeholder="Your email address"
        />
        <input 
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
        <div className="flex mt3">
          <Mutation 
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => confirm(data)}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={mutation}>
                {login ? 'Login' : 'Create account'}
              </div>
            )}
          </Mutation>
          <div
            className="pointer button"
            onClick={() => setLogin(!login)}
          >
            {login
              ? 'need to create an account?'
              : 'already have an account'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;