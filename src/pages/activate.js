import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { validateActivationCode } from '../data/kits';
import { clearClientSession, getPendingActivationCode, getStoredUser, setPendingActivationCode } from '../lib/clientCookies';
import { fetchMongoUserData, patchMongoUserData, persistLocalUserData } from '../lib/userDataClient';
import { useLanguage } from '../context/LanguageContext';

export default function ActivateKit() {
  const router = useRouter();
  const { language } = useLanguage();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [kitProgress, setKitProgress] = useState({});

  const copy = language === 'mn'
    ? {
        pageTitle: 'Багцаа идэвхжүүлэх - STEAM Workshop',
        signIn: 'Нэвтрэх',
        signOut: 'Гарах',
        title: 'Багцаа идэвхжүүлэх',
        subtitle: 'STEAM үндсэн багцын хайрцаг доторх идэвхжүүлэх кодоо оруулна уу.',
        validCode: 'Зөв идэвхжүүлэх код оруулна уу',
        alreadyActivated: 'Энэ багц таны бүртгэл дээр аль хэдийн идэвхжсэн байна',
        invalidCode: 'Идэвхжүүлэх код буруу байна. Кодоо шалгаад дахин оролдоно уу.',
        successTitle: 'Багц идэвхжлээ',
        successDescPrefix: '',
        successDescSuffix: 'таны бүртгэлд нэмэгдлээ.',
        startLearning: 'Сургалтаа эхлэх',
        activationCode: 'Идэвхжүүлэх код',
        verifying: 'Шалгаж байна...',
        activateSet: 'Багцаа идэвхжүүлэх',
        signInRequired: 'Багцаа идэвхжүүлэхийн тулд эхлээд нэвтрэх шаардлагатай',
        exampleCode: 'Жишээ код:',
      }
    : {
        pageTitle: 'Activate Your Set - STEAM Workshop',
        signIn: 'Sign in',
        signOut: 'Sign out',
        title: 'Activate Your Set',
        subtitle: 'Enter the activation code found inside your STEAM Core Set package.',
        validCode: 'Please enter a valid activation code',
        alreadyActivated: 'This kit has already been activated on your account',
        invalidCode: 'Invalid activation code. Please check your code and try again.',
        successTitle: 'Set Activated',
        successDescPrefix: 'Your ',
        successDescSuffix: ' is now available in your account.',
        startLearning: 'Start Learning',
        activationCode: 'Activation Code',
        verifying: 'Verifying...',
        activateSet: 'Activate Set',
        signInRequired: 'You will need to sign in to activate your set',
        exampleCode: 'Example code:',
      };

  useEffect(() => {
    const pendingCode = getPendingActivationCode();
    if (pendingCode) {
      setCode(pendingCode);
    }

    const loadUserState = async () => {
      const storedUser = getStoredUser();
      if (!storedUser) return;

      setIsLoggedIn(true);
      setUser(storedUser);

      try {
        const serverData = await fetchMongoUserData();
        setUser(serverData.user);
        setPurchases(serverData.purchases || []);
        setKitProgress(serverData.kitProgress || {});
        persistLocalUserData(serverData);
      } catch (loadError) {
        console.error('Failed to load Mongo user data:', loadError);
      }
    };

    loadUserState();
  }, []);

  const formatCode = (value) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const parts = cleaned.match(/.{1,4}/g) || [];
    return parts.join('-').substring(0, 19);
  };

  const handleCodeChange = (e) => {
    const formatted = formatCode(e.target.value);
    setCode(formatted);
    setError('');
    setSuccess(null);
  };

  const handleActivate = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setPendingActivationCode(code);
      router.push('/login?redirect=activate');
      return;
    }

    if (code.length < 5) {
      setError(copy.validCode);
      return;
    }

    setLoading(true);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = validateActivationCode(code);

    if (result.valid) {
      const activatedKits = [...purchases];
      if (activatedKits.includes(result.kitSlug)) {
        setError(copy.alreadyActivated);
        setLoading(false);
        return;
      }

      activatedKits.push(result.kitSlug);

      const progress = { ...kitProgress };
      if (!progress[result.kitSlug]) {
        progress[result.kitSlug] = {
          watchedVideos: [],
          completedExperiments: [],
          activatedAt: new Date().toISOString(),
        };
      }

      const nextPayload = { purchases: activatedKits, kitProgress: progress };
      setPurchases(activatedKits);
      setKitProgress(progress);

      try {
        const serverData = await patchMongoUserData(nextPayload);
        persistLocalUserData(serverData);
        setUser(serverData.user);
        setPurchases(serverData.purchases || activatedKits);
        setKitProgress(serverData.kitProgress || progress);
      } catch (mongoError) {
        console.error('Failed to persist activation to MongoDB:', mongoError);
      }

      setPendingActivationCode('');
      setSuccess(result);
      setCode('');
    } else {
      setError(copy.invalidCode);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await clearClientSession();
    setIsLoggedIn(false);
    setUser(null);
    setPurchases([]);
    setKitProgress({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{copy.pageTitle}</title>
      </Head>

      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/fox.svg" alt="Logo" width={36} height={36} />
              <span className="text-xl font-bold" style={{ color: '#4B8481' }}>STEAM Workshop</span>
            </Link>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">{copy.signOut}</button>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-gray-900">{copy.signIn}</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{copy.title}</h1>
          <p className="text-gray-600">{copy.subtitle}</p>
        </div>

        {success && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{copy.successTitle}</h2>
            <p className="text-gray-600 mb-6">{copy.successDescPrefix}<strong>{success.kitTitle}</strong>{copy.successDescSuffix}</p>
            <Link href="/learn" className="inline-block px-6 py-3 text-white rounded-lg" style={{ backgroundColor: '#4B8481' }}>
              {copy.startLearning}
            </Link>
          </div>
        )}

        {!success && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleActivate}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{copy.activationCode}</label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-4 py-4 text-center text-xl tracking-widest font-mono border-2 rounded-xl focus:outline-none mb-4 uppercase"
                style={{ borderColor: error ? '#ef4444' : '#e5e7eb' }}
                maxLength={19}
              />

              {error && (
                <div className="text-red-600 mb-4 text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading || code.length < 5}
                className="w-full py-4 text-white rounded-xl font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#4B8481' }}
              >
                {loading ? copy.verifying : copy.activateSet}
              </button>

              {!isLoggedIn && (
                <p className="text-center text-sm text-gray-500 mt-4">{copy.signInRequired}</p>
              )}
            </form>
          </div>
        )}

        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-sm text-amber-800 font-medium mb-2">{copy.exampleCode}</p>
          <div className="flex flex-wrap gap-2">
            <code className="px-3 py-1.5 bg-amber-100 rounded text-amber-900 text-xs font-semibold">CORE-2026-PRO1</code>
          </div>
        </div>
      </div>
    </div>
  );
}
