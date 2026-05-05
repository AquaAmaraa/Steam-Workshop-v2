import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/forgot-password", { // <-- match API filename
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset email");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border-2 border-amber-200 text-center">
          <div className="mb-6 text-6xl">📧</div>
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Check Your Email!</h1>
          <p className="text-amber-700 mb-4">
            If an account exists with that email, we have sent password reset instructions to:
          </p>
          <p className="text-amber-900 font-bold text-lg mb-6 bg-amber-50 py-3 px-4 rounded-xl border-2 border-amber-200">
            {email}
          </p>
          <Link href="/login" className="inline-block w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl transition">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border-2 border-amber-200">
        <h1 className="text-3xl font-bold text-amber-900 mb-2 text-center">Forgot Password?</h1>
        <p className="text-amber-700 mb-6 text-center">
          Enter your email and we will send you reset instructions.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-amber-50"
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? "⏳ Sending..." : "📧 Send Reset Link"}
          </button>
        </form>
        <p className="text-center text-amber-800 mt-4">
          Remember your password? <Link href="/login" className="text-amber-600 font-bold underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
