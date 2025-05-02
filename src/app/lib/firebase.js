import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8Fh6_qp8R9TFTiLoDUujbWClz2CeEN_4",
  authDomain: "drivechecksys.firebaseapp.com",
  projectId: "drivechecksys",
  storageBucket: "drivechecksys.firebasestorage.app",
  messagingSenderId: "774172171598",
  appId: "1:774172171598:web:1495a212e2526a71fb921f",
  measurementId: "G-ZH6ZQENX07",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
