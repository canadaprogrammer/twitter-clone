# Cloning Twitter with Firebase

## Installing Firebase

- `npm i firebase`

- Creating `fbase.js`

  - ```js
    import * as firebase from 'firebase/app';

    const firebaseConfig = {
      apiKey: 'AIza...',
      authDomain: '...',
      projectId: '...',
      storageBucket: '...',
      messagingSenderId: '...',
      appId: '...',
    };

    export default firebase.initializeApp(firebaseConfig);
    ```

- On `index.js`

  - `import firebase from './fbase';`

## Securing the Keys

- Make `.env` to root directory

  - Environmental variables need to start with `REACT_APP_`.

    - `REACT_APP_API_KEY=AIza...,`

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

## Using Firebase Auth

- On `fbase.js`

  - ```js
    import { getAuth } from 'firebase/auth';

    export const authService = getAuth();
    ```

- On `App.js`

  - ```js
    import { authService } from 'fbase';

    function App() {
      const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
    ```

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
