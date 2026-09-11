export interface ScrollTimelineConfig {
  SCENE_0: {
    BEAT_1: { start: number; end: number; peakStart: number; peakEnd: number };
    BEAT_2: { start: number; end: number; peakStart: number; peakEnd: number };
    BEAT_3: { start: number; end: number; peakStart: number; peakEnd: number };
  };
  SCENE_1: {
    CHAPTER_TITLE: { start: number; end: number; peakStart: number; peakEnd: number };
    LINE_PROPERLY: { start: number; end: number; peakStart: number; peakEnd: number };
    VIDEO_EMERGE: number;
    VIDEO_DOMINANT: number;
    VIDEO_PLAY_TRIGGER: number;
  };
  SCENE_2: {
    START: number;
    PEAK: number;
  };
}

export const SCROLL_TIMELINE: ScrollTimelineConfig = {
  SCENE_0: {
    BEAT_1: { start: 0.00, end: 0.18, peakStart: 0.03, peakEnd: 0.14 },
    BEAT_2: { start: 0.18, end: 0.34, peakStart: 0.22, peakEnd: 0.30 },
    BEAT_3: { start: 0.34, end: 0.50, peakStart: 0.38, peakEnd: 0.46 },
  },
  SCENE_1: {
    CHAPTER_TITLE: { start: 0.50, end: 0.64, peakStart: 0.53, peakEnd: 0.61 },
    LINE_PROPERLY: { start: 0.64, end: 0.76, peakStart: 0.67, peakEnd: 0.73 },
    VIDEO_EMERGE: 0.52,
    VIDEO_DOMINANT: 0.66,
    VIDEO_PLAY_TRIGGER: 0.55,
  },
  SCENE_2: {
    START: 0.76,
    PEAK: 0.84,
  },
};

export const COPY = {
  start: {
    eyebrow: '✦ A SPECIAL NOTE ✦ JUST FOR YOU',
    title: 'To My Favorite Person',
    instruction: 'Tap to open & scroll gently',
  },
  scene0: {
    beat1: 'WE HAVEN’T CAUGHT UP PROPERLY IN A WHILE.',
    beat2: 'And honestly...',
    beat3: 'Good coffee is ten times better with your company.',
  },
  scene1: {
    chapter: 'JUST BETWEEN FRIENDS',
    line1: 'A regular text message felt way too boring.',
    line2: 'So I wanted to wave hi and ask you properly.',
  },
  scene2: {
    eyebrow: 'THE BIG QUESTION',
    headline: 'Are you free for coffee this week?',
    subtext: 'No rush, no agenda—just two good friends, great coffee, and catching up on life. My treat!',
    yesButton: 'Yes, let’s get coffee! ☕',
    noButton: 'Only if you buy pastries 🥐',
    acceptedHeadline: 'Coffee date locked in! ☕',
    acceptedMessage: 'First cup is on me! Text me what day works best for you and your favorite coffee spot.',
  },
};

export const VIDEO_CONFIG = {
  src: '/assets/video/me-wave.mp4',
  fallbackSrc: '/assets/video/me-wave.mov',
  aspectRatio: '9 / 16',
};
