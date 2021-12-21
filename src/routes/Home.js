import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from 'fbase';
import Ctwitt from 'components/Ctwitt';

const Home = ({ userObj }) => {
  const [text, setText] = useState('');
  const [ctwitts, setCtwitts] = useState([]);
  const [attachment, setAttachment] = useState('');
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
    let attachmentURL = '';
    if (attachment !== '') {
      const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        'data_url'
      );
      attachmentURL = await getDownloadURL(response.ref);
    }
    await addDoc(collection(db, 'ctwitt'), {
      text,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentURL,
    });
    setText('');
    setAttachment('');
  };
  const onChange = (evt) => {
    const {
      target: { value },
    } = evt;
    setText(value);
  };
  const onChangeFile = (evt) => {
    const {
      target: { files },
    } = evt;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClickClearAttachment = (evt) => {
    evt.preventDefault();
    setAttachment('');
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
        <input type='file' accept='image/*' onChange={onChangeFile} />
        <input type='submit' value='Cloning Twitter' onClick={onSubmit} />
        {attachment && (
          <div>
            <img src={attachment} alt='attached' width='100px' height='50px' />
            <button onClick={onClickClearAttachment}>Clear</button>
          </div>
        )}
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
