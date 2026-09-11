import React, { useRef, useEffect, useState } from 'react';
import { COPY, SCROLL_TIMELINE, VIDEO_CONFIG } from '../config';
import { calculateBeatMotion } from '../utils/motion';
import { loadSavedVideo } from '../utils/videoStorage';

interface Scene1VideoProps {
  progress: number;
}

/**
 * SCENE 1 — IMMERSIVE FULL-SCREEN 4K VIDEO REVEAL
 * - Flawless optical framing (object-position: 50% 32%):
 *   Centers on the face, smile, sunglasses, hair, and shirt naturally across all screens.
 * - Zero intrusive buttons covering the video.
 * - Native 4K GPU rendering with crisp contrast and no blurring.
 * - Gentle scrims tuned to preserve face luminosity while keeping typography readable.
 * - Tap anywhere on screen to toggle audio.
 */
export const Scene1Video: React.FC<Scene1VideoProps> = ({ progress }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  const [videoSrc, setVideoSrc] = useState<string>(VIDEO_CONFIG.src);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);

  const {
    CHAPTER_TITLE,
    LINE_PROPERLY,
    VIDEO_EMERGE,
    VIDEO_DOMINANT,
    VIDEO_PLAY_TRIGGER,
  } = SCROLL_TIMELINE.SCENE_1;

  // Restore cached video from IndexedDB on mount
  useEffect(() => {
    loadSavedVideo()
      .then((saved) => {
        if (saved && saved.blobUrl) {
          setVideoSrc(saved.blobUrl);
        }
      })
      .catch(() => {
        // Graceful fallback to default VIDEO_CONFIG.src
      });
  }, []);

  // Chapter Motion: "JUST BETWEEN FRIENDS"
  const chapterMotion = calculateBeatMotion(progress, {
    start: CHAPTER_TITLE.start,
    end: CHAPTER_TITLE.end,
    peakStart: CHAPTER_TITLE.peakStart,
    peakEnd: CHAPTER_TITLE.peakEnd,
    translateYRange: [16, -8],
    scaleRange: [0.98, 1.01],
  });

  // Line 2: "So I wanted to wave hi and ask you properly."
  const lineProperlyMotion = calculateBeatMotion(progress, {
    start: LINE_PROPERLY.start,
    end: LINE_PROPERLY.end,
    peakStart: LINE_PROPERLY.peakStart,
    peakEnd: LINE_PROPERLY.peakEnd,
    translateYRange: [16, -8],
    scaleRange: [0.98, 1.01],
  });

  // Timeline visibility (0.52 -> 0.86)
  const isVideoInTimeline = progress >= VIDEO_EMERGE && progress <= 0.86;
  const videoProgressT = Math.max(
    0,
    Math.min(1, (progress - VIDEO_EMERGE) / (VIDEO_DOMINANT - VIDEO_EMERGE))
  );

  // Smooth entrance fade
  const videoOpacity = !isVideoInTimeline
    ? progress > 0.86
      ? Math.max(0, 1 - (progress - 0.86) / 0.05)
      : 0
    : progress < VIDEO_DOMINANT
    ? Math.sin((videoProgressT * Math.PI) / 2)
    : 1.0;

  const isVideoVisible = videoOpacity > 0.005;

  // High performance edge-triggered playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (progress >= VIDEO_PLAY_TRIGGER && progress <= 0.86 && !isPlayingRef.current) {
      isPlayingRef.current = true;
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      }
    } else if ((progress < VIDEO_EMERGE || progress > 0.86) && isPlayingRef.current) {
      isPlayingRef.current = false;
      video.pause();
    }
  }, [progress, VIDEO_PLAY_TRIGGER, VIDEO_EMERGE, isMuted]);

  // Tap on screen to toggle audio cleanly
  const handleScreenClick = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    setAudioFeedback(nextMuted ? 'Muted' : 'Sound On 🔊');
    setTimeout(() => {
      setAudioFeedback(null);
    }, 1500);

    if (video.paused) {
      video.play().catch(() => {});
      isPlayingRef.current = true;
    }
  };

  const isSceneActive = chapterMotion.isActive || lineProperlyMotion.isActive || isVideoVisible;
  if (!isSceneActive) return null;

  return (
    <div
      id="scene-1-stage"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: isVideoVisible ? 'auto' : 'none',
        zIndex: 25,
        overflow: 'hidden',
        backgroundColor: '#160E08',
      }}
    >
      {/* 
        ========================================================================
        4K FULL-SCREEN VIDEO STAGE
        ========================================================================
      */}
      {isVideoVisible && (
        <div
          id="scene-1-video-stage"
          onClick={handleScreenClick}
          title="Tap anywhere to toggle sound"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100vw',
            height: '100vh',
            opacity: videoOpacity,
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 
            Ultra-sharp 4K Video Element:
            - object-fit: cover for edge-to-edge cinematic immersion
            - object-position: 50% 32% anchors right on the face, sunglasses, hair,
              smile, chin, and shirt so the user's face is centered and fully visible.
            - GPU acceleration (-webkit-optimize-contrast, 3D transform)
          */}
          <video
            ref={videoRef}
            id="scene-1-waving-video"
            src={videoSrc}
            playsInline
            autoPlay
            muted={isMuted}
            loop
            preload="auto"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 32%',
              zIndex: 10,
              display: 'block',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              imageRendering: '-webkit-optimize-contrast',
            }}
          />

          {/* Minimal top scrim — keeps head and hair clear while providing badge contrast */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '16%',
              background:
                'linear-gradient(180deg, rgba(12, 6, 2, 0.42) 0%, rgba(12, 6, 2, 0.08) 60%, transparent 100%)',
              zIndex: 15,
              pointerEvents: 'none',
            }}
          />

          {/* Minimal bottom scrim — keeps chest and shirt clear while giving subtitle contrast */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '22%',
              background:
                'linear-gradient(0deg, rgba(12, 6, 2, 0.55) 0%, rgba(12, 6, 2, 0.12) 65%, transparent 100%)',
              zIndex: 15,
              pointerEvents: 'none',
            }}
          />

          {/* Momentary audio feedback badge */}
          {audioFeedback && (
            <div
              aria-live="polite"
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.94)',
                color: '#26150B',
                fontFamily: 'var(--font-sans-support)',
                fontSize: '0.8rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.02em',
                zIndex: 40,
                pointerEvents: 'none',
                animation: 'fadeInOut 1.5s ease forwards',
              }}
            >
              {audioFeedback}
            </div>
          )}
        </div>
      )}

      {/* 
        ========================================================================
        POETIC OVERLAY TYPOGRAPHY (CLEAN OF THE FACE AND BODY)
        ========================================================================
      */}
      <div
        id="scene-1-typography-zone"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 30,
        }}
      >
        {/* Chapter 1: Top Left Margin */}
        {chapterMotion.isActive && (
          <div
            id="scene-1-chapter-title"
            style={{
              position: 'absolute',
              top: 'clamp(1.2rem, 3.5vh, 2.5rem)',
              left: 'clamp(1.2rem, 4vw, 3.5rem)',
              maxWidth: '44ch',
              ...chapterMotion.style,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans-support)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#FFFBEB',
                display: 'inline-block',
                marginBottom: '0.35rem',
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                background: 'rgba(217, 119, 6, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(254, 243, 199, 0.4)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              }}
            >
              ✦ {COPY.scene1.chapter} ✦
            </span>
            <p
              style={{
                fontFamily: 'var(--font-serif-poetic)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.5rem, 2.8vw, 2.4rem)',
                fontWeight: 400,
                color: '#FFFFFF',
                lineHeight: 1.25,
                margin: 0,
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.85), 0 4px 24px rgba(0, 0, 0, 0.5)',
              }}
            >
              {COPY.scene1.line1}
            </p>
          </div>
        )}

        {/* Line 2: Placed cleanly at the bottom center */}
        {lineProperlyMotion.isActive && (
          <div
            id="scene-1-line-properly"
            style={{
              position: 'absolute',
              bottom: 'clamp(1rem, 3vh, 2rem)',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              width: '92%',
              maxWidth: '44ch',
              ...lineProperlyMotion.style,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-serif-poetic)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.35rem, 2.4vw, 2.1rem)',
                fontWeight: 400,
                color: '#FFFFFF',
                lineHeight: 1.35,
                margin: 0,
                textShadow: '0 2px 16px rgba(0, 0, 0, 0.95), 0 4px 28px rgba(0, 0, 0, 0.7)',
              }}
            >
              "{COPY.scene1.line2}"
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-4px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};
