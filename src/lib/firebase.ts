// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoQlgxLoGKqDHFRpXrbKi0H278Rqf636Y",
  authDomain: "rodinne-centrum-rcsirotar.firebaseapp.com",
  projectId: "rodinne-centrum-rcsirotar",
  storageBucket: "rodinne-centrum-rcsirotar.firebasestorage.app",
  messagingSenderId: "786502134538",
  appId: "1:786502134538:web:dbc4f4a910a656002d68f3",
  measurementId: "G-NRK16Y7G9L"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestore = getFirestore(app);