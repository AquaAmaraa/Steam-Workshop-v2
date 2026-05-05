import { Mail, Phone, Clock, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ContactSection() {
  const { language } = useLanguage();

  const copy = language === 'mn'
    ? {
        eyebrow: 'Холбоо барих',
        title: 'Асуулт байвал шууд холбогдоорой',
        subtitle: 'Бид захиалга, хамтын ажиллагаа, сургалтын багцтай холбоотой мэдээллийг имэйл болон утсаар авч хариулна.',
        email: 'Имэйл',
        phone: 'Утас',
        hours: 'Хариу өгөх цаг',
        hoursValue: 'Ажлын өдрүүдэд 10:00-18:00',
        noteTitle: 'Хурдан зөвлөгөө хэрэгтэй юу?',
        note: 'Имэйл бичихдээ хүүхдийн нас, сонирхож буй багц, авах тоо хэмжээгээ оруулбал бид илүү хурдан зөв мэдээлэл өгнө.',
        emailAction: 'Имэйл бичих',
        phoneAction: 'Залгах',
      }
    : {
        eyebrow: 'Contact',
        title: 'Reach us directly',
        subtitle: 'For orders, partnerships, and kit questions, contact us by email or phone. No form, no waiting room.',
        email: 'Email',
        phone: 'Phone',
        hours: 'Reply hours',
        hoursValue: 'Weekdays, 10:00-18:00',
        noteTitle: 'Need a faster answer?',
        note: 'When emailing, include the learner age, the kit you are interested in, and the quantity so we can reply with the right details.',
        emailAction: 'Email us',
        phoneAction: 'Call now',
      };

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#eef7f6] to-white" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.eyebrow}
            </p>
            <h2 className="max-w-xl text-4xl font-extrabold leading-tight text-gray-950 lg:text-5xl" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="mailto:Steamworkshop.kids@outlook.com" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4B8481] px-5 py-3 font-bold text-white transition hover:bg-[#3f706d]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                <Mail className="h-5 w-5" />
                {copy.emailAction}
              </a>
              <a href="tel:+97699224146" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 font-bold text-gray-900 transition hover:border-[#4B8481] hover:text-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                <Phone className="h-5 w-5" />
                {copy.phoneAction}
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a href="mailto:Steamworkshop.kids@outlook.com" className="rounded-xl border border-gray-100 bg-[#f8fbfb] p-6 transition hover:border-[#4B8481] hover:bg-white">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#4B8481] shadow-sm">
                <Mail className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.email}</p>
              <p className="mt-2 break-words text-lg font-bold text-gray-950" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>Steamworkshop.kids@outlook.com</p>
            </a>

            <a href="tel:+97699224146" className="rounded-xl border border-gray-100 bg-[#f8fbfb] p-6 transition hover:border-[#4B8481] hover:bg-white">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#4B8481] shadow-sm">
                <Phone className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.phone}</p>
              <p className="mt-2 text-lg font-bold text-gray-950" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>+976 99224146</p>
            </a>

            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f4f4] text-[#4B8481]">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.hours}</p>
              <p className="mt-2 text-lg font-bold text-gray-950" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.hoursValue}</p>
            </div>

            <div className="rounded-xl bg-gray-950 p-6 text-white">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-white">
                <MessageCircle className="h-6 w-6" />
              </div>
              <p className="text-lg font-bold" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.noteTitle}</p>
              <p className="mt-2 text-sm leading-6 text-gray-300" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
