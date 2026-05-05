import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { language } = useLanguage();
  const copy = language === 'mn'
    ? {
        trust: 'Дэлхий даяарх 25,000+ гэр бүлийн сонголт',
        titleLine1: 'Шинжлэх ухаан',
        titleLine2: 'Бүтээлч сэтгэлгээтэй уулзах цэг',
        desc: 'Багш нарын боловсруулсан, хүүхдэд ээлтэй практик STEAM багц. Туршилт бүрээр шинжлэх ухаан, технологи, инженерчлэл, урлаг, математикийг алхам алхмаар судална.',
        cta1: 'Багцыг үзэх',
        cta2: 'Багцаа идэвхжүүлэх',
        reviews: '2,400+ сэтгэгдлээс',
        safe: 'Аюулгүй материал',
        guides: 'Видео заавар',
        experiments: 'Туршилт',
        award: 'Шагналт',
        winning: 'багц',
        tested: 'Аюулгүй, туршигдсан',
        scroll: 'Доош гүйлгээд үзээрэй',
      }
    : {
        trust: 'Trusted by 25,000+ families worldwide',
        titleLine1: 'Where Science Meets',
        titleLine2: 'Creative Discovery',
        desc: 'A more professional, single-set STEAM experience designed by educators. One box, three guided sections, and a clear path from exploration to application.',
        cta1: 'View The Set',
        cta2: 'Activate Set',
        reviews: 'from 2,400+ reviews',
        safe: 'Safe materials',
        guides: 'Video guides',
        experiments: 'Experiments',
        award: 'Award',
        winning: 'Winning Kits',
        tested: 'Safe & Tested',
        scroll: 'Scroll to explore',
      };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16" style={{ background: '#fafbfc' }}>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-1/2 h-full" style={{ background: 'linear-gradient(135deg, transparent 0%, #e8f4f4 100%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#e8f4f4', color: '#4B8481' }}>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {copy.trust}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.titleLine1}
              <span className="block" style={{ color: '#4B8481' }}>{copy.titleLine2}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href="#kits" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                {copy.cta1}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a href="/activate" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white rounded-lg font-semibold text-lg border-2 hover:bg-gray-50 transition-all" style={{ borderColor: '#4B8481', color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                {copy.cta2}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['👨‍🔬', '👩‍🏫', '👨‍💻', '👩‍🔬'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg border-2 border-white">{emoji}</div>
                  ))}
                </div>
                <div className="text-sm text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                  <span className="font-bold text-gray-900">4.9/5</span> {copy.reviews}
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-4 text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>{copy.safe}</span>
                <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>{copy.guides}</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#e8f4f4' }}>
                <div className="aspect-square flex items-center justify-center p-8">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image src="/element2.svg" alt="STEAM Core Set" width={350} height={350} className="relative z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-sm" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.scroll}</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
