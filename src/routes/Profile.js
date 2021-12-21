import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from 'fbase';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';

const Profile = ({ userObj, refreshUserName }) => {
  const [newName, setNewName] = useState(userObj.displayName ?? 'Anonymous');
  const navigate = useNavigate();
  const onLogOutClick = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const getMyCtwitts = async () => {
      const q = query(
        collection(db, 'ctwitt'),
        where('creatorId', '==', userObj.uid),
        orderBy('createdAt', 'desc')
      );
      const ctwitts = await getDocs(q);
      console.log(ctwitts.docs.map((doc) => doc.data()));
    };
    getMyCtwitts();
  }, [userObj.uid]);
  const onChange = (evt) => {
    const {
      target: { value },
    } = evt;
    setNewName(value);
  };
  const onSubmit = async (evt) => {
    evt.preventDefault();
    if (userObj.displayName !== newName) {
      // await updateProfile(userObj, { displayName: newName });
      await updateProfile(userObj, { displayName: newName });
    }
    refreshUserName();
  };
  return (
    <>
      <form>
        <input
          type='text'
          placeholder='display name'
          onChange={onChange}
          value={newName}
        />
        <input type='submit' onClick={onSubmit} />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
