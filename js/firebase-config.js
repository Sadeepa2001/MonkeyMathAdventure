// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCbHZ4ZfpugbTAI14CNEVh8JpNmBYCiCQ",
  authDomain: "monkey-math-adventure-f0568.firebaseapp.com",
  projectId: "monkey-math-adventure-f0568",
  storageBucket: "monkey-math-adventure-f0568.appspot.com",
  messagingSenderId: "782945565082",
  appId: "1:782945565082:web:46da24b1564903cdbfe223"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export authentication functions
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
