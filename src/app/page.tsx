"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "./lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", trimmedEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log("User found:", userData);

        // Simple password match (insecure: only for demo)
        if (userData.password === trimmedPassword) {
          localStorage.setItem(
            "user",
            JSON.stringify({ email: userData.email })
          );
          toast.success("Login successful!");
          console.log("Login successful, redirecting...");
          router.push("/dashboard");
        } else {
          console.log("Incorrect password");
          setError("Invalid credentials");
          toast.error("Invalid email or password");
        }
      } else {
        console.log("No user found with that email");
        setError("User not found");
        toast.error("Invalid email or password");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Try again.");
      toast.error("An error occurred during login");
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

          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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
