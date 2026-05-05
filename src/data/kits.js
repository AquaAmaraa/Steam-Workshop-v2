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
      { id: 'core-1', title: 'Color Reaction Lab', description: 'Observe and record controlled color-change reactions.', duration: '20 mins', difficulty: 'Easy', videoId: 'core-color-reaction', thumbnail: '01' },
      { id: 'core-2', title: 'Magnetic Build Challenge', description: 'Design a stable structure using magnetic components.', duration: '25 mins', difficulty: 'Medium', videoId: 'core-magnetic-build', thumbnail: '02' },
      { id: 'core-3', title: 'Simple Motion System', description: 'Assemble a moving mechanism and test performance.', duration: '35 mins', difficulty: 'Medium', videoId: 'core-motion-system', thumbnail: '03' },
      { id: 'core-4', title: 'Problem-Solving Sprint', description: 'Apply what you learned to complete a guided design challenge.', duration: '30 mins', difficulty: 'Hard', videoId: 'core-problem-solving', thumbnail: '04' }
    ],
    videos: [
      { id: 'core-color-reaction', title: 'Color Reaction Lab', youtubeId: 'M7lc1UVf-VE', duration: '08:40', description: 'A guided lesson on observing and documenting color reactions.', experimentId: 'core-1' },
      { id: 'core-magnetic-build', title: 'Magnetic Build Challenge', youtubeId: 'aqz-KE-bpKQ', duration: '10:25', description: 'Build with intent and improve structural stability.', experimentId: 'core-2' },
      { id: 'core-motion-system', title: 'Simple Motion System', youtubeId: 'ysz5S6PUM-U', duration: '12:15', description: 'Learn how motion, force, and control work together.', experimentId: 'core-3' },
      { id: 'core-problem-solving', title: 'Problem-Solving Sprint', youtubeId: 'ScMzIvxBSi4', duration: '11:30', description: 'Use the full workflow to solve a structured challenge.', experimentId: 'core-4' }
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
