import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import KitsSection from '../components/KitsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { clearClientSession, getStoredUser } from '../lib/clientCookies';
import { fetchMongoUserData, persistLocalUserData } from '../lib/userDataClient';

export default function Home() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const storedUser = getStoredUser();
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
    }

    const refreshUser = async () => {
      try {
        const serverData = await fetchMongoUserData();
        if (!isMounted) return;
        persistLocalUserData(serverData);
        setIsLoggedIn(true);
        setUser(serverData.user);
      } catch {
        // Visitors and expired sessions should keep seeing the public homepage.
      }
    };

    refreshUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await clearClientSession();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <>
      <Head>
        <title>{language === 'mn' ? 'STEAM Workshop - Нэг багц, гурван сургалтын хэсэг' : 'STEAM Workshop - One Set, Three Learning Sections'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <div className="min-h-screen bg-white">
        <Navigation isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <Hero />
        <KitsSection />
        <ContactSection />
        <Footer />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Gochi+Hand&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
