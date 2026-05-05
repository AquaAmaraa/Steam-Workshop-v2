import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { kitsData } from '../data/kits';
import { clearClientSession, getStoredUser } from '../lib/clientCookies';
import { fetchMongoUserData, patchMongoUserData, persistLocalUserData } from '../lib/userDataClient';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [progress, setProgress] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileUploading, setProfileUploading] = useState(false);

  const renderIcon = (type, className = 'w-5 h-5') => {
    const common = { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' };
    if (type === 'kit') {
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>;
    }
    if (type === 'experiment') {
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 2v6l-4 7a4 4 0 003.5 6h5a4 4 0 003.5-6l-4-7V2m-4 0h4m-3 12h2" /></svg>;
    }
    if (type === 'video') {
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>;
    }
    if (type === 'learn') {
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 8.897 5 7 5c-1.92 0-3.783.49-5 1.253v13C3.217 18.49 5.08 18 7 18c1.897 0 3.832.477 5 1.253m0-13C13.168 5.477 15.103 5 17 5c1.92 0 3.783.49 5 1.253v13C20.783 18.49 18.92 18 17 18c-1.897 0-3.832.477-5 1.253" /></svg>;
    }
    if (type === 'key') {
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;
    }
    if (type === 'shop') {
      return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18l-2 11H5L3 7zm3-3h12l1 3H5l1-3z" /></svg>;
    }
    return null;
  };

  const copy = language === 'mn'
    ? {
        pageTitle: 'Хяналтын самбар - STEAM Workshop',
        welcome: 'Буцаад тавтай морил,',
        subtitle: 'Сургалтын ахицаа хянаж, багцуудаа удирдаарай',
        imageFileError: 'Зөвхөн зураг сонгоно уу.',
        imageTooLarge: 'Зураг хэт том байна. 512KB-аас бага зураг ашиглана уу.',
        uploading: 'Оруулж байна...',
        profileUpdated: 'Профайл зураг шинэчлэгдлээ.',
        profileUpdateFailed: 'Профайл зургийг шинэчилж чадсангүй.',
        profilePicture: 'Профайл зураг',
        uploadHint: 'JPG/PNG зураг оруулна уу (дээд хэмжээ 512KB)',
        changePicture: 'Зураг солих',
        stats: {
          kitsActivated: 'Идэвхжүүлсэн багц',
          experimentsDone: 'Дууссан туршилт',
          videosWatched: 'Үзсэн видео',
        },
        tabs: { overview: 'Тойм', experiments: 'Туршилтууд' },
        myKits: 'Миний багцууд',
        noKits: 'Одоогоор идэвхжүүлсэн багц алга',
        activateKit: 'Багц идэвхжүүлэх',
        kitLabel: 'багц',
        experimentsLabel: 'туршилт',
        continue: 'Үргэлжлүүлэх',
        videosCompleted: 'видео үзсэн',
        quickActions: 'Шуурхай үйлдлүүд',
        continueLearning: 'Сургалтаа үргэлжлүүлэх',
        continueLearningDesc: 'Зогссон газраасаа үргэлжлүүлээрэй',
        activateNewKit: 'Шинэ багц идэвхжүүлэх',
        activateNewKitDesc: 'Идэвхжүүлэх кодоо оруулна уу',
        browseKits: 'Багцуудыг үзэх',
        browseKitsDesc: 'Манай цуглуулгыг сонирхоорой',
        activateToTrack: 'Туршилтаа хянахын тулд багцаа идэвхжүүлнэ үү',
        videoLessons: 'Видео хичээлүүд',
        videoLessonsDesc: 'YouTube-ээс шууд тоглуулах 4 жишээ видео.',
      }
    : {
        pageTitle: 'Dashboard - STEAM Workshop',
        welcome: 'Welcome back,',
        subtitle: 'Track your learning progress and manage your kits',
        imageFileError: 'Please choose an image file.',
        imageTooLarge: 'Image is too large. Use an image under 512KB.',
        uploading: 'Uploading...',
        profileUpdated: 'Profile picture updated.',
        profileUpdateFailed: 'Failed to update profile picture.',
        profilePicture: 'Profile picture',
        uploadHint: 'Upload a JPG/PNG image (max 512KB)',
        changePicture: 'Change Picture',
        stats: {
          kitsActivated: 'Kits Activated',
          experimentsDone: 'Experiments Done',
          videosWatched: 'Videos Watched',
        },
        tabs: { overview: 'Overview', experiments: 'Experiments' },
        myKits: 'My Kits',
        noKits: 'No kits activated yet',
        activateKit: 'Activate a Kit',
        kitLabel: 'Kit',
        experimentsLabel: 'experiments',
        continue: 'Continue',
        videosCompleted: 'videos completed',
        quickActions: 'Quick Actions',
        continueLearning: 'Continue Learning',
        continueLearningDesc: 'Pick up where you left off',
        activateNewKit: 'Activate New Kit',
        activateNewKitDesc: 'Enter your activation code',
        browseKits: 'Browse Kits',
        browseKitsDesc: 'Explore our collection',
        activateToTrack: 'Activate a kit to start tracking experiments',
        videoLessons: 'Video Lessons',
        videoLessonsDesc: 'Four playable YouTube lessons you can replace with your own links.',
      };

  useEffect(() => {
    const loadDashboardData = async () => {
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
      } catch (error) {
        console.error('Failed to load Mongo user data:', error);
        await clearClientSession();
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await clearClientSession();
    router.push('/');
  };

  const getKitProgress = (kitSlug) => {
    const kit = kitsData[kitSlug];
    if (!kit || !progress[kitSlug]) return { percent: 0, watched: 0, total: 0 };
    const totalVideos = kit.videos.length;
    const watchedVideos = progress[kitSlug]?.watchedVideos?.length || 0;
    return { percent: Math.round((watchedVideos / totalVideos) * 100), watched: watchedVideos, total: totalVideos };
  };

  const getTotalStats = () => {
    let totalExperiments = 0;
    let completedExperiments = 0;
    let totalVideos = 0;
    let watchedVideos = 0;

    purchases.forEach((kitSlug) => {
      const kit = kitsData[kitSlug];
      if (kit) {
        totalExperiments += kit.experiments.length;
        totalVideos += kit.videos.length;
        completedExperiments += progress[kitSlug]?.completedExperiments?.length || 0;
        watchedVideos += progress[kitSlug]?.watchedVideos?.length || 0;
      }
    });

    return { totalExperiments, completedExperiments, totalVideos, watchedVideos };
  };

  const isExperimentDone = (kitSlug, experimentId) => progress[kitSlug]?.completedExperiments?.includes(experimentId) || false;

  const toggleExperimentDone = (kitSlug, experimentId) => {
    const newProgress = { ...progress };
    if (!newProgress[kitSlug]) newProgress[kitSlug] = { watchedVideos: [], completedExperiments: [] };
    if (newProgress[kitSlug].completedExperiments.includes(experimentId)) {
      newProgress[kitSlug].completedExperiments = newProgress[kitSlug].completedExperiments.filter((id) => id !== experimentId);
    } else {
      newProgress[kitSlug].completedExperiments.push(experimentId);
    }

    setProgress(newProgress);

    patchMongoUserData({ kitProgress: newProgress })
      .then((serverData) => {
        persistLocalUserData(serverData);
        setUser((current) => ({ ...(current || {}), ...(serverData.user || {}) }));
        setProgress(serverData.kitProgress || newProgress);
      })
      .catch((error) => {
        console.error('Failed to save experiment progress:', error);
      });
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileMessage(copy.imageFileError);
      return;
    }

    if (file.size > 512 * 1024) {
      setProfileMessage(copy.imageTooLarge);
      return;
    }

    setProfileUploading(true);
    setProfileMessage('');

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const serverData = await patchMongoUserData({ profilePicture: dataUrl });
      persistLocalUserData(serverData);
      setUser(serverData.user);
      setProfileMessage(copy.profileUpdated);
    } catch (error) {
      console.error('Profile picture update failed:', error);
      setProfileMessage(copy.profileUpdateFailed);
    } finally {
      setProfileUploading(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#4B8481', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  const stats = getTotalStats();
  const dashboardVideos = (purchases.length > 0 ? purchases : ['core'])
    .flatMap((kitSlug) => (kitsData[kitSlug]?.videos || []).map((video) => ({ ...video, kitTitle: kitsData[kitSlug].title })))
    .slice(0, 4);

  return (
    <>
      <Head>
        <title>{copy.pageTitle}</title>
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/fox.svg" alt="Logo" width={36} height={36} />
                <span className="text-xl font-bold" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>STEAM Workshop</span>
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/learn" className="text-gray-600 hover:text-gray-900 font-medium hidden sm:block" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{t.common.myLearning}</Link>
                <Link href="/activate" className="text-gray-600 hover:text-gray-900 font-medium hidden sm:block" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.activateKit}</Link>
                <div className="flex items-center gap-3">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#4B8481' }}>
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.welcome} {user?.username}
            </h1>
            <p className="text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: '#4B8481' }}>
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.profilePicture}</p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.uploadHint}</p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <label className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  {profileUploading ? copy.uploading : copy.changePicture}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                    disabled={profileUploading}
                  />
                </label>
              </div>
            </div>
            {profileMessage && (
              <p className="mt-3 text-sm text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                {profileMessage}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { label: copy.stats.kitsActivated, value: purchases.length, icon: 'kit' },
              { label: copy.stats.experimentsDone, value: `${stats.completedExperiments}/${stats.totalExperiments}`, icon: 'experiment' },
              { label: copy.stats.videosWatched, value: `${stats.watchedVideos}/${stats.totalVideos}`, icon: 'video' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="mb-2 inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#4B8481] bg-[#e8f4f4]">
                  {renderIcon(stat.icon)}
                </div>
                <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{stat.value}</div>
                <div className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {dashboardVideos.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.videoLessons}</h2>
                  <p className="text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.videoLessonsDesc}</p>
                </div>
                <Link href="/learn" className="text-sm font-bold text-[#4B8481] hover:text-[#3f706d]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.continueLearning}</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {dashboardVideos.map((video) => (
                  <article key={video.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="aspect-video bg-gray-950">
                      <iframe
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{video.kitTitle}</p>
                      <h3 className="mt-1 text-base font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{video.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{video.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <div className="flex gap-4 border-b border-gray-200 mb-8">
            {['overview', 'experiments'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 font-medium relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`} style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                {tab === 'overview' ? copy.tabs.overview : copy.tabs.experiments}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#4B8481' }} />}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.myKits}</h2>
                  {purchases.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-[#e8f4f4] text-[#4B8481] mx-auto mb-4 flex items-center justify-center">
                        {renderIcon('kit', 'w-8 h-8')}
                      </div>
                      <p className="text-gray-600 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.noKits}</p>
                      <Link href="/activate" className="inline-block px-6 py-3 text-white rounded-lg font-medium" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.activateKit}</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchases.map((kitSlug) => {
                        const kit = kitsData[kitSlug];
                        if (!kit) return null;
                        const prog = getKitProgress(kitSlug);
                        return (
                          <div key={kitSlug} className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
                            <div className="flex items-center gap-4 mb-4">
                              <Image src={kit.image} alt={kit.title} width={48} height={48} />
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{kit.title} {copy.kitLabel}</h3>
                                <p className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{kit.experiments.length} {copy.experimentsLabel}</p>
                              </div>
                              <Link href="/learn" className="px-4 py-2 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.continue}</Link>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="h-2 rounded-full transition-all" style={{ width: `${prog.percent}%`, backgroundColor: prog.percent === 100 ? '#22c55e' : '#4B8481' }} />
                            </div>
                            <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{prog.watched}/{prog.total} {copy.videosCompleted}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.quickActions}</h2>
                  <div className="space-y-3">
                    <Link href="/learn" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e8f4f4' }}>
                        <span className="text-[#4B8481]">{renderIcon('learn')}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.continueLearning}</p>
                        <p className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.continueLearningDesc}</p>
                      </div>
                    </Link>
                    <Link href="/activate" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                        <span className="text-amber-700">{renderIcon('key')}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.activateNewKit}</p>
                        <p className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.activateNewKitDesc}</p>
                      </div>
                    </Link>
                    <Link href="/#kits" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                        <span className="text-green-700">{renderIcon('shop')}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.browseKits}</p>
                        <p className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.browseKitsDesc}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experiments' && (
            <div className="space-y-8">
              {purchases.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-[#e8f4f4] text-[#4B8481] mx-auto mb-4 flex items-center justify-center">
                    {renderIcon('experiment', 'w-8 h-8')}
                  </div>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.activateToTrack}</p>
                  <Link href="/activate" className="inline-block px-6 py-3 text-white rounded-lg font-medium" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.activateKit}</Link>
                </div>
              ) : (
                purchases.map((kitSlug) => {
                  const kit = kitsData[kitSlug];
                  if (!kit) return null;
                  return (
                    <div key={kitSlug} className="bg-white rounded-xl p-6 border border-gray-100">
                      <div className="flex items-center gap-4 mb-6">
                        <Image src={kit.image} alt={kit.title} width={40} height={40} />
                        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{kit.title} {copy.kitLabel}</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {kit.experiments.map((exp) => {
                          const isDone = isExperimentDone(kitSlug, exp.id);
                          return (
                            <div key={exp.id} className={`border rounded-xl p-4 ${isDone ? 'bg-green-50 border-green-200' : 'border-gray-100'}`}>
                              <div className="flex items-start justify-between mb-3">
                                <span className="text-2xl">{exp.thumbnail}</span>
                                <button onClick={() => toggleExperimentDone(kitSlug, exp.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-gray-400'}`}>
                                  {isDone && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                </button>
                              </div>
                              <h3 className={`font-medium mb-1 ${isDone ? 'text-green-700' : 'text-gray-900'}`} style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{exp.title}</h3>
                              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{exp.description}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                                <span>{exp.duration}</span>
                                <span className={`px-2 py-0.5 rounded-full ${exp.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : exp.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>{exp.difficulty}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
