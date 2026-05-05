import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token, email } = router.query;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your email...');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !email) return;

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}&email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Verification failed');
          setLoading(false);
          return;
        }

        setSuccess(true);
        setMessage('✅ Email verified successfully!');
        setLoading(false);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        setError('An error occurred. Please try again.');
        setLoading(false);
        console.error('Verification error:', err);
      }
    };

    verifyEmail();
  }, [token, email, router]);

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

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-amber-200">
          <div className="text-center">
            {loading ? (
              <>
                <div className="mb-6">
                  <div className="inline-block">
                    <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-amber-900 mb-3">Verifying Email</h1>
                <p className="text-amber-700">{message}</p>
              </>
            ) : success ? (
              <>
                <div className="mb-6 text-6xl">✅</div>
                <h1 className="text-3xl font-bold text-green-600 mb-3">Email Verified!</h1>
                <p className="text-amber-700 mb-6">{message}</p>
                <p className="text-sm text-amber-600">Redirecting to login in 3 seconds...</p>
                <Link
                  href="/login"
                  className="inline-block mt-6 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl transition"
                >
                  Go to Login
                </Link>
              </>
            ) : (
              <>
                <div className="mb-6 text-6xl">❌</div>
                <h1 className="text-3xl font-bold text-red-600 mb-3">Verification Failed</h1>
                <p className="text-red-600 mb-6">{error}</p>
                <div className="space-y-3">
                  <Link
                    href="/signup"
                    className="block bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl transition"
                  >
                    Sign Up Again
                  </Link>
                  <Link
                    href="/login"
                    className="block border-2 border-amber-400 text-amber-700 font-bold py-3 px-8 rounded-xl hover:bg-amber-50 transition"
                  >
                    Go to Login
                  </Link>
                </div>
              </>
            )}
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