// Import only what you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAf07oFGyXzKx_nRVAwHBRN0d2y8gy4JVc",
  authDomain: "music-app-89cca.firebaseapp.com",
  projectId: "music-app-89cca",
  storageBucket: "music-app-89cca.appspot.com",
  messagingSenderId: "358793524258",
  appId: "1:358793524258:web:7973b6f4a01c488366867b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);