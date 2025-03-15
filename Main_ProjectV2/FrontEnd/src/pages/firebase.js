// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-xROygJCiSU-ZyRCdsAzvX4Bzj7-Mun8",
  authDomain: "ecg-analyzer-ceb82.firebaseapp.com",
  projectId: "ecg-analyzer-ceb82",
  storageBucket: "ecg-analyzer-ceb82.firebasestorage.app",
  messagingSenderId: "131468940160",
  appId: "1:131468940160:web:b9682ddc072051f9ea2765"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth();
export default app;