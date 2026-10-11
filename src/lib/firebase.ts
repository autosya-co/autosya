import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || (typeof process !== 'undefined' ? process.env.PUBLIC_FIREBASE_API_KEY : undefined) || 'AIzaSyD7Kcfxy-jAtrH69MWKWR3M8ft1LDmccso',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || (typeof process !== 'undefined' ? process.env.PUBLIC_FIREBASE_AUTH_DOMAIN : undefined) || 'toyotausados.firebaseapp.com',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || (typeof process !== 'undefined' ? process.env.PUBLIC_FIREBASE_PROJECT_ID : undefined) || 'toyotausados',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || (typeof process !== 'undefined' ? process.env.PUBLIC_FIREBASE_STORAGE_BUCKET : undefined) || 'toyotausados.firebasestorage.app',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (typeof process !== 'undefined' ? process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID : undefined) || '308604847797',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || (typeof process !== 'undefined' ? process.env.PUBLIC_FIREBASE_APP_ID : undefined) || '1:308604847797:web:f8e583ee15c785546ee0fc',
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID || (typeof process !== 'undefined' ? process.env.PUBLIC_FIREBASE_MEASUREMENT_ID : undefined) || 'G-GVW40Q3LX2',
};

// Evitar re-inicialización en hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Especificamos el ID de la base de datos 'default' (sin paréntesis) que es el que tienes creado
export const db = getFirestore(app, 'default');
export default app;
