// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC87oyqTYcnu5F88ijWrsvojk9r2QQYkbM",
  authDomain: "expense-tracker-18d23.firebaseapp.com",
  projectId: "expense-tracker-18d23",
  storageBucket: "expense-tracker-18d23.firebasestorage.app",
  messagingSenderId: "876888802292",
  appId: "1:876888802292:web:8ddf36581872c53195afa1",
  measurementId: "G-MXXDYY0907"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);
