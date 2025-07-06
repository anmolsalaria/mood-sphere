import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAojwjQV4tzvNAMVdjoIopeuF14fHBiuzs",
  authDomain: "mood-sphere.firebaseapp.com",
  projectId: "mood-sphere",
  storageBucket: "mood-sphere.appspot.com",
  messagingSenderId: "966519342041",
  appId: "1:966519342041:web:4de3b6b2491e7a58848fc8",
  measurementId: "G-S8WT47HJCG"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider }; 