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
