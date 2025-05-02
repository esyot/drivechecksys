"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../lib/firebase"; // your Firestore config
import { collection, getDocs, query, where } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    if (!email || !password) {
      if (!email) setEmailError("Email is required");
      if (!password) setPasswordError("Password is required");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", email),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        // Simulate "auth" — store flag in localStorage
        localStorage.setItem("user", JSON.stringify({ email: userData.email }));

        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Invalid email or password");
        setError("Invalid email or password");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Login failed. Try again.");
      setError("Login failed. Try again.");
    }
  };

  return (
    <main className="flex fixed inset-0 items-center justify-center min-h-screen p-4 bg-gray-100">
      <section className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-2xl font-bold">Drive Check</h1>
        </div>
        <div className="flex justify-center space-x-4">
          <h1 className="text-lg mb-4 text-blue-500">Log In</h1>
          <a
            href="/signup"
            className="border-l border-gray-500 pl-3 text-lg mb-4"
          >
            Sign Up
          </a>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <p className="text-red-500">{emailError}</p>}

          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}

          {error && <p className="text-red-500">{error}</p>}

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Log In
          </button>
        </form>
      </section>

      <ToastContainer />
    </main>
  );
}
