import Image from 'next/image';
import { ArrowRight, CheckCircle2, KeyRound, ShieldCheck, Video } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { language } = useLanguage();
  const copy = language === 'mn'
    ? {
        eyebrow: 'STEAM Workshop Core Set',
        title: 'Нэг багц. Илүү цэгцтэй сургалтын туршлага.',
        desc: 'Гэр бүл, багш, сургалтын төвд зориулсан практик STEAM багц. Идэвхжүүлээд видео сан, туршилтын ахиц, суралцах дарааллаа нэг дор удирдана.',
        cta1: 'Багцыг үзэх',
        cta2: 'Багцаа идэвхжүүлэх',
        safe: 'Аюулгүй материал',
        guided: 'Видео заавар',
        access: 'Кодоор нээгдэнэ',
        sections: ['Discover', 'Build', 'Apply'],
      }
    : {
        eyebrow: 'STEAM Workshop Core Set',
        title: 'A cleaner, more focused STEAM learning experience.',
        desc: 'A premium single-set program for families, classrooms, and after-school learning. Activate once, unlock guided videos, track progress, and keep every activity organized.',
        cta1: 'View The Set',
        cta2: 'Activate Set',
        safe: 'Safe materials',
        guided: 'Guided videos',
        access: 'Code access',
        sections: ['Discover', 'Build', 'Apply'],
      };

  return (
    <section className="relative overflow-hidden bg-[#f7fbfb] pt-24 lg:pt-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b8d8d6] to-transparent" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cfe4e2] bg-white px-4 py-2 text-sm font-bold text-[#4B8481] shadow-sm" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            <ShieldCheck className="h-4 w-4" />
            {copy.eyebrow}
          </div>

          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-normal text-gray-950 sm:text-6xl lg:text-7xl" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {copy.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {copy.desc}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#kits" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4B8481] px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-[#3f706d]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.cta1}
              <ArrowRight className="h-5 w-5" />
            </a>
            <a href="/activate" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#cfe4e2] bg-white px-6 py-3.5 text-base font-bold text-[#315f5d] shadow-sm transition hover:border-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              <KeyRound className="h-5 w-5" />
              {copy.cta2}
            </a>
          </div>

        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-[#d7e9e7] bg-white p-4 shadow-2xl shadow-[#4B8481]/10">
            <div className="rounded-[1.5rem] bg-[#e8f4f4] p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>Core Set</p>
                  <p className="mt-1 text-2xl font-extrabold text-gray-950" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>Discover. Build. Apply.</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#4B8481] shadow-sm" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>Ages 6-14</div>
              </div>

              <div className="mt-8 flex aspect-square items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
                <Image src="/element2.svg" alt="STEAM Core Set" width={360} height={360} priority className="h-auto w-full max-w-sm" />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[copy.safe, copy.guided, copy.access].map((item, index) => (
                  <div key={item} className="rounded-xl bg-white p-4 shadow-sm">
                    {index === 1 ? <Video className="mb-3 h-5 w-5 text-[#4B8481]" /> : <CheckCircle2 className="mb-3 h-5 w-5 text-[#4B8481]" />}
                    <p className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {copy.sections.map((section) => (
              <div key={section} className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                <p className="font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{section}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
