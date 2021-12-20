# Clone Twitter with Firebase (Web v9)

## Install Firebase

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

## Secure the Keys

- Make `.env` to root directory

  - Environmental variables need to start with `REACT_APP_`.

    - `REACT_APP_API_KEY=AIza...` // without `,` on the end of a line

- On `firebase.js`

  - `apiKey: process.env.REACT_APP_API_KEY,`

- Add `.env` to `.gitignore` to hide the Key on Github.

## Set up Router

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

## Set Up Firebase Auth

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

## Create a New Account with Email and Password

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
      // const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [userObj, setUserObj] = useState(null);
      useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // setIsLoggedIn(true);
            setUserObj(user);
            // } else {
            // setIsLoggedIn(false);
          }
          setInit(true);
        });
      }, []);
      return (
        <>
          {init ? (
            // <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
            <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
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

### Get Collection

- On `Home.js`

  - ```js
    import {
      ...
      onSnapshot,
      query,
      orderBy,
    } from 'firebase/firestore';

    const Home = ({ userObj }) => {
      ...
      // const getCtwitts = async () => {
      //   try {
      //     const ctwittsCol = collection(db, 'ctwitt');
      //     const ctwittSnapshot = await getDocs(ctwittsCol);
      //     const ctwittList = ctwittSnapshot.docs;
      //     ctwittList.forEach((document) => {
      //       const ctwittObj = {
      //         ...document.data(),
      //         id: document.id,
      //        creatorId: userObj.uid,
      //       };
      //       setCtwitts((prev) => [ctwittObj, ...prev]);
      //     });
      //   } catch (error) {
      //     console.log(error);
      //   }
      // };
      useEffect(() => {
        // getCtwitts();
        const q = query(collection(db, 'ctwitt'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
          const ctwittObj = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            creatorId: userObj.uid,
          }));
          setCtwitts(ctwittObj);
        });
      }, []);
      ...
    ```

- Note: How is the data updated real-time even though using `useEffect(() => {},[]);`?

  - It's subscribed only once, but Firebase updates the data in real-time after subscribing.

### Delete and Update Data

- On `Home.js`

  - ```jsx
    import Ctwitt from 'components/Ctwitt';

      return (
        ...
        <ul>
          {ctwitts.map((ct) => (
            <Ctwitt
              key={ct.id}
              ctwittObj={ct}
              isOwner={ct.creatorId === userObj.uid}
            />
          ))}
        </ul>
        ...
      );
    ```

- Create `/components/Ctwitt.js`

  - ```jsx
    import React, { useState } from 'react';
    import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
    import { db } from 'fbase';

    const Ctwitt = ({ ctwittObj, isOwner }) => {
      const [editing, setEditing] = useState(false);
      const [text, setText] = useState(ctwittObj.text);
      const onClickDelete = async () => {
        const ok = window.confirm(`Are you sure to delete ${ctwittObj.text}?`);
        if (ok) {
          await deleteDoc(doc(db, 'ctwitt', ctwittObj.id));
        }
      };
      const toggleEditing = () => setEditing((prev) => !prev);
      const onChangeCtwitt = (evt) => {
        const {
          target: { value },
        } = evt;
        setText(value);
      };
      const onSubmit = async (evt) => {
        evt.preventDefault();
        await updateDoc(doc(db, 'ctwitt', ctwittObj.id), {
          text,
        });
        setEditing(false);
      };
      return (
        <li>
          {editing ? (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type='text'
                  value={text}
                  onChange={onChangeCtwitt}
                  required
                />
                <input type='submit' value='Update Ctwitt' />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          ) : (
            <>
              {text}
              {isOwner && (
                <>
                  <button onClick={toggleEditing}>Edit</button>
                  <button onClick={onClickDelete}>Delete</button>
                </>
              )}
            </>
          )}
        </li>
      );
    };

    export default Ctwitt;
    ```

## Preview Image

- `FileReader`

  - The `FileReader` object lets web applications synchronously read the contents of files (or raw data buffers) stored on the user's computer, using `File` or `Blob` objects to specify the file or data to read.

- On `Home.js`

  - ```jsx
    const onChangeFile = (evt) => {
      const {
        target: { files },
      } = evt;
      const theFile = files[0];
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        setAttachment(result);
      };
      reader.readAsDataURL(theFile);
    };
    const onClickClearAttachment = (evt) => {
      evt.preventDefault();
      setAttachment(null);
    };
    return (
      <div>
        <form>
          ...
          <input type='file' accept='image/*' onChange={onChangeFile} />
          <input type='submit' value='Cloning Twitter' onClick={onSubmit} />
          {attachment && (
            <div>
              <img
                src={attachment}
                alt='attached file'
                width='100px'
                height='50px'
              />
              <button onClick={onClickClearAttachment}>Clear</button>
            </div>
          )}
        </form>
        ...
      </div>
    );
    ```

## Upload image

- To create a random Universally Unique Identifier(UUID), `npm i uuid`

- On `fbase.js`

  - ```js
    import { getStorage } from 'firebase/storage';

    export const storage = getStorage(app);
    ```

- On `Home.js`

  - ```js
    import { v4 as uuidv4 } from 'uuid';
    import { ref, uploadString } from 'firebase/storage';
    import { db, storage } from 'fbase';

    const onSubmit = async (evt) => {
      evt.preventDefault();
      const fileRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, 'data_url');
      ...
    ```
