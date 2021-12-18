import React from 'react';
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

export default Profile;
