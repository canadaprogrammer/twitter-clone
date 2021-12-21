import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from 'fbase';

const CtwittFactory = ({userObj}) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState('');
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
    const inputFile = document.querySelector('input[type="file"]');
    inputFile.value = '';
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
  );
};

export default CtwittFactory;