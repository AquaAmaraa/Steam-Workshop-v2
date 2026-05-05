import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

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
    setSuccess(false);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      // Show success message instead of redirecting
      setSuccess(true);
      setUserEmail(formData.email);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show success screen after signup
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
              <div className="mb-6 text-6xl">📧</div>
              <h1 className="text-3xl font-bold text-amber-900 mb-4">Check Your Email!</h1>
              <p className="text-amber-700 mb-4">
                We've sent a verification link to:
              </p>
              <p className="text-amber-900 font-bold text-lg mb-6 bg-amber-50 py-3 px-4 rounded-xl border-2 border-amber-200">
                {userEmail}
              </p>
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6 text-left">
                <p className="text-blue-900 font-semibold mb-2">📬 Next Steps:</p>
                <ol className="text-blue-800 text-sm space-y-2 ml-4 list-decimal">
                  <li>Open your email inbox</li>
                  <li>Find the email from STEAM Workshop</li>
                  <li>Click the verification link</li>
                  <li>Come back and login!</li>
                </ol>
              </div>
              <p className="text-amber-600 text-sm mb-6">
                💡 Don't see the email? Check your spam folder!
              </p>
              <Link
                href="/login"
                className="inline-block w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl transition"
              >
                Go to Login
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
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Join STEAM Workshop!</h1>
            <p className="text-amber-700">Create your account and start building amazing things</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-amber-900 mb-2">
                👤 Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="3-20 characters, letters/numbers/_"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-amber-50"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-amber-900 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-amber-50"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-amber-900 mb-2">
                🔐 Password
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
                🔐 Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
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
              {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t-2 border-amber-200"></div>
            <span className="px-3 text-amber-600 text-sm font-medium">or</span>
            <div className="flex-1 border-t-2 border-amber-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-amber-800">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-bold underline">
              Login here!
            </Link>
          </p>

          {/* Footer */}
          <p className="text-center text-amber-600 text-xs mt-6">
            By signing up, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}