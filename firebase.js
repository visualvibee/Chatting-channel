import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "myntrachannel-ac2b3.firebaseapp.com",
  projectId: "myntrachannel-ac2b3",
  storageBucket: "myntrachannel-ac2b3.appspot.com",
  messagingSenderId: "662758075080",
  appId: "1:662758075080:web:a45eb9e2661e681e54d3fd",
  measurementId: "G-MDQVFZ0Q29"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
