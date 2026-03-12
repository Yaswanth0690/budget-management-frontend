"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic frontend validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 🔥 Uses dynamic apiFetch. Error handling is now done automatically in api.ts
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ 
          name, 
          email, 
          password 
        }),
      });

      // If registration is successful, redirect to the login page
      router.push("/login?registered=true");
      
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-[24px] shadow-sm w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">
            Join Budget App to start managing your finances.
          </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-xl text-sm mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John"
              className="border p-2.5 rounded-lg text-black placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-black/5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="border p-2.5 rounded-lg text-black placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-black/5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="border p-2.5 rounded-lg text-black placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-black/5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="border p-2.5 rounded-lg text-black placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-black/5"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white py-3 rounded-full hover:bg-gray-800 transition font-medium w-full mt-4 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0084FF] hover:underline font-medium">
            Log in here
          </Link>
        </div>
        
      </div>
    </div>
  );
}