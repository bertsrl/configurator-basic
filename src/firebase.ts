// Import the functions you need from the SDKs you need

import * as store from "@/store"

import { doc, getFirestore, updateDoc } from "firebase/firestore/lite";

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2858w1RuhuGscgqT4yGqv-DDRh1qx4so",
  authDomain: "configurator-20126.firebaseapp.com",
  projectId: "configurator-20126",
  storageBucket: "configurator-20126.appspot.com",
  messagingSenderId: "912824733630",
  appId: "1:912824733630:web:7196404866c11624b9f3ef"
};

export const updateDocument = (
    col: any,
    id: any,
    data: object,
  ) => {
    const db = getFirestore();
  
    const docRef = doc(db, col, id);
  
    updateDoc(docRef, data);
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);