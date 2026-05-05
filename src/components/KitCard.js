import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Eye, PackageCheck } from 'lucide-react';

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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
        <div className={`relative flex items-center justify-center ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="relative w-full max-w-lg">
            {!hideBackground && <div className="absolute inset-4 rounded-[2rem] bg-[#dcefed]" />}

            <div className="relative rounded-[2rem] border border-[#d7e9e7] bg-white p-8 shadow-xl shadow-[#4B8481]/10 sm:p-12">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e8f4f4] px-3 py-1 text-sm font-bold text-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                <PackageCheck className="h-4 w-4" />
                Core Set
              </div>
              <Image src={image} alt={`${title} Kit`} width={320} height={320} className="mx-auto h-auto w-56 sm:w-72" />
            </div>

            {floatingBadges.map((badge, i) => (
              <div
                key={i}
                className={`absolute ${floatingPositions[badge.position]} z-10 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg sm:px-4`}
              >
                <span className="text-sm font-black text-[#4B8481]">{badge.emoji}</span>
                <span className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{badge.text}</span>
              </div>
            ))}

            {stats.rating && (
              <div className="absolute -bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{stats.projects}</div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{labels.projects}</div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-lg font-bold text-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{stats.rating}</div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{labels.rating}</div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{stats.students}</div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{labels.students}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`${reverse ? 'lg:order-1' : 'lg:order-2'} mt-8 lg:mt-0`}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cfe4e2] bg-white px-4 py-2 text-sm font-bold text-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {ageRange}
          </div>

          <h3 className="mb-3 text-4xl font-extrabold leading-tight text-gray-950 sm:text-5xl" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {title}
            <span className="mt-2 block text-xl font-semibold text-[#4B8481] sm:text-2xl">{subtitle}</span>
          </h3>

          <p className="mb-8 max-w-xl text-lg leading-8 text-gray-600" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
            {description}
          </p>

          <div className="mb-8">
            <ul className="grid gap-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#4B8481]">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/kit/${slug}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4B8481] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#3f706d]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {ctaLearnMore}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={`/kit/${slug}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition hover:border-[#4B8481] hover:text-[#4B8481]" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              <Eye className="h-4 w-4" />
              {ctaViewSamples}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
