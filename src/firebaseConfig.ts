// --------------------------------------
// 🔥 FIREBASE NATIVO - @react-native-firebase
// --------------------------------------
// ✔ Configuração para Expo SDK 54 com Firebase Nativo
// ✔ NÃO usa mais firebase/app, firebase/auth, firebase/firestore
// ✔ Usa @react-native-firebase (SDK nativo iOS/Android)

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

// --------------------------------------
// 🔥 Exporta instâncias Firebase Nativas
// --------------------------------------
export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const firebaseStorage = storage();

// --------------------------------------
// 📦 Tipos do Firebase Auth
// --------------------------------------
export type FirebaseUser = typeof firebaseAuth.currentUser;
