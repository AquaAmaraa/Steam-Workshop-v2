import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { persistLocalUserData } from '../lib/userDataClient';

const palette = {
  primary: '#4B8481',
  primaryDark: '#3d6d6a',
  primarySoft: '#e8f4f4',
  border: '#d7e7e6',
  text: '#0f172a',
  muted: '#64748b'
};

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      setError('');
      setErrorType('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorType('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        persistLocalUserData(data);
        const redirectPath = typeof router.query.redirect === 'string'
          ? `/${router.query.redirect.replace(/^\/+/, '')}`
          : '/dashboard';
        router.push(redirectPath);
      } else {
        setError(data.error || 'Login failed');
        if (data.noAccount) {
          setErrorType('noAccount');
        } else if (data.wrongPassword) {
          setErrorType('wrongPassword');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const alertStyles = {
    noAccount: { box: 'bg-sky-50 border-sky-200', text: 'text-sky-800' },
    wrongPassword: { box: 'bg-red-50 border-red-200', text: 'text-red-800' },
    default: { box: 'bg-red-50 border-red-200', text: 'text-red-800' }
  };
  const currentAlert = alertStyles[errorType] || alertStyles.default;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafbfc' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full blur-3xl opacity-60" style={{ backgroundColor: palette.primarySoft, transform: 'translate(35%, -30%)' }} />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full blur-3xl opacity-50" style={{ backgroundColor: '#eef2ff', transform: 'translate(-30%, 20%)' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-3 rounded-xl bg-white/90 px-4 py-3 shadow-sm border" style={{ borderColor: palette.border }}>
              <Image src="/fox.svg" alt="STEAM Workshop" width={28} height={28} />
              <span className="text-lg font-bold" style={{ color: palette.primary, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                STEAM Workshop
              </span>
            </Link>
          </div>

          <div className="rounded-2xl border bg-white shadow-xl p-7 sm:p-8" style={{ borderColor: palette.border }}>
            <div className="mb-7">
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                Sign in
              </h1>
              <p className="mt-2 text-sm sm:text-base" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                Access your STEAM Workshop account and continue learning.
              </p>
            </div>

            {error && (
              <div className={`mb-5 rounded-xl border px-4 py-3 ${currentAlert.box}`}>
                <p className={`text-sm font-semibold ${currentAlert.text}`} style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {error}
                </p>

                {errorType === 'noAccount' && (
                  <Link
                    href="/signup"
                    className="inline-block mt-2 text-sm font-semibold underline text-sky-700 hover:text-sky-800"
                    style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
                  >
                    Create an account -&gt;
                  </Link>
                )}

                {errorType === 'wrongPassword' && (
                  <Link
                    href="/forgot-password"
                    className="inline-block mt-2 text-sm font-semibold underline text-red-700 hover:text-red-800"
                    style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
                  >
                    Reset your password -&gt;
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-semibold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-white px-4 py-3 focus:outline-none focus:ring-2 ${
                    errorType === 'noAccount' ? 'border-sky-300 ring-sky-100' : 'focus:ring-teal-100'
                  }`}
                  style={{
                    fontFamily: "'Baloo 2', 'Noto Sans', sans-serif",
                    borderColor: errorType === 'noAccount' ? '#7dd3fc' : palette.border
                  }}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className={`w-full rounded-xl border bg-white px-4 py-3 focus:outline-none focus:ring-2 ${
                    errorType === 'wrongPassword' ? 'border-red-300 ring-red-100' : 'focus:ring-teal-100'
                  }`}
                  style={{
                    fontFamily: "'Baloo 2', 'Noto Sans', sans-serif",
                    borderColor: errorType === 'wrongPassword' ? '#fca5a5' : palette.border
                  }}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold hover:opacity-90"
                  style={{ color: palette.primary, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl text-white font-semibold py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: palette.primary, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = palette.primaryDark; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = palette.primary; }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              Do not have an account?{' '}
              <Link href="/signup" className="font-bold hover:opacity-90" style={{ color: palette.primary }}>
                Sign Up
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center">
            <Link
              href="/"
              className="text-sm font-medium hover:opacity-90"
              style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
            >
              {'<-'} Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
