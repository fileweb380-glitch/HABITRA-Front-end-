
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYAgZOX4_OY_vc-b5hdtkfhcw80dK6wkE",
  authDomain: "habitra-b8c7b.firebaseapp.com",
  projectId: "habitra-b8c7b",
  storageBucket: "habitra-b8c7b.firebasestorage.app",
  messagingSenderId: "43300540844",
  appId: "1:43300540844:web:c740cade52e7c32763aa09"
};

// Prevent duplicate Firebase app initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Use browser local storage persistence
let auth;

try {
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence
  });
} catch (error) {
  // Reuse Auth if it was already initialized
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

export { auth };
export default app;
