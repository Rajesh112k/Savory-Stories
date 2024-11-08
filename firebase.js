import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, inMemoryPersistence } from "@firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9c5Uj1i6xoYiFgmnT3tJ-jsLMlNtfIz0",
  authDomain: "savorystories-dceea.firebaseapp.com",
  projectId: "savorystories-dceea",
  storageBucket: "savorystories-dceea.appspot.com",
  messagingSenderId: "189277746449",
  appId: "1:189277746449:web:882005fa9d5aff795a08b0",
  measurementId: "G-V294XWP6M4"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence using AsyncStorage
export const auth = initializeAuth(app, {
  persistence: inMemoryPersistence, // Use inMemoryPersistence or another option
});

// Import getAuth here
import { getAuth } from "firebase/auth";

// Initialize Firestore
export const db = getFirestore(app);

export default app;
