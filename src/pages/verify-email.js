import Link from 'next/link';
import Image from 'next/image';

const palette = {
  primary: '#4B8481',
  border: '#d7e7e6',
  text: '#0f172a',
  muted: '#64748b',
};

export default function VerifyEmail() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fafbfc' }}>
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
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: palette.text, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              Email verification removed
            </h1>
            <p className="mt-3 text-sm sm:text-base" style={{ color: palette.muted, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              Accounts no longer require email verification. You can sign in directly.
            </p>
            <Link href="/login" className="mt-6 inline-flex w-full items-center justify-center rounded-xl py-3.5 text-white font-semibold" style={{ backgroundColor: palette.primary, fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
