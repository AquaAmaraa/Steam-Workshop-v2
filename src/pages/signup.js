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

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (fieldError) setFieldError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        persistLocalUserData(data);
        const redirectPath = typeof router.query.redirect === 'string'
          ? `/${router.query.redirect.replace(/^\/+/, '')}`
          : '/dashboard';
        router.push(redirectPath);
      } else {
        setFieldError(data.field || '');
        if (data.hasAccount) {
          setError('You already have an account with this email');
        } else {
          setError(data.error || 'Signup failed');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBorder = (fieldName) => {
    if (fieldError === fieldName) return '#fca5a5';
    return palette.border;
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafbfc' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 h-80 w-80 rounded-full blur-3xl opacity-60" style={{ backgroundColor: palette.primarySoft, transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl opacity-50" style={{ backgroundColor: '#eef2ff', transform: 'translate(25%, 20%)' }} />
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
                Create account
              </h1>
              <p className="mt-2 text-sm sm:text-base" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                Create your STEAM Workshop account to activate kits and track progress.
              </p>
            </div>

            {error && (
              <div className={`mb-5 rounded-xl border px-4 py-3 ${
                fieldError === 'email' && error.includes('already have an account')
                  ? 'bg-sky-50 border-sky-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p
                  className={`text-sm font-semibold ${
                    fieldError === 'email' && error.includes('already have an account')
                      ? 'text-sky-800'
                      : 'text-red-800'
                  }`}
                  style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
                >
                  {error}
                </p>
                {fieldError === 'email' && error.includes('already have an account') && (
                  <Link
                    href="/login"
                    className="inline-block mt-2 text-sm font-semibold underline text-sky-700 hover:text-sky-800"
                    style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
                  >
                    Sign in instead -&gt;
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-semibold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className={`w-full rounded-xl border bg-white px-4 py-3 focus:outline-none focus:ring-2 ${
                    fieldError === 'username' ? 'border-red-300 ring-red-100' : 'focus:ring-teal-100'
                  }`}
                  style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif", borderColor: inputBorder('username') }}
                  required
                />
                {fieldError === 'username' && (
                  <p className="mt-1 text-sm text-red-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    This username is not available.
                  </p>
                )}
              </div>

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
                    fieldError === 'email' ? 'border-red-300 ring-red-100' : 'focus:ring-teal-100'
                  }`}
                  style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif", borderColor: inputBorder('email') }}
                  required
                />
                {fieldError === 'email' && (
                  <p className="mt-1 text-sm text-red-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    This email is already registered.
                  </p>
                )}
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
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif", borderColor: palette.border }}
                  required
                />
                <p className="mt-1 text-xs" style={{ color: '#94a3b8', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  Include uppercase, lowercase, and a number.
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif", borderColor: palette.border }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl text-white font-semibold py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: palette.primary, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = palette.primaryDark; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = palette.primary; }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              Already have an account?{' '}
              <Link href="/login" className="font-bold hover:opacity-90" style={{ color: palette.primary }}>
                Sign In
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
