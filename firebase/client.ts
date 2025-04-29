// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import  {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAxEcJ9N4Kof_m3FK9CSs9rP2GvJKgtTj0",
    authDomain: "baselineinterview-983b4.firebaseapp.com",
    projectId: "baselineinterview-983b4",
    storageBucket: "baselineinterview-983b4.firebasestorage.app",
    messagingSenderId: "228910233013",
    appId: "1:228910233013:web:a19deff983975d950655fc",
    measurementId: "G-BE5ETCT7FV"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) :getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);