import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: "chats-868ba.firebaseapp.com",
  projectId: "chats-868ba",
  storageBucket: "chats-868ba.appspot.com",
  messagingSenderId: "798443487103",
  appId: "1:798443487103:web:7dd52953894b0b5117644a",
  measurementId: "G-08SQDSCN1H"

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
