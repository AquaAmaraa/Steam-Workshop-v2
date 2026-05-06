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
      { id: 'core-1', title: 'Guided Video 1', description: 'First guided video for the STEAM Core Set.', duration: 'Video', difficulty: 'Easy', videoId: 'core-color-reaction', thumbnail: '01' },
      { id: 'core-2', title: 'Guided Video 2', description: 'Second guided video for the STEAM Core Set.', duration: 'Video', difficulty: 'Easy', videoId: 'core-magnetic-build', thumbnail: '02' },
      { id: 'core-3', title: 'Guided Video 3', description: 'Third guided video for the STEAM Core Set.', duration: 'Video', difficulty: 'Medium', videoId: 'core-motion-system', thumbnail: '03' },
      { id: 'core-4', title: 'Guided Video 4', description: 'Fourth guided video for the STEAM Core Set.', duration: 'Video', difficulty: 'Medium', videoId: 'core-problem-solving', thumbnail: '04' },
      { id: 'core-5', title: 'Guided Video 5', description: 'This video slot will be added later.', duration: 'Coming soon', difficulty: 'Easy', videoId: 'core-pyt', thumbnail: '05' },
      { id: 'core-6', title: 'Guided Video 6', description: 'This video slot will be added later.', duration: 'Coming soon', difficulty: 'Easy', videoId: 'core-rock-with-you', thumbnail: '06' },
      { id: 'core-7', title: 'Guided Video 7', description: 'This video slot will be added later.', duration: 'Coming soon', difficulty: 'Medium', videoId: 'core-chicago', thumbnail: '07' },
      { id: 'core-8', title: 'Guided Video 8', description: 'This video slot will be added later.', duration: 'Coming soon', difficulty: 'Easy', videoId: 'core-human-nature', thumbnail: '08' }
    ],
    videos: [
      { id: 'core-color-reaction', title: 'STEAM Core Video 1', youtubeId: 'sowfpS3vL-A', duration: 'Video', description: 'Guided video for the STEAM Core Set.', experimentId: 'core-1' },
      { id: 'core-magnetic-build', title: 'STEAM Core Video 2', youtubeId: '0LiwcbXCry8', duration: 'Video', description: 'Guided video for the STEAM Core Set.', experimentId: 'core-2' },
      { id: 'core-motion-system', title: 'STEAM Core Video 3', youtubeId: 'lmeVwLmZ9b4', duration: 'Video', description: 'Guided video for the STEAM Core Set.', experimentId: 'core-3' },
      { id: 'core-problem-solving', title: 'STEAM Core Video 4', youtubeId: 'cv1RqBcvzvc', duration: 'Video', description: 'Guided video for the STEAM Core Set.', experimentId: 'core-4' },
      { id: 'core-pyt', title: 'STEAM Core Video 5', youtubeId: '', duration: 'Coming soon', description: 'This video slot will be added later.', experimentId: 'core-5' },
      { id: 'core-rock-with-you', title: 'STEAM Core Video 6', youtubeId: '', duration: 'Coming soon', description: 'This video slot will be added later.', experimentId: 'core-6' },
      { id: 'core-chicago', title: 'STEAM Core Video 7', youtubeId: '', duration: 'Coming soon', description: 'This video slot will be added later.', experimentId: 'core-7' },
      { id: 'core-human-nature', title: 'STEAM Core Video 8', youtubeId: '', duration: 'Coming soon', description: 'This video slot will be added later.', experimentId: 'core-8' }
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
