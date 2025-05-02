"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      toast.success(data.message || "Check your email for the auth code");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <main className="flex fixed inset-0 items-center justify-center min-h-screen p-4 bg-gray-100">
      <section className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-2xl font-bold">Drive Check</h1>
        </div>
        <div className="flex justify-center space-x-4">
          <a href="/login" className="text-lg mb-4">
            Log In
          </a>
          <h1 className="border-l border-gray-500 pl-3 text-lg mb-4 text-blue-500">
            Sign Up
          </h1>
        </div>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
            Sign Up
          </button>
        </form>
      </section>
      <ToastContainer />
    </main>
  );
}
