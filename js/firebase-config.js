// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCbHZ4ZfpugbTAI14CNEVh8JpNmBYCiCQ",
  authDomain: "monkey-math-adventure-f0568.firebaseapp.com",
  projectId: "monkey-math-adventure-f0568",
  storageBucket: "monkey-math-adventure-f0568.appspot.com",
  messagingSenderId: "782945565082",
  appId: "1:782945565082:web:46da24b1564903cdbfe223",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

// Export authentication functions and providers
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  googleProvider,
  signInWithPopup,
  db,
};