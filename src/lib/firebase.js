
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYAgZOX4_OY_vc-b5hdtkfhcw80dK6wkE",
    authDomain: "habitra-b8c7b.firebaseapp.com",
      projectId: "habitra-b8c7b",
        storageBucket: "habitra-b8c7b.firebasestorage.app",
          messagingSenderId: "43300540844",
            appId: "1:43300540844:web:c740cade52e7c32763aa09",
            };

            const app = initializeApp(firebaseConfig);

            export const auth = getAuth(app);

            export default app;
            