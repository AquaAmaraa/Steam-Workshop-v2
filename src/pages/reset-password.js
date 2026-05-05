import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    const { token: urlToken, email: urlEmail } = router.query;
    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(decodeURIComponent(urlEmail));

    if (!urlToken || !urlEmail) {
      setStatus('invalid');
      setMessage('Invalid reset link. Please request a new password reset.');
    }
  }, [router.isReady, router.query]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setStatus('error');
      setMessage('Password must be at least 8 characters with uppercase, lowercase, and number.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password: formData.password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Password reset successfully. Redirecting to login...');
        setTimeout(() => router.push('/login'), 1800);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const renderCard = () => {
    if (status === 'invalid') {
      return (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            Invalid reset link
          </h1>
          <p className="mt-3 text-sm sm:text-base" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {message}
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-flex justify-center w-full rounded-xl text-white font-semibold py-3.5"
            style={{ backgroundColor: palette.primary, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
          >
            Request New Reset Link
          </Link>
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            Password updated
          </h1>
          <p className="mt-3 text-sm sm:text-base" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {message}
          </p>
        </>
      );
    }

    return (
      <>
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            Reset password
          </h1>
          <p className="mt-2 text-sm sm:text-base" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            Enter your new password below.
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
              New password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-100"
              style={{ borderColor: palette.border, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}
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
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
          Remember your password?{' '}
          <Link href="/login" className="font-bold hover:opacity-90" style={{ color: palette.primary }}>
            Sign In
          </Link>
        </p>
      </>
    );
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

          <div className="rounded-2xl border bg-white shadow-xl p-7 sm:p-8 text-center" style={{ borderColor: palette.border }}>
            {renderCard()}
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

