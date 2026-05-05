import KitCard from './KitCard';
import { getAllKits } from '../data/kits';
import { getLocalizedKit } from '../data/kitsLocale';
import { useLanguage } from '../context/LanguageContext';

export default function KitsSection() {
  const { language } = useLanguage();
  const featuredKit = getLocalizedKit(getAllKits()[0], language);

  const copy = language === 'mn'
    ? {
        bottomTitle: 'Багцаа нээхэд бэлэн үү?',
        bottomDesc: 'Идэвхжүүлэх кодоо оруулаад бүх видео хичээл болон сургалтын материалыг нээгээрэй.',
        bottomCta: 'Багцаа идэвхжүүлэх',
        learnMore: 'Дэлгэрэнгүй',
        viewSamples: 'Бүтцийг үзэх',
        projects: 'Төслүүд',
        rating: 'Үнэлгээ',
        students: 'Сурагчид',
      }
    : {
        bottomTitle: 'Ready to unlock your set?',
        bottomDesc: 'Enter your activation code to open the full lesson library and begin the guided experience.',
        bottomCta: 'Activate Your Set',
        learnMore: 'Learn More',
        viewSamples: 'View Structure',
        projects: 'Projects',
        rating: 'Rating',
        students: 'Students',
      };

  return (
    <section id="kits" className="relative py-20 lg:py-28" style={{ background: '#fafbfc' }}>
      <div className="space-y-0">
        <KitCard
          {...featuredKit}
          reverse={false}
          ctaLearnMore={copy.learnMore}
          ctaViewSamples={copy.viewSamples}
          labels={{ projects: copy.projects, rating: copy.rating, students: copy.students }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 text-center">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {copy.bottomTitle}
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {copy.bottomDesc}
          </p>
          <a href="/activate" className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            {copy.bottomCta}
          </a>
        </div>
      </div>
    </section>
  );
}
