import Link from 'next/link';
import Image from 'next/image';

export default function KitCard({ 
  title,
  subtitle,
  ageRange, 
  description, 
  features, 
  image, 
  floatingBadges = [],
  stats = {},
  reverse = false,
  hideBackground = false,
  slug,
  ctaLearnMore = 'Learn More',
  ctaViewSamples = 'View Samples',
  labels = { projects: 'Projects', rating: 'Rating', students: 'Students' }
}) {
  const floatingPositions = {
    'top-left': '-top-3 -left-3 sm:top-0 sm:left-0',
    'top-right': '-top-3 -right-3 sm:top-0 sm:right-0',
    'bottom-left': '-bottom-3 -left-3 sm:bottom-8 sm:left-0',
    'bottom-right': '-bottom-3 -right-3 sm:bottom-8 sm:right-0',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Image Section */}
        <div className={`relative flex justify-center items-center ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="relative">
            {/* Background shape */}
            {!hideBackground && (
              <div className="absolute inset-0 rounded-3xl transform rotate-3" style={{ backgroundColor: '#e8f4f4' }} />
            )}
            
            {/* Image container */}
            <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
              <Image src={image} alt={`${title} Kit`} width={320} height={320} className="w-48 sm:w-64 lg:w-72 h-auto mx-auto" />
            </div>

            {/* Floating badges */}
            {floatingBadges.map((badge, i) => (
              <div 
                key={i}
                className={`absolute ${floatingPositions[badge.position]} bg-white px-3 sm:px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 z-10`}
              >
                <span className="text-lg">{badge.emoji}</span>
                <span className="font-medium text-gray-700 text-sm" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{badge.text}</span>
              </div>
            ))}

            {/* Stats badge */}
            {stats.rating && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-4 z-10">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{stats.projects}</div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{labels.projects}</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{stats.rating}</div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{labels.rating}</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{stats.students}</div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{labels.students}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className={`${reverse ? 'lg:order-1' : 'lg:order-2'} mt-8 lg:mt-0`}>
          {/* Age badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#e8f4f4', color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {ageRange}
          </div>

          {/* Title */}
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {title}
            <span className="block text-xl sm:text-2xl font-normal text-gray-500 mt-1">{subtitle}</span>
          </h3>
          
          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {description}
          </p>
          
          {/* Features */}
          <div className="mb-8">
            <ul className="space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#4B8481' }}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/kit/${slug}`} className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-all" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {ctaLearnMore}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href={`/kit/${slug}`} className="inline-flex items-center justify-center gap-2 border-2 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb', color: '#374151', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {ctaViewSamples}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

