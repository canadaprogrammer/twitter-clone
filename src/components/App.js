import React, { useState } from 'react';
import AppRouter from 'components/Router';
import { getAuth } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(getAuth().currentUser);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; Cloning Twitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
