import React, { useState } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { auth } from 'fbase';
import AuthForm from 'components/AuthForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';

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
    <>
      <FontAwesomeIcon icon={faTwitter} className="twitterIcon" size="3x" />
      <AuthForm />
      <div className="authSocialContainer">
        <button onClick={onSocialClick} name='google' className="btn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name='github' className="btn">
          Continue with GitHub <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
      {error && <span className="authError">{error}</span>}
    </>
  );
};
export default Auth;
