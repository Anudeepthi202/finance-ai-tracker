// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjedObptPrasfhI2B1Gg3wEeuehmQz6dw",
  authDomain: "authentication-da098.firebaseapp.com",
  projectId: "authentication-da098",
  storageBucket: "authentication-da098.firebasestorage.app",
  messagingSenderId: "424758073544",
  appId: "1:424758073544:web:c1e9c67b680994c463adfd",
  measurementId: "G-DXV839KTJN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
