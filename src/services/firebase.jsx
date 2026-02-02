import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração Firebase
const firebaseConfigPedidos = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
}

// Inicializa o app Firebase nomeado "pedidos"
const appPedidos =
  getApps().find(app => app.name === "pedidos") ??
  initializeApp(firebaseConfigPedidos, "pedidos");

// Exporta instâncias isoladas
export const authPedidos = getAuth(appPedidos);
export const dbPedidos = getFirestore(appPedidos);
