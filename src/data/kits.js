export const kitsData = {
  core: {
    id: 'core',
    slug: 'core',
    title: 'STEAM Core Set',
    subtitle: 'One premium set, three focused learning sections',
    ageRange: 'Ages 6-14',
    description: 'A refined all-in-one STEAM set built for practical learning at home, in classrooms, and in after-school programs.',
    longDescription: `The STEAM Core Set brings our strongest learning format into one polished package. Instead of splitting the experience across multiple tiers, the set is organized into three clear sections: Discover, Build, and Apply.\n\nEach section is designed to help learners move from guided exploration into confident hands-on problem solving. Families and educators get a cleaner path, stronger progression, and less setup friction.\n\nEvery box includes structured activities, guided video lessons, and a professional activation flow for unlocking the full digital learning library.`,
    features: [
      'Three structured learning sections: Discover, Build, and Apply',
      'Hands-on experiments with guided video instruction',
      'One streamlined activation and progress tracking experience'
    ],
    sections: [
      {
        title: 'Discover',
        description: 'Core concepts, observation, and guided experimentation to build confidence fast.'
      },
      {
        title: 'Build',
        description: 'Practical projects that turn ideas into working models and repeatable outcomes.'
      },
      {
        title: 'Apply',
        description: 'Open-ended challenges that strengthen reasoning, creativity, and real-world thinking.'
      }
    ],
    image: '/element2.svg',
    stats: { projects: '36', rating: '4.9', students: '12,000+' },
    floatingBadges: [
      { emoji: 'Lab', text: 'Structured Learning', position: 'top-left' },
      { emoji: 'Play', text: 'Video Guided', position: 'bottom-right' }
    ],
    activationCodes: ['CORE-2026-PRO1'],
    experiments: [
      { id: 'core-1', title: "Don't Stop 'Til You Get Enough", description: 'A high-energy rhythm warmup for the first guided video.', duration: '04 mins', difficulty: 'Easy', videoId: 'core-color-reaction', thumbnail: '01' },
      { id: 'core-2', title: 'ABC', description: 'A bright Jackson 5 classic for the second guided video.', duration: '03 mins', difficulty: 'Easy', videoId: 'core-magnetic-build', thumbnail: '02' },
      { id: 'core-3', title: 'Bad', description: 'The remastered Michael Jackson performance slot.', duration: '04 mins', difficulty: 'Medium', videoId: 'core-motion-system', thumbnail: '03' },
      { id: 'core-4', title: 'You Rock My World', description: 'A polished long-form music video for the final slot.', duration: '13 mins', difficulty: 'Medium', videoId: 'core-problem-solving', thumbnail: '04' }
    ],
    videos: [
      { id: 'core-color-reaction', title: "Michael Jackson - Don't Stop 'Til You Get Enough", youtubeId: 'yURRmWtbTbo', duration: '04:14', description: 'Official upscaled music video.', experimentId: 'core-1' },
      { id: 'core-magnetic-build', title: 'The Jackson 5 - ABC', youtubeId: 'ho7796-au8U', duration: '02:54', description: 'Classic Jackson 5 performance video.', experimentId: 'core-2' },
      { id: 'core-motion-system', title: 'Michael Jackson - Bad', youtubeId: 'Sd4SJVsTulc', duration: '04:20', description: 'Official remastered music video.', experimentId: 'core-3' },
      { id: 'core-problem-solving', title: 'Michael Jackson - You Rock My World', youtubeId: '1-7ABIM2qjU', duration: '13:33', description: 'Official long-form music video.', experimentId: 'core-4' }
    ]
  }
};

export const validateActivationCode = (code) => {
  const normalizeCode = (value) => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const normalizedCode = normalizeCode(code);
  for (const [slug, kit] of Object.entries(kitsData)) {
    const hasMatch = kit.activationCodes.some((activationCode) => normalizeCode(activationCode) === normalizedCode);
    if (hasMatch) {
      return { valid: true, kitSlug: slug, kitTitle: kit.title };
    }
  }
  return { valid: false, kitSlug: null, kitTitle: null };
};

export const getKitBySlug = (slug) => kitsData[slug] || null;
export const getAllKits = () => Object.values(kitsData);
