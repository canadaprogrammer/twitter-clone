import React, { useState, useEffect } from 'react';
import AppRouter from 'components/Router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  // const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUserName = () => {
    // const user = auth.currentUser;
    // setNewUserName(user.displayName);
    setUserObj({ ...auth.currentUser });
  };
  return (
    <div className='container'>
      {init ? (
        <AppRouter
          refreshUserName={refreshUserName}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        'Initializing...'
      )}
      {/* <footer>&copy; Cloning Twitter {new Date().getFullYear()}</footer> */}
    </div>
  );
}

export default App;
