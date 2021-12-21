import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from 'fbase';
import Ctwitt from 'components/Ctwitt';
import CtwittFactory from 'components/CtwittFactory';

const Home = ({ userObj }) => {
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
  
  return (
    <div>
      <CtwittFactory userObj={userObj} />
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
