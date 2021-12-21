import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';

// eslint-disable-next-line import/no-anonymous-default-export
const AppRouter = ({ refreshUserName, isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <Route path='/'>
            <Route index element={<Home userObj={userObj} />} />
            <Route
              path='profile'
              element={
                <Profile userObj={userObj} refreshUserName={refreshUserName} />
              }
            />
          </Route>
        ) : (
          <Route path='/' element={<Auth />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
