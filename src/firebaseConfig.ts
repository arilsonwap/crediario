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

// ❗️ IMPORTANTE: usar initializeAuth PARA REACT NATIVE
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getStorage } from "firebase/storage";

// --------------------------------------
// 🔥 Configuração Firebase
// --------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAzQcyWf2argX07xwZaEpWmht7Ty74haHI",
  authDomain: "crediario-app.firebaseapp.com",
  projectId: "crediario-app",
  storageBucket: "crediario-app.firebasestorage.app",
  messagingSenderId: "464413033372",
  appId: "1:464413033372:web:67344359b50089bc3ffe59",
};

// --------------------------------------
// 🔥 Inicializa APP (evita múltiplas instâncias)
// --------------------------------------
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --------------------------------------
// 🔐 Auth com persistência REAL no AsyncStorage
// --------------------------------------
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// --------------------------------------
// 🔥 Firestore + Storage
// --------------------------------------
export const db = getFirestore(app);
export const storage = getStorage(app);

// --------------------------------------
// 📦 Exporta utilitários do Firestore
// --------------------------------------
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

// --------------------------------------
// 🔐 Exporta utilitários de Auth
// --------------------------------------
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
};

