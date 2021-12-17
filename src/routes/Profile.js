import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const Profile = () => {
  const auth = getAuth();
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
