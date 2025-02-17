import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCokvgvytjsv6vXKM-jTABFNpwGJwKDHjo",
  authDomain: "joby-app-kenya.firebaseapp.com",
  projectId: "joby-app-kenya",
  storageBucket: "joby-app-kenya.firebasestorage.app",
  messagingSenderId: "852841753222",
  appId: "1:852841753222:web:d64dd950f0bd640b2fff07",
  measurementId: "G-GMGMVHBY0S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
