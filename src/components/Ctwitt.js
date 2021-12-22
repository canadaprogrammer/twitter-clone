import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from 'fbase';
import {
  faTrash,
  faTimes,
  faUpload,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Ctwitt = ({ ctwittObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(ctwittObj.text);
  const onClickDelete = async () => {
    const ok = window.confirm(`Are you sure to delete ${ctwittObj.text}?`);
    if (ok) {
      await deleteDoc(doc(db, 'ctwitt', ctwittObj.id));
      if (ctwittObj.attachmentURL !== '') {
        const attachmentRef = ref(storage, ctwittObj.attachmentURL);
        await deleteObject(attachmentRef);
      }
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
    <li className='ctwittList'>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className='ctwittListForm'>
            <div className='ctwitt'>
              {ctwittObj.attachmentURL ? (
                <>
                  <img
                    src={ctwittObj.attachmentURL}
                    width='100px'
                    height='50px'
                    alt='attached'
                    className='attachedImage'
                  />
                  <input
                    type='text'
                    value={text}
                    onChange={onChangeCtwitt}
                    required
                    className='widthImage'
                  />
                </>
              ) : (
                <input
                  type='text'
                  value={text}
                  onChange={onChangeCtwitt}
                  required
                />
              )}
            </div>
            <button type='submit'>
              <FontAwesomeIcon icon={faUpload} />
            </button>
            <button onClick={toggleEditing}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </form>
        </>
      ) : (
        <>
          <div className='ctwitt'>
            {ctwittObj.attachmentURL ? (
              <>
                <img
                  src={ctwittObj.attachmentURL}
                  width='100px'
                  height='50px'
                  alt='attached'
                  className='attachedImage'
                />
                <span className='widthImage'>{text}</span>
              </>
            ) : (
              <span>{text}</span>
            )}
          </div>
          {isOwner && (
            <>
              <button onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
              <button onClick={onClickDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          )}
        </>
      )}
    </li>
  );
};

export default Ctwitt;
