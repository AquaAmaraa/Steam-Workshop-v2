import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const palette = {
  primary: '#4B8481',
  primaryDark: '#3d6d6a',
  primarySoft: '#e8f4f4',
  border: '#d7e7e6',
  text: '#0f172a',
  muted: '#64748b',
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Password reset link sent. Check your email.');
      } else {
        setStatus('error');
        setMessage(data.message || data.error || 'Failed to send reset email');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

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
            {status === 'success' ? (
              <div className="text-center">
                <div className="mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: palette.primarySoft }}>
                  <svg className="w-7 h-7" style={{ color: palette.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 001.9 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  Check your email
                </h1>
                <p className="mt-3 text-sm sm:text-base" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {message}
                </p>
                <Link href="/login" className="inline-block mt-6 font-semibold hover:opacity-90" style={{ color: palette.primary, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    Forgot password
                  </h1>
                  <p className="mt-2 text-sm sm:text-base" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    Enter your email and we will send a password reset link.
                  </p>
                </div>

                {status === 'error' && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-semibold text-red-800" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                      {message}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-100"
                      style={{ borderColor: palette.border, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-xl text-white font-semibold py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: palette.primary, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
                    onMouseEnter={(e) => { if (status !== 'loading') e.currentTarget.style.backgroundColor = palette.primaryDark; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = palette.primary; }}
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  Remember your password?{' '}
                  <Link href="/login" className="font-bold hover:opacity-90" style={{ color: palette.primary }}>
                    Sign In
                  </Link>
                </p>
              </>
            )}
          </div>

          <p className="mt-5 text-center">
            <Link href="/" className="text-sm font-medium hover:opacity-90" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {'<-'} Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

