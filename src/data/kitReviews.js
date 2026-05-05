export const publicKitReviews = {
  kids: [
    {
      id: 'kids-public-1',
      user: 'Sarah M.',
      avatar: '👩‍🔬',
      text: {
        en: 'My kids absolutely loved this kit! The experiments are well designed and easy to follow.',
        mn: 'Манай хүүхдүүд энэ багцад маш их дуртай байсан. Туршилтууд нь ойлгомжтой, дагахад амархан.',
      },
      date: { en: '2 days ago', mn: '2 хоногийн өмнө' },
      likes: 12,
    },
    {
      id: 'kids-public-2',
      user: 'John D.',
      avatar: '👨‍🏫',
      text: {
        en: 'Great quality materials and helpful video tutorials. Highly recommended.',
        mn: 'Материалын чанар сайн, видео заавар нь их тус болдог. Санал болгох багц байна.',
      },
      date: { en: '1 week ago', mn: '1 долоо хоногийн өмнө' },
      likes: 8,
    },
  ],
  'pre-teen': [
    {
      id: 'preteen-public-1',
      user: 'Emma K.',
      avatar: '👩‍💼',
      text: {
        en: 'A strong next step after beginner kits. Projects are challenging but fun.',
        mn: 'Анхан шатны багцын дараагийн алхам болоход тохиромжтой. Төслүүд нь сорилттой мөртлөө сонирхолтой.',
      },
      date: { en: '5 days ago', mn: '5 хоногийн өмнө' },
      likes: 9,
    },
  ],
  teen: [
    {
      id: 'teen-public-1',
      user: 'Michael C.',
      avatar: '👨‍💻',
      text: {
        en: 'Excellent engineering-focused projects. My teen stayed engaged for weeks.',
        mn: 'Инженерчлэлд төвлөрсөн маш сайн төслүүдтэй. Манай өсвөр насны хүүхэд хэдэн долоо хоног идэвхтэй оролцсон.',
      },
      date: { en: '3 days ago', mn: '3 хоногийн өмнө' },
      likes: 15,
    },
  ],
};

export function getPublicKitReviews(slug) {
  return publicKitReviews[slug] || [];
}
