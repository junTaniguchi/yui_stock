import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // TODO: Firebase設定を追加してください
  // Project Settings > General > Your apps から取得できます
  apiKey: "AIzaSyAUHszKFF-jN6l1r_HZp_XjgHlRgJo4X-o",
  authDomain: "yui-stock.firebaseapp.com",
  projectId: "yui-stock",
  storageBucket: "yui-stock.firebasestorage.app",
  messagingSenderId: "704142178477",
  appId: "1:704142178477:web:3bbeec9fec066594ee6e24",
  measurementId: "G-C7VNDRR61M"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;