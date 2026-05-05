import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token, email } = router.query;
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="fixed top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="fixed bottom-10 right-10 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg border-3 border-amber-300 overflow-hidden">
              <Image
                src="/round_logo.svg"
                alt="STEAM Workshop"
                width={80}
                height={80}
              />
            </div>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-amber-200">
            <div className="text-center">
              <div className="mb-6 text-6xl">✅</div>
              <h1 className="text-3xl font-bold text-green-600 mb-3">Password Reset Successful!</h1>
              <p className="text-amber-700 mb-6">Your password has been successfully reset.</p>
              <p className="text-sm text-amber-600">Redirecting to login in 3 seconds...</p>
              <Link
                href="/login"
                className="inline-block mt-6 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl transition"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-amber-200 max-w-md text-center">
          <div className="mb-6 text-6xl">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-3">Invalid Reset Link</h1>
          <p className="text-amber-700 mb-6">This password reset link is invalid or incomplete.</p>
          <Link
            href="/forgot-password"
            className="inline-block bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl transition"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="fixed bottom-10 right-10 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="fixed top-1/2 right-20 w-48 h-48 bg-amber-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg border-3 border-amber-300 overflow-hidden">
            <Image
              src="/round_logo.svg"
              alt="STEAM Workshop"
              width={80}
              height={80}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-amber-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Reset Password</h1>
            <p className="text-amber-700">Enter your new password below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-amber-900 mb-2">
                🔐 New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 chars, uppercase, lowercase, number"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-amber-50"
                required
              />
              <p className="text-xs text-amber-600 mt-1">
                💡 Use at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-amber-900 mb-2">
                🔐 Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your new password"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-amber-50"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                ❌ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl transition duration-200 transform hover:scale-105 mt-6"
            >
              {loading ? '⏳ Resetting Password...' : '🔐 Reset Password'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium hover:underline text-sm">
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-amber-600 text-sm mt-8">
          Need help?{' '}
          <a href="mailto:steamworkshop.kids@outlook.com" className="font-bold hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}