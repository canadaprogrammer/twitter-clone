import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';

import { db } from 'fbase';

const Home = ({ userObj }) => {
  console.log(userObj);
  const [ctwitt, setCtwitt] = useState('');
  const [ctwitts, setCtwitts] = useState([]);

  const getCtwitts = async () => {
    try {
      const ctwittsCol = collection(db, 'ctwitt');
      const ctwittSnapshot = await getDocs(ctwittsCol);
      const ctwittList = ctwittSnapshot.docs;
      // create objArray with id
      ctwittList.forEach((document) => {
        const ctwittObj = {
          ...document.data(),
          id: document.id,
        };
        setCtwitts((prev) => [ctwittObj, ...prev]);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCtwitts();
  }, []);
  const onSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'ctwitt'), {
        ctwitt,
        createdAt: Date.now(),
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
