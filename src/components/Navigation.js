import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ userObj }) => (
  <nav>
    <ul>
      <li>
        <Link className="btn" to='/'>Home</Link>
      </li>
      <li>
        <Link className="btn" to='/profile'>{userObj.displayName ?? 'Anonymous'}'s Profile</Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
