import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDt01PGgDXCx8kjI9xuQuHdklH4Eqga-ek',
  authDomain: 'spiritly-mvp.firebaseapp.com',
  projectId: 'spiritly-mvp',
  storageBucket: 'spiritly-mvp.firebasestorage.app',
  messagingSenderId: '1009501180274',
  appId: '1:1009501180274:web:c5cb039bb16642c1e30deb',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);