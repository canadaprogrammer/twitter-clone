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
