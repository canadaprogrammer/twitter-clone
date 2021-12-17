# Cloning Twitter with Firebase (Web v9)

## Installing Firebase

- `npm i firebase`

- Creating `fbase.js`

  - ```js
    import { initializeApp } from 'firebase/app';

    const firebaseConfig = {
      apiKey: 'AIza...',
      authDomain: '...',
      projectId: '...',
      storageBucket: '...',
      messagingSenderId: '...',
      appId: '...',
    };

    export default initializeApp(firebaseConfig);
    ```

- On `index.js`

  - `import './fbase';`

## Securing the Keys

- Make `.env` to root directory

  - Environmental variables need to start with `REACT_APP_`.

    - `REACT_APP_API_KEY=AIza...` // without `,` on the end of a line

- On `firebase.js`

  - `apiKey: process.env.REACT_APP_API_KEY,`

- Add `.env` to `.gitignore` to hide the Key on Github.

## Setting up Router

- Create `Router.js` on \src\components

  - ```jsx
    import React, { useState } from 'react';
    import { HashRouter as Router, Routes, Route } from 'react-router-dom';
    import Auth from '../routes/Auth';
    import Home from '../routes/Home';

    // eslint-disable-next-line import/no-anonymous-default-export
    const AppRouter = () => {
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      return (
        <Router>
          <Routes>
            {isLoggedIn ? (
              <Route path='/' element={<Home />}></Route>
            ) : (
              <Route path='/' element={<Auth />}></Route>
            )}
          </Routes>
        </Router>
      );
    };

    export default AppRouter;
    ```

- on `App.js`

  - ```jsx
    import React from 'react';
    import AppRouter from './Router';

    function App() {
      return <AppRouter />;
    }

    export default App;
    ```

## Set Absolute Imports

- You can configure your application to support importing modules using absolute paths. This can be done by configuring a `jsconfig.json` or `tsconfig.json` file in the root of your project.

  - on `jsconfig.json`

    - ```json
      {
        "compilerOptions": {
          "baseUrl": "src"
        },
        "include": ["src"]
      }
      ```

  - Change import path

## Setting Up Firebase Auth

- Setting up Firebase Authentication

  - Sign-up method

    - Email/Password - Enable

    - Google - Enable

    - GitHub - Enable

      - Client ID and Client secret from GitHub

- GitHub - Developer Settings - OAuth Apps - New OAuth App

  - Application Name: twitter-clone

  - Homepage URL: https://twitter-clone-4cec7.firebaseapp.com (From firebase)

  - Authorization calllback URL: https://twitter-clone-4cec7.firebaseapp.com/__/auth/handler (From firebase)

## Add Login Form

- On `Auth.js`

  - ```js
    import React, { useState } from 'react';

    const Auth = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
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
      const onSubmit = (evt) => {
        evt.preventDefault();
      };
      return (
        <div>
          <form onSubmit={onSubmit}>
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
            <input type='submit' value='Log In' />
          </form>
          <div>
            <button>Continue with Google</button>
            <button>Continue with GitHub</button>
          </div>
        </div>
      );
    };
    export default Auth;
    ```

## Creating a New Account with Email and Password

- On `Auth.js`

  - ```jsx
    import {
      getAuth,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
    } from 'firebase/auth';

    const Auth = () => {
      ...
      const [newAccount, setNewAccount] = useState(true);
      const [error, setError] = useState('');
      const auth = getAuth();
      ...
      const onSubmit = async (evt) => {
        evt.preventDefault();
        try {
          let data;
          if (newAccount) {
            data = await createUserWithEmailAndPassword(auth, email, password);
          } else {
            data = await signInWithEmailAndPassword(auth, email, password);
          }
        } catch (err) {
          setError(err.message);
        }
      };
      ...
      return (
        ...
        <input type='submit' value={newAccount ? 'Create Account' : 'Sign IN'} />
        {error}
    ```

## Log In with Email and Password

- On `App.js`

  - ```jsx
    import React, { useState, useEffect } from 'react';
    import AppRouter from 'components/Router';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';

    function App() {
      const auth = getAuth();
      const [init, setInit] = useState(false);
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
          setInit(true);
        });
      }, []);
      return (
        <>
          {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing...'}
          <footer>&copy; Cloning Twitter {new Date().getFullYear()}</footer>
        </>
      );
    }

    export default App;
    ```

- On `Auth.js`

  - ```jsx
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return (
      <span onClick={toggleAccount}>
        {newAccount ? 'Sign In' : 'Create Account'}
      </span>
    ```

## Log In with Social

- On `Auth.js`

  - ```jsx
    import {
      ...
      signInWithPopup,
      GoogleAuthProvider,
      GithubAuthProvider,
    } from 'firebase/auth';

    const Auth = () => {
      ...
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
          const data = await signInWithPopup(auth, provider);
          console.log(data);
        } catch (err) {
          console.log(err);
        }
      };
      return (
        ...
        <div>
          <button onClick={onSocialClick} name='google'>
            Continue with Google
          </button>
          <button onClick={onSocialClick} name='github'>
            Continue with GitHub
          </button>
        </div>
      );
    ```
