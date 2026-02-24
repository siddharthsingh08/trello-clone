import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlKvuA5Ymz0uvgumdqKGB-05feuIbcCcw",
  authDomain: "trello-clone-cc86e.firebaseapp.com",
  projectId: "trello-clone-cc86e",
  storageBucket: "trello-clone-cc86e.firebasestorage.app",
  messagingSenderId: "240814106483",
  appId: "1:240814106483:web:080ae139116809bef60706"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);