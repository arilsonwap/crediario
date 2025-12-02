import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzQcyWf2argX07xwZaEpWmht7Ty74haHI",
  authDomain: "crediario-app.firebaseapp.com",
  projectId: "crediario-app",
  storageBucket: "crediario-app.firebasestorage.app",
  messagingSenderId: "464413033372",
  appId: "1:464413033372:web:67344359b50089bc3ffe59",
};

// ✅ Evita inicializar o app mais de uma vez
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Inicializa os serviços do Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// ✅ Exporta utilitários do Firestore
export {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  setDoc,
  query,
  where,
};

// ✅ Exporta utilitários do Authentication
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
};
