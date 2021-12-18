import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const Home = () => {
  const db = getFirestore();
  const [ctwitt, setCtwitt] = useState('');
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
    </div>
  );
};

export default Home;
