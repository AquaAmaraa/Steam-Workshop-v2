import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { CircleUserRound } from 'lucide-react';
import { kitsData } from '../data/kits';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedKit } from '../data/kitsLocale';
import { clearClientSession, getStoredUser } from '../lib/clientCookies';
import { fetchMongoUserData, patchMongoUserData, persistLocalUserData } from '../lib/userDataClient';

export default function Learn() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [progress, setProgress] = useState({});
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    const loadLearningData = async () => {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }

      try {
        const serverData = await fetchMongoUserData();
        persistLocalUserData(serverData);
        setUser(serverData.user);
        setPurchases(serverData.purchases || []);
        setProgress(serverData.kitProgress || {});
        if ((serverData.purchases || []).length > 0) {
          setSelectedKit((current) => current || serverData.purchases[0]);
        }
      } catch (error) {
        console.error('Failed to load Mongo user data:', error);
        await clearClientSession();
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    loadLearningData();
  }, [router]);

  const handleLogout = async () => {
    await clearClientSession();
    router.push('/');
  };

  const handleWatchVideo = (video) => {
    if (!video.youtubeId) return;
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleVideoComplete = () => {
    if (!selectedVideo || !selectedKit) return;

    const newProgress = { ...progress };
    if (!newProgress[selectedKit]) {
      newProgress[selectedKit] = { watchedVideos: [], completedExperiments: [] };
    }

    if (!newProgress[selectedKit].watchedVideos.includes(selectedVideo.id)) {
      newProgress[selectedKit].watchedVideos.push(selectedVideo.id);

      if (selectedVideo.experimentId && !newProgress[selectedKit].completedExperiments.includes(selectedVideo.experimentId)) {
        newProgress[selectedKit].completedExperiments.push(selectedVideo.experimentId);
      }
    }

    setProgress(newProgress);
    setShowVideoModal(false);
    setSelectedVideo(null);

    patchMongoUserData({ kitProgress: newProgress })
      .then((serverData) => {
        persistLocalUserData(serverData);
        setUser((current) => ({ ...(current || {}), ...(serverData.user || {}) }));
        setProgress(serverData.kitProgress || newProgress);
      })
      .catch((error) => {
        console.error('Failed to persist progress to MongoDB:', error);
      });
  };

  const isVideoWatched = (videoId) => {
    return progress[selectedKit]?.watchedVideos?.includes(videoId) || false;
  };

  const getKitProgress = (kitSlug) => {
    const kit = kitsData[kitSlug];
    if (!kit || !progress[kitSlug]) return 0;

    const availableVideoIds = kit.videos.filter((video) => video.youtubeId).map((video) => video.id);
    const totalVideos = availableVideoIds.length;
    const watchedVideos = (progress[kitSlug]?.watchedVideos || []).filter((videoId) => availableVideoIds.includes(videoId)).length;
    if (totalVideos === 0) return 0;
    return Math.round((watchedVideos / totalVideos) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#4B8481', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  const currentKit = kitsData[selectedKit];
  const localizedCurrentKit = getLocalizedKit(currentKit, language);
  const copy = language === 'mn'
    ? {
        pageTitle: 'Миний сургалт - STEAM Workshop',
        subtitle: 'Видео хичээл үзэж, ахицаа хянаарай',
        noKitsTitle: 'Одоогоор идэвхжүүлсэн багц алга',
        noKitsDesc: 'Бүх видео хичээл, сургалтын материалд хандахын тулд багцаа идэвхжүүлнэ үү.',
        activateYourKit: 'Багцаа идэвхжүүлэх',
        myKits: 'Миний багцууд',
        complete: 'дууссан',
        activateAnother: '+ Өөр багц идэвхжүүлэх',
        tutorialsSuffix: 'багцын видео хичээл',
        done: 'Дууссан',
        video: 'Видео',
        duration: 'Хугацаа',
        markComplete: 'Дууссан гэж тэмдэглэх',
      }
    : {
        pageTitle: 'My Learning - STEAM Workshop',
        subtitle: 'Watch video tutorials and track your progress',
        noKitsTitle: 'No Kits Activated Yet',
        noKitsDesc: 'Activate your kit to access all video tutorials and learning materials',
        activateYourKit: 'Activate Your Kit',
        myKits: 'My Kits',
        complete: 'complete',
        activateAnother: '+ Activate Another Kit',
        tutorialsSuffix: 'Kit Tutorials',
        done: 'Done',
        video: 'Video',
        duration: 'Duration',
        markComplete: 'Mark as Complete',
      };

  return (
    <>
      <Head>
        <title>{copy.pageTitle}</title>
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/fox.svg" alt="Logo" width={36} height={36} />
                <span className="text-xl font-bold" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>STEAM Workshop</span>
              </Link>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.dashboard}</Link>
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
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.myLearning}</h1>
            <p className="text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.subtitle}</p>
          </div>

          {purchases.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.noKitsTitle}</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.noKitsDesc}</p>
              <Link href="/activate" className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-lg font-semibold" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                {copy.activateYourKit}
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-4 border border-gray-100 sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.myKits}</h3>
                  <div className="space-y-2">
                    {purchases.map((kitSlug) => {
                      const kit = getLocalizedKit(kitsData[kitSlug], language);
                      if (!kit) return null;
                      const progressPercent = getKitProgress(kitSlug);
                      return (
                        <button key={kitSlug} onClick={() => setSelectedKit(kitSlug)} className={`w-full text-left p-3 rounded-lg transition-all ${selectedKit === kitSlug ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <Image src={kit.image} alt={kit.title} width={32} height={32} />
                            <div>
                              <div className="font-medium text-gray-900 text-sm" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{kit.title}</div>
                              <div className="text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{kit.ageRange}</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${progressPercent}%`, backgroundColor: '#4B8481' }} />
                          </div>
                          <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{progressPercent}% {copy.complete}</div>
                        </button>
                      );
                    })}
                  </div>
                  <Link href="/activate" className="block mt-4 text-center py-3 border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    {copy.activateAnother}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-3">
                {localizedCurrentKit && (
                  <>
                    {(() => {
                      const availableVideoIds = localizedCurrentKit.videos.filter((video) => video.youtubeId).map((video) => video.id);
                      const watchedAvailableVideos = (progress[selectedKit]?.watchedVideos || []).filter((videoId) => availableVideoIds.includes(videoId)).length;
                      return (
                    <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                      <div className="flex items-center gap-4">
                        <Image src={localizedCurrentKit.image} alt={localizedCurrentKit.title} width={64} height={64} />
                        <div>
                          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{localizedCurrentKit.title} {copy.tutorialsSuffix}</h2>
                          <p className="text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{availableVideoIds.length} {language === 'mn' ? 'видео' : 'videos'} • {watchedAvailableVideos} {copy.complete}</p>
                        </div>
                      </div>
                    </div>
                      );
                    })()}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localizedCurrentKit.videos.map((video, index) => {
                        const watched = isVideoWatched(video.id);
                        const isAvailable = Boolean(video.youtubeId);
                        return (
                          <div key={video.id} onClick={() => handleWatchVideo(video)} className={`bg-white rounded-xl overflow-hidden border transition-all ${isAvailable ? 'cursor-pointer hover:shadow-md' : 'cursor-default opacity-75'} ${watched ? 'border-green-200' : 'border-gray-100'}`}>
                            <div className="relative aspect-video overflow-hidden bg-gray-950">
                              {isAvailable ? (
                                <img
                                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                                  alt=""
                                  className="h-full w-full object-cover opacity-90 transition-transform duration-300 hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-900 text-sm font-semibold text-white/80" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                                  Coming soon
                                </div>
                              )}
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{video.duration}</div>
                              {watched && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                  {copy.done}
                                </div>
                              )}
                              {isAvailable && <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                  <svg className="w-5 h-5 ml-1" style={{ color: '#4B8481' }} fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                                </div>
                              </div>}
                            </div>
                            <div className="p-4">
                              <div className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.video} {index + 1}</div>
                              <h3 className="font-medium text-gray-900 mb-1" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{video.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{video.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {showVideoModal && selectedVideo && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden">
              <div className="aspect-video bg-gray-950">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{selectedVideo.title}</h3>
                <p className="text-gray-600 mb-6" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{selectedVideo.description}</p>
                <div className="flex justify-between items-center">
                  <button onClick={() => { setShowVideoModal(false); setSelectedVideo(null); }} className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                    {t.common.close}
                  </button>
                  {!isVideoWatched(selectedVideo.id) ? (
                    <button onClick={handleVideoComplete} className="px-6 py-3 text-white rounded-lg font-medium flex items-center gap-2" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {copy.markComplete}
                    </button>
                  ) : (
                    <span className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium flex items-center gap-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {t.common.completed}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
