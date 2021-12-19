import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

import { db } from 'fbase';

const Home = ({ userObj }) => {
  const [ctwitt, setCtwitt] = useState('');
  const [ctwitts, setCtwitts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'ctwitt'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      const ctwittObj = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCtwitts(ctwittObj);
    });
  }, []);
  const onSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'ctwitt'), {
        ctwitt,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      setCtwitt('');
      console.log(docRef);
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
      {ctwitts.length > 0 ? (
        <ul>
          {ctwitts.map((ct) => (
            <li key={ct.id}>{ct.ctwitt}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Home;
