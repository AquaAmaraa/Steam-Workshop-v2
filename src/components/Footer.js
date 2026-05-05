import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  const copy = language === 'mn'
    ? {
        tagline: 'Хүүхэд бүрт STEAM боловсролыг хүртээмжтэй, сонирхолтой болгоно.',
        kits: 'Манай багцууд',
        company: 'Компани',
        support: 'Тусламж',
        about: 'Бидний тухай',
        reviews: 'Сэтгэгдэл',
        contact: 'Холбоо барих',
        activate: 'Багц идэвхжүүлэх',
        help: 'Тусламжийн төв',
        rights: 'Бүх эрх хуулиар хамгаалагдсан.',
        privacy: 'Нууцлалын бодлого',
        terms: 'Үйлчилгээний нөхцөл',
      }
    : {
        tagline: 'Making STEAM education fun and accessible for kids everywhere.',
        kits: 'Featured Set',
        company: 'Company',
        support: 'Support',
        about: 'About Us',
        reviews: 'Reviews',
        contact: 'Contact',
        activate: 'Activate Kit',
        help: 'Help Center',
        rights: 'All rights reserved.',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
      };
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/fox.svg" alt="Logo" width={32} height={32} />
              <span className="text-lg font-bold" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>STEAM Workshop</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.tagline}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.kits}</h4>
            <ul className="space-y-3">
              <li><Link href="/kit/core" className="text-gray-600 hover:text-gray-900 text-sm transition-colors" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>STEAM Core Set</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.company}</h4>
            <ul className="space-y-3">
              <li><Link href="/#contact" className="text-gray-600 hover:text-gray-900 text-sm transition-colors" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.support}</h4>
            <ul className="space-y-3">
              <li><Link href="/activate" className="text-gray-600 hover:text-gray-900 text-sm transition-colors" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.activate}</Link></li>
              <li><a href="mailto:Steamworkshop.kids@outlook.com" className="text-gray-600 hover:text-gray-900 text-sm transition-colors" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.help}</a></li>
              <li><a href="tel:+97699224146" className="text-gray-600 hover:text-gray-900 text-sm transition-colors" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>+976 99224146</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {new Date().getFullYear()} STEAM Workshop. {copy.rights}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.privacy}</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.terms}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

