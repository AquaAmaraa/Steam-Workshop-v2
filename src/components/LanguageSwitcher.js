import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-gray-200 bg-white p-1 ${compact ? '' : 'shadow-sm'}`}
      aria-label={t.common.language}
      role="group"
    >
      {[
        { key: 'en', label: 'EN' },
        { key: 'mn', label: 'MN' },
      ].map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => setLanguage(option.key)}
          className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            language === option.key ? 'text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
          style={{
            backgroundColor: language === option.key ? '#4B8481' : 'transparent',
            fontFamily: "'Baloo 2', 'Noto Sans', sans-serif",
          }}
          aria-pressed={language === option.key}
          title={option.key === 'en' ? t.common.english : t.common.mongolian}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}


