import KitCard from './KitCard';
import { getAllKits } from '../data/kits';
import { getLocalizedKit } from '../data/kitsLocale';
import { useLanguage } from '../context/LanguageContext';
import { KeyRound } from 'lucide-react';

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
    <section id="kits" className="relative bg-[#fafbfc] py-20 lg:py-28">
      <div className="mx-auto mb-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-[#cfe4e2] to-transparent" />
      </div>
      <div className="space-y-0">
        <KitCard
          {...featuredKit}
          reverse={false}
          ctaLearnMore={copy.learnMore}
          ctaViewSamples={copy.viewSamples}
          labels={{ projects: copy.projects, rating: copy.rating, students: copy.students }}
        />
      </div>

      <div className="mx-auto mt-12 max-w-5xl px-4 text-center sm:px-6">
        <div className="rounded-[2rem] border border-[#d7e9e7] bg-white p-8 shadow-xl shadow-[#4B8481]/10 sm:p-12">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f4f4] text-[#4B8481]">
            <KeyRound className="h-6 w-6" />
          </div>
          <h3 className="mb-4 text-3xl font-extrabold text-gray-950 sm:text-4xl" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {copy.bottomTitle}
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-lg leading-8 text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {copy.bottomDesc}
          </p>
          <a href="/activate" className="inline-flex items-center gap-2 rounded-lg bg-[#4B8481] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#3f706d]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            <KeyRound className="h-5 w-5" />
            {copy.bottomCta}
          </a>
        </div>
      </div>
    </section>
  );
}
