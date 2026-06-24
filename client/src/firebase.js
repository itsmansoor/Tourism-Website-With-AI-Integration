// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//temporary souls firebase
const firebaseConfig = {

  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tourism-fa957.firebaseapp.com",
  projectId: "tourism-fa957",
  storageBucket: "tourism-fa957.firebasestorage.app",
  messagingSenderId: "474599044145",
  appId: "1:474599044145:web:2edd68fc1f3fb791185110"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

