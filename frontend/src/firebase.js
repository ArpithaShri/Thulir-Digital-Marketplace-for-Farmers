import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcZK6ooaEX36LbQmZo-bAe4lxmCWn07nw",
  authDomain: "thulir-58ed6.firebaseapp.com",
  projectId: "thulir-58ed6",
  storageBucket: "thulir-58ed6.firebasestorage.app",
  messagingSenderId: "500970882467",
  appId: "1:500970882467:web:8ad29e52dd505caa104616"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
