import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

const getCtwitts = async (db) => {
  try {
    const ctwittsCol = collection(db, 'ctwitt');
    const ctwittSnapshot = await getDocs(ctwittsCol);
    const ctwittList = ctwittSnapshot.docs;
    let ctwittObjs = [];
    ctwittList.forEach((document) => {
      const ctwittObj = {
        ...document.data(),
        id: document.id,
      };
      ctwittObjs.push(ctwittObj);
    });
    return ctwittObjs;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const auth = getAuth();
export const db = getFirestore(app);
export const ctwittObjs = getCtwitts(db);

export default app;
