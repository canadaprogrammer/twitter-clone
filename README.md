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

- On `fbase.js`

  - ```js
    import { getAuth } from 'firebase/auth';

    export const auth = getAuth();
    ```

- On `Auth.js`

  - ```jsx
    import {
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
    } from 'firebase/auth';
    import { auth } from 'fbase';

    const Auth = () => {
      ...
      const [newAccount, setNewAccount] = useState(true);
      const [error, setError] = useState('');
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
    import { onAuthStateChanged } from 'firebase/auth';
    import { auth } from 'fbase';

    function App() {
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

## Log Out

- Create `Navigation.js`

  - ```jsx
    import React from 'react';
    import { Link } from 'react-router-dom';

    const Navigation = () => (
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/profile'>My Profile</Link>
          </li>
        </ul>
      </nav>
    );

    export default Navigation;
    ```

- On `Router.js`

  - ```jsx
    const AppRouter = ({ isLoggedIn }) => {
      return (
        <Router>
          {isLoggedIn && <Navigation />}
          <Routes>
            {isLoggedIn ? (
              <Route path='/'>
                <Route index element={<Home />} />
                <Route path='profile' element={<Profile />} />
              </Route>
            ) : (
              <Route path='/' element={<Auth />} />
            )}
          </Routes>
        </Router>
      );
    };
    ```

- On `Profile.js`

  - ```jsx
    import { useNavigate } from 'react-router-dom';
    import { signOut } from 'firebase/auth';
    import { auth } from 'fbase';

    const Profile = () => {
      const navigate = useNavigate();
      const onLogOutClick = async () => {
        try {
          await signOut(auth);
          navigate('/');
        } catch (err) {
          console.log(err);
        }
      };
      return <button onClick={onLogOutClick}>Log Out</button>;
    };
    ```

## Set up DB (firestore) and Add Document

- Create Firestore Database on Firebase

- On `fbase.js`

  - ```js
    import { getAuth } from 'firebase/auth';
    import { getFirestore } from 'firebase/firestore';

    const app = initializeApp(firebaseConfig);

    export const auth = getAuth();
    export const db = getFirestore(app);
    ```

- On `Home.js`

  - ```jsx
    import { collection, addDoc } from 'firebase/firestore';
    import { auth, db } from 'fbase';

    const Home = () => {
      const [ctwitt, setCtwitt] = useState('');
      const onSubmit = async (evt) => {
        evt.preventDefault();
        try {
          const docRef = await addDoc(collection(db, 'ctwitt'), {
            ctwitt,
            createdAt: Date.now(),
          });
          setCtwitt('');
        } catch (error) {
          console.log(error);
        }
      };
      const onChange = (evt) => {
        const {
          target: { value },
        } = evt;
        setCtwitt(value);
      };
      return (
        <div>
          <form>
            <input
              value={ctwitt}
              onChange={onChange}
              type='text'
              placeholder="What's on your mind?"
              maxLength={120}
            />
            <input type='submit' value='Cloning Twitter' onClick={onSubmit} />
          </form>
        </div>
      );
    };
    ```

## Get the Collection

- Show the collection on `Home.js`

  - ```jsx
    const Home = () => {
      const [ctwitts, setCtwitts] = useState([]);
      const getCtwitts = async () => {
        try {
          const ctwittsCol = collection(db, 'ctwitt');
          const ctwittSnapshot = await getDocs(ctwittsCol);
          const ctwittList = ctwittSnapshot.docs;
          // create objArray with id
          ctwittList.forEach((document) => {
            const ctwittObj = {
              ...document.data(),
              id: document.id,
            };
            setCtwitts((prev) => [ctwittObj, ...prev]);
          });
        } catch (error) {
          console.log(error);
        }
      };
      useEffect(() => {
        getCtwitts();
      }, []);
      return (
          {ctwitts.length > 0 ? (
            <ul>
              {ctwitts.map((ct) => (
                <li key={ct.id}>{ct.ctwitt}</li>
              ))}
            </ul>
          ) : null}
      );
    };
    ```

## Save User ID to database for edit

- On `App.js`

  - ```jsx
    function App() {
      ...
      const [userObj, setUserObj] = useState(null);
      useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            ...
            setUserObj(user);
          } else {
          ...
        });
      }, []);
      return (
        <>
          {init ? (
            <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
          ) : (
            'Initializing...'
          )}
    ```

- On `Router.js`

  - ```jsx
    const AppRouter = ({ isLoggedIn, userObj }) => {
    return (
      ...
              <Route index element={<Home userObj={userObj} />} />
    ```

- On `Home.js`

  - ```jsx
    const Home = ({ userObj }) => {
      ...
    const getCtwitts = async () => {
      ...
          const ctwittObj = {
            ...document.data(),
            id: document.id,
            creatorId: userObj.uid,
    ```

## Database Realtime Updates

- On `Home.js`

  - ```jsx
    import {
      collection,
      addDoc,
      onSnapshot,
      query,
      orderBy,
    } from 'firebase/firestore';

    const Home = ({ userObj }) => {
      ...

      useEffect(() => {
        const q = query(collection(db, 'ctwitt'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
          const ctwittObj = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCtwitts(ctwittObj);
        });
      }, []);
      ...
    ```

- Note: How is the data updated real-time even though using `useEffect(() => {},[]);`?

  - It's subscribed only once, but Firebase updates the data in real-time after subscribing.
