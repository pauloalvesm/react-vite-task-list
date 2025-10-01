import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "your-key",
    authDomain: "task-list-4bba1.firebaseapp.com",
    projectId: "task-list-4bba1",
    storageBucket: "task-list-4bba1.firebasestorage.app",
    messagingSenderId: "927662983621",
    appId: "1:927662983621:web:d6af1a6c1d4a6343ab23ac",
    measurementId: "G-2NX1LW3BRH"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };