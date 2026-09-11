import React from 'react';
import { COPY, SCROLL_TIMELINE } from '../config';
import { calculateBeatMotion } from '../utils/motion';

interface Scene0OpeningProps {
  progress: number;
}

/**
 * SCENE 0 — FRIENDLY & GENUINE PROLOGUE
 * Pacing:
 * 1. "WE HAVEN’T CAUGHT UP PROPERLY IN A WHILE."
 * 2. "And honestly..."
 * 3. "Good coffee is ten times better with your company."
 */
export const Scene0Opening: React.FC<Scene0OpeningProps> = ({ progress }) => {
  const { BEAT_1, BEAT_2, BEAT_3 } = SCROLL_TIMELINE.SCENE_0;

  // Beat 1: Setting the tone
  const beat1 = calculateBeatMotion(progress, {
    start: BEAT_1.start,
    end: BEAT_1.end,
    peakStart: BEAT_1.peakStart,
    peakEnd: BEAT_1.peakEnd,
    translateYRange: [22, -18],
    scaleRange: [1.02, 0.98],
  });

  // Beat 2: "And honestly..."
  const beat2 = calculateBeatMotion(progress, {
    start: BEAT_2.start,
    end: BEAT_2.end,
    peakStart: BEAT_2.peakStart,
    peakEnd: BEAT_2.peakEnd,
    translateYRange: [28, -20],
    scaleRange: [0.95, 1.02],
  });

  // Beat 3: "Good coffee is ten times better with your company."
  const beat3 = calculateBeatMotion(progress, {
    start: BEAT_3.start,
    end: BEAT_3.end,
    peakStart: BEAT_3.peakStart,
    peakEnd: BEAT_3.peakEnd,
    translateYRange: [24, -16],
    scaleRange: [0.98, 1.01],
  });

  if (!beat1.isActive && !beat2.isActive && !beat3.isActive) {
    return null;
  }

  return (
    <div
      id="scene-0-stage"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        padding: 'clamp(1.5rem, 5vw, 4rem)',
        zIndex: 25,
      }}
    >
      {/* Beat 1: "WE HAVEN’T CAUGHT UP PROPERLY IN A WHILE." */}
      {beat1.isActive && (
        <div
          id="scene-0-beat-1"
          style={{
            position: 'absolute',
            ...beat1.style,
            maxWidth: '65ch',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans-support)',
              fontWeight: 700,
              fontSize: 'clamp(0.8rem, 1.2vw, 0.96rem)',
              color: 'var(--amber-gold)',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              lineHeight: 1.8,
              margin: 0,
              padding: '0.4rem 1.1rem',
              borderRadius: '9999px',
              background: 'rgba(254, 243, 199, 0.65)',
              border: '1px solid rgba(217, 119, 6, 0.25)',
              boxShadow: '0 4px 15px rgba(120, 53, 15, 0.04)',
            }}
          >
            ✦ {COPY.scene0.beat1} ✦
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans-support)',
              fontSize: '0.8rem',
              color: 'var(--text-whisper)',
              letterSpacing: '0.12em',
              fontWeight: 500,
            }}
          >
            Scroll gently ↓
          </span>
        </div>
      )}

      {/* Beat 2: "And honestly..." */}
      {beat2.isActive && (
        <div
          id="scene-0-beat-2"
          style={{
            position: 'absolute',
            ...beat2.style,
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-serif-poetic)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(3.5rem, 10vw, 7.5rem)',
              color: 'var(--text-pure)',
              letterSpacing: 'var(--tracking-tight)',
              lineHeight: 1,
              margin: 0,
              textShadow:
                '0 4px 20px rgba(120, 53, 15, 0.1), 0 0 30px rgba(245, 158, 11, 0.15)',
            }}
          >
            {COPY.scene0.beat2}
          </h1>
        </div>
      )}

      {/* Beat 3: "Good coffee is ten times better with your company." */}
      {beat3.isActive && (
        <div
          id="scene-0-beat-3"
          style={{
            position: 'absolute',
            ...beat3.style,
            maxWidth: '52ch',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif-poetic)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(1.9rem, 4vw, 3.2rem)',
              color: 'var(--text-pure)',
              letterSpacing: 'var(--tracking-normal)',
              lineHeight: 1.35,
              margin: 0,
              textShadow: '0 4px 20px rgba(120, 53, 15, 0.08)',
            }}
          >
            "{COPY.scene0.beat3}"
          </p>
        </div>
      )}
    </div>
  );
};
