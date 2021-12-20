import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from 'fbase';
import Ctwitt from 'components/Ctwitt';

const Home = ({ userObj }) => {
  const [text, setText] = useState('');
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
      await addDoc(collection(db, 'ctwitt'), {
        text,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      setText('');
    } catch (error) {
      console.log(error);
    }
  };
  const onChange = (evt) => {
    const {
      target: { value },
    } = evt;
    setText(value);
  };
  return (
    <div>
      <form>
        <input
          value={text}
          onChange={onChange}
          type='text'
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type='submit' value='Cloning Twitter' onClick={onSubmit} />
      </form>
      <ul>
        {ctwitts.map((ct) => (
          <Ctwitt
            key={ct.id}
            ctwittObj={ct}
            isOwner={ct.creatorId === userObj.uid}
          />
        ))}
      </ul>
    </div>
  );
};

export default Home;
