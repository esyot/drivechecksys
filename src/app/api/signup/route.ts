import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8Fh6_qp8R9TFTiLoDUujbWClz2CeEN_4",
  authDomain: "drivechecksys.firebaseapp.com",
  projectId: "drivechecksys",
  storageBucket: "drivechecksys.appspot.com",
  messagingSenderId: "774172171598",
  appId: "1:774172171598:web:1495a212e2526a71fb921f",
  measurementId: "G-ZH6ZQENX07",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await addDoc(collection(db, "users"), {
      email,
      password,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "User added successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
