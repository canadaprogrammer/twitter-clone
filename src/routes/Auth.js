import React, { useState } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { auth } from 'fbase';
import AuthForm from 'components/AuthForm';

const Auth = () => {
  const [error, setError] = useState('');
  const onSocialClick = async (evt) => {
    const {
      target: { name },
    } = evt;
    let provider;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name='google'>
          Continue with Google
        </button>
        <button onClick={onSocialClick} name='github'>
          Continue with GitHub
        </button>
      </div>
      {error}
    </div>
  );
};
export default Auth;
