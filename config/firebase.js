// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from '@firebase/app';
import '@firebase/firestore'
import '@firebase/auth';
import '@firebase/storage';

import { ENV } from '../env';

const firebaseConfig = {
  apiKey: ENV.apiKey,
  authDomain: ENV.authDomain,
  databaseURL: ENV.databaseURL,
  projectId: ENV.projectId,
  storageBucket: ENV.storageBucket,
  messagingSenderId: ENV.messagingSenderId,
  appId: ENV.appId
};
try {
  firebase.initializeApp(firebaseConfig);
} catch (error) {
  console.log('catching error while initialising firebase, ', error)
}

export default firebase;