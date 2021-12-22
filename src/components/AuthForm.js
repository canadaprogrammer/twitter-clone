import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'fbase';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const [signInActive, setSignInActive] = useState(false);
  const onChange = (evt) => {
    const {
      target: { name, value },
    } = evt;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (evt) => {
    evt.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };
  // const toggleAccount = () => setNewAccount((prev) => !prev);
  const onClickSwitch = (evt) => {
    const {target: {name}} = evt;
    if(name === 'signIn') {
      setNewAccount(false);
      setSignInActive(true);
    }
    if(name === 'signUp') {
      setNewAccount(true);
      setSignInActive(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="authForm">
        <input
          name='email'
          type='text'
          placeholder='Email'
          required
          value={email}
          onChange={onChange}
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          required
          value={password}
          onChange={onChange}
        />
        <input
          type='submit'
          value={newAccount ? 'Create Account' : 'Sign In'} className="btn btnBlue authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      {/* <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? 'Sign In' : 'Create Account'}
      </span> */}
      <div className="authSwitch">
        <button onClick={onClickSwitch} name="signIn" className={signInActive ? 'activeSwitch' : ''}>Sign In</button>
        <button onClick={onClickSwitch} name="signUp" className={!signInActive ? 'activeSwitch' : ''}>Sign Up</button>
      </div>
    </>
  )
}

export default AuthForm;