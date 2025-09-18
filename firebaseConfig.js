import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfFwESTWPXvjNWnBETmUw8Q-_oBUJq0g8",
  authDomain: "taskease-5a420.firebaseapp.com",
  projectId: "taskease-5a420",
  storageBucket: "taskease-5a420.firebasestorage.app",
  messagingSenderId: "402603351643",
  appId: "1:402603351643:web:cca5ca4d6deeb6e372697e",
  measurementId: "G-1ZW59WDCT6"
};


const app = initializeApp(firebaseConfig);


let analytics;
if (typeof window !== 'undefined' && isSupported()) {
  analytics = getAnalytics(app);
}

export const db = getFirestore(app);
export const auth = getAuth(app);
