import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, inMemoryPersistence } from "@firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
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
