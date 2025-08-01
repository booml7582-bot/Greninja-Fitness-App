import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnVHJZLcCtf-niI-zBGxC3_MRHGUZOat0",
  authDomain: "greninja-fitness-app.firebaseapp.com",
  projectId: "greninja-fitness-app",
  storageBucket: "greninja-fitness-app.firebasestorage.app",
  messagingSenderId: "146139824121",
  appId: "1:146139824121:web:b69dfc673cd466a9630728",
  measurementId: "G-LK4R29D9HJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log('Firebase initialized:', !!app, 'Firestore db:', !!db); 