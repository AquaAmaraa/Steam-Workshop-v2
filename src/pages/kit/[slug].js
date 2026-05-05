import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { CircleUserRound } from 'lucide-react';
import { getKitBySlug, getAllKits } from '../../data/kits';
import { getLocalizedKit } from '../../data/kitsLocale';
import { getPublicKitReviews } from '../../data/kitReviews';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { clearClientSession, getJsonCookie, getStoredUser, setJsonCookie } from '../../lib/clientCookies';
import { fetchMongoUserData, persistLocalUserData } from '../../lib/userDataClient';

export default function KitDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { language, t } = useLanguage();
  
  const [kit, setKit] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [hasActivated, setHasActivated] = useState(false);

  useEffect(() => {
    const syncUserKitOwnership = async () => {
      const storedUser = getStoredUser();
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(storedUser);
      }

      try {
        const serverData = await fetchMongoUserData();
        persistLocalUserData(serverData);
        setIsLoggedIn(true);
        setUser(serverData.user);
        setHasActivated((serverData.purchases || []).includes(slug));
      } catch (error) {
        if (storedUser) {
          console.error('Failed to load Mongo user data:', error);
        }
      }
    };

    if (slug) {
      const kitData = getLocalizedKit(getKitBySlug(slug), language);
      setKit(kitData);
      
      const publicComments = getPublicKitReviews(slug).map((comment) => ({
        id: comment.id,
        user: comment.user,
        avatar: comment.avatar,
        text: comment.text?.[language] || comment.text?.en || '',
        date: comment.date?.[language] || comment.date?.en || '',
        likes: comment.likes ?? 0,
        source: 'public',
      }));
      const userComments = getJsonCookie(`kit-user-comments-${slug}`, []);
      setComments([...userComments, ...publicComments]);
    }
    
    syncUserKitOwnership();
  }, [slug, language]);

  const handleLogout = async () => {
    await clearClientSession();
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = { id: Date.now(), user: user?.username || 'Anonymous', avatar: '🧑‍🔬', text: newComment, date: 'Just now', likes: 0 };
    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setJsonCookie(`kit-user-comments-${slug}`, updatedComments.filter((item) => item.source !== 'public'));
    setNewComment('');
  };

  const handleLikeComment = (commentId) => {
    const updatedComments = comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c);
    setComments(updatedComments);
  };

  if (!kit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#4B8481', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  const copy = language === 'mn'
    ? {
        pageTitle: `${kit.title} багц - STEAM Workshop`,
        home: 'Нүүр',
        projects: 'Төслүүд',
        rating: 'Үнэлгээ',
        startLearning: 'Сургалтаа эхлэх',
        activateThisKit: 'Энэ багцыг идэвхжүүлэх',
        saveForLater: 'Дараа үзэх',
        physicalKitRequired: 'Бодит кит шаардлагатай',
        physicalKitDesc: 'Бүх видео хичээлийг нээхийн тулд дэлгүүрээс кит худалдан авч идэвхжүүлэх кодоо ашиглана уу.',
        tabs: { overview: 'Тойм', experiments: 'Туршилтууд', reviews: 'Сэтгэгдэл' },
        aboutKit: 'Энэ багцын тухай',
        included: 'Багцад орсон зүйлс',
        experimentsInKit: 'Энэ багц дахь туршилтууд',
        experimentsDescUnlocked: 'Дурын туршилтыг сонгоод видео хичээлийг үзээрэй.',
        experimentsDescLocked: 'Бүх видео хичээлийг нээхийн тулд китаа идэвхжүүлнэ үү.',
        locked: 'Түгжээтэй',
        shareExperience: 'Өөрийн туршлагаа хуваалцаарай',
        reviewPlaceholder: 'Сэтгэгдлээ бичнэ үү...',
        postReview: 'Сэтгэгдэл нийтлэх',
        signInToReview: 'Сэтгэгдэл үлдээхийн тулд нэвтэрнэ үү',
        kitLabel: 'багц',
      }
    : {
        pageTitle: `${kit.title} Kit - STEAM Workshop`,
        home: 'Home',
        projects: 'Projects',
        rating: 'Rating',
        startLearning: 'Start Learning',
        activateThisKit: 'Activate This Kit',
        saveForLater: 'Save for Later',
        physicalKitRequired: 'Physical kit required',
        physicalKitDesc: 'Purchase the physical kit from our retail partners to receive an activation code that unlocks all video tutorials.',
        tabs: { overview: 'Overview', experiments: 'Experiments', reviews: 'Reviews' },
        aboutKit: 'About This Kit',
        included: "What's Included",
        experimentsInKit: 'Experiments in this Kit',
        experimentsDescUnlocked: 'Click on any experiment to watch the tutorial video.',
        experimentsDescLocked: 'Activate your kit to unlock all video tutorials.',
        locked: 'Locked',
        shareExperience: 'Share Your Experience',
        reviewPlaceholder: 'Write your review...',
        postReview: 'Post Review',
        signInToReview: 'Sign in to share your experience',
        kitLabel: 'Kit',
      };

  return (
    <>
      <Head>
        <title>{copy.pageTitle}</title>
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/fox.svg" alt="Logo" width={36} height={36} />
                <span className="text-xl font-bold" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>STEAM Workshop</span>
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/#kits" className="text-gray-600 hover:text-gray-900 font-medium" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.kits}</Link>
                <LanguageSwitcher compact />
                {isLoggedIn && (
                  <>
                    <Link href="/learn" className="font-medium" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.myLearning}</Link>
                    <Link href="/dashboard" className="font-medium" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.dashboard}</Link>
                  </>
                )}
                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
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
                    <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.signOut}</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.signIn}</Link>
                    <Link href="/signup" className="px-4 py-2 text-white rounded-lg font-medium" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.getStarted}</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              <Link href="/" className="text-gray-500 hover:text-gray-700">{copy.home}</Link>
              <span className="text-gray-400">/</span>
              <Link href="/#kits" className="text-gray-500 hover:text-gray-700">{t.common.kits}</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">{kit.title}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image */}
              <div className="relative">
                <div className="rounded-2xl p-8 lg:p-12" style={{ backgroundColor: '#f8fafa' }}>
                  <Image src={kit.image} alt={kit.title} width={400} height={400} className="w-full max-w-md mx-auto" />
                </div>
                {/* Stats */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-6 py-3 flex items-center gap-6">
                  <div className="text-center">
                    <div className="font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{kit.stats.projects}</div>
                    <div className="text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.projects}</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="font-bold" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{kit.stats.rating}</div>
                    <div className="text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.rating}</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#e8f4f4', color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {kit.ageRange}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {kit.title} {copy.kitLabel}
                </h1>
                <p className="text-xl text-gray-500 mb-6" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{kit.subtitle || 'STEAM Learning Kit'}</p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{kit.description}</p>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {hasActivated ? (
                    <Link href="/learn" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-lg font-semibold text-lg shadow-sm hover:opacity-90 transition-all" style={{ backgroundColor: '#22c55e', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {copy.startLearning}
                    </Link>
                  ) : (
                    <Link href="/activate" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-lg font-semibold text-lg shadow-sm hover:opacity-90 transition-all" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                      {copy.activateThisKit}
                    </Link>
                  )}
                  <button className="inline-flex items-center justify-center gap-2 border-2 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb', color: '#374151', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {copy.saveForLater}
                  </button>
                </div>

                {/* Info note */}
                <div className="mt-8 p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8f4f4' }}>
                      <svg className="w-4 h-4" style={{ color: '#4B8481' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.physicalKitRequired}</p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.physicalKitDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {['overview', 'experiments', 'reviews'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 font-medium relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`} style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {copy.tabs[tab]}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#4B8481' }} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.aboutKit}</h2>
                  <div style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    {kit.longDescription.split('\n\n').map((p, i) => <p key={i} className="text-gray-600 mb-4 leading-relaxed">{p}</p>)}
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-32">
                  <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.included}</h3>
                  <ul className="space-y-3">
                    {kit.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#4B8481' }}>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        <span className="text-gray-600 text-sm" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experiments' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.experimentsInKit}</h2>
                <p className="text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {hasActivated ? copy.experimentsDescUnlocked : copy.experimentsDescLocked}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {kit.experiments.map((exp) => (
                  <div key={exp.id} className={`bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow ${!hasActivated ? 'opacity-75' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">{exp.thumbnail}</span>
                      {!hasActivated && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.locked}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{exp.title}</h3>
                    <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{exp.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {exp.duration}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${exp.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : exp.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>{exp.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl mx-auto">
              {isLoggedIn ? (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.shareExperience}</h3>
                  <form onSubmit={handleAddComment}>
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={copy.reviewPlaceholder} className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }} rows={4} />
                    <button type="submit" className="mt-4 px-6 py-3 text-white rounded-lg font-medium" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.postReview}</button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8 text-center">
                  <p className="text-gray-600 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.signInToReview}</p>
                  <Link href="/login" className="inline-block px-6 py-3 text-white rounded-lg font-medium" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.signIn}</Link>
                </div>
              )}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{c.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{c.user}</span>
                          <span className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{c.date}</span>
                        </div>
                        <p className="text-gray-600 mb-3" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{c.text}</p>
                        <button onClick={() => handleLikeComment(c.id)} className="flex items-center gap-1 text-gray-500 hover:text-red-500 text-sm" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                          <span>❤️</span><span>{c.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const kits = getAllKits();
  return { paths: kits.map((kit) => ({ params: { slug: kit.slug } })), fallback: false };
}

export async function getStaticProps() {
  return { props: {} };
}
