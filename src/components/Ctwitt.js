import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from 'fbase';

const Ctwitt = ({ ctwittObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(ctwittObj.text);
  const onClickDelete = async () => {
    const ok = window.confirm(`Are you sure to delete ${ctwittObj.text}?`);
    if (ok) {
      await deleteDoc(doc(db, 'ctwitt', ctwittObj.id));
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onChangeCtwitt = (evt) => {
    const {
      target: { value },
    } = evt;
    setText(value);
  };
  const onSubmit = async (evt) => {
    evt.preventDefault();
    await updateDoc(doc(db, 'ctwitt', ctwittObj.id), {
      text,
    });
    setEditing(false);
  };
  return (
    <li>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              value={text}
              onChange={onChangeCtwitt}
              required
            />
            <input type='submit' value='Update Ctwitt' />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          {text}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit</button>
              <button onClick={onClickDelete}>Delete</button>
            </>
          )}
        </>
      )}
    </li>
  );
};

export default Ctwitt;
