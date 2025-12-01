import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKbV8995J49mnFPl9_3QuVkRFdtMOx86U",
  authDomain: "jogos2-d34ac.firebaseapp.com",
  projectId: "jogos2-d34ac",
  storageBucket: "jogos2-d34ac.appspot.com", // ✅ corrigido
  messagingSenderId: "64016555551",
  appId: "1:64016555551:web:982a9e43417cd7f565bf2a",
  measurementId: "G-TN6SWJRV37",
};

// ✅ Evita inicializar o app mais de uma vez
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Inicializa o Firestore
const db = getFirestore(app);

// ✅ Exporta utilitários usados no restante do app
export { db, collection, addDoc, deleteDoc, onSnapshot, doc };
