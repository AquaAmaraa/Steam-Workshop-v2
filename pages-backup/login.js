import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's an email verification error
        if (data.needsVerification) {
          setError(data.error);
        } else {
          setError(data.error || 'Login failed');
        }
        return;
      }

      // Store token and redirect to dashboard
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Welcome Back!</h1>
            <p className="text-amber-700">Login to continue building amazing things</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700 font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl transition duration-200 transform hover:scale-105 mt-6"
            >
              {loading ? '⏳ Logging in...' : '🚀 Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t-2 border-amber-200"></div>
            <span className="px-3 text-amber-600 text-sm font-medium">or</span>
            <div className="flex-1 border-t-2 border-amber-200"></div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-amber-800">
            Don't have an account?{' '}
            <Link href="/signup" className="text-amber-600 hover:text-amber-700 font-bold underline">
              Sign up here!
            </Link>
          </p>
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