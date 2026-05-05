import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { CircleUserRound } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

export default function Navigation({ isLoggedIn, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const displayName = user?.username || 'User';

  const handleLogout = () => {
    onLogout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/fox.svg" alt="Logo" width={36} height={36} />
              <span className="text-xl font-bold" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                STEAM Workshop
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/#kits" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.kits}</Link>
            <Link href="/#contact" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.contact}</Link>

            <LanguageSwitcher />

            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link href="/learn" className="px-4 py-2 font-medium transition-colors rounded-lg hover:bg-gray-50" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.myLearning}</Link>
                <Link href="/dashboard" className="px-4 py-2 font-medium transition-colors rounded-lg hover:bg-gray-50" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.dashboard}</Link>
                <div className="flex items-center gap-3 pl-2">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-[#e8f4f4] text-[#4B8481]">
                      <CircleUserRound className="w-5 h-5" />
                    </div>
                  )}
                  <Link href="/dashboard" className="max-w-32 truncate text-sm font-semibold text-gray-900 hover:text-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    {displayName}
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    {t.common.signOut}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/activate" className="px-4 py-2 font-medium transition-colors rounded-lg hover:bg-gray-50" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {t.common.activateKit}
                </Link>
                <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {t.common.signIn}
                </Link>
                <Link href="/signup" className="px-5 py-2 text-white rounded-lg font-medium transition-all hover:opacity-90" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {t.common.getStarted}
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100" style={{ color: '#4B8481' }}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link href="/#kits" className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.kits}</Link>
            <Link href="/#contact" className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.contact}</Link>
            <div className="px-4 py-2">
              <LanguageSwitcher compact />
            </div>
            <div className="h-px bg-gray-100 my-2"></div>
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 bg-[#e8f4f4] text-[#4B8481]">
                      <CircleUserRound className="w-6 h-6" />
                    </div>
                  )}
                  <span className="font-semibold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    {displayName}
                  </span>
                </div>
                <Link href="/learn" className="block px-4 py-3 rounded-lg font-medium" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.myLearning}</Link>
                <Link href="/dashboard" className="block px-4 py-3 rounded-lg font-medium" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.dashboard}</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-lg text-gray-500 font-medium" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.signOut}</button>
              </>
            ) : (
              <>
                <Link href="/activate" className="block px-4 py-3 rounded-lg font-medium" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.activateKit}</Link>
                <Link href="/login" className="block px-4 py-3 rounded-lg text-gray-600 font-medium" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.signIn}</Link>
                <Link href="/signup" className="block px-4 py-3 text-white rounded-lg font-medium text-center" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.getStarted}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
