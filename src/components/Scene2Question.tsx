import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { COPY, SCROLL_TIMELINE } from '../config';

interface Scene2QuestionProps {
  progress: number;
}

const PLAYFUL_PHRASES = [
  'Only if you buy pastries 🥐',
  'Only with extra caramel ☕',
  'I only drink iced latte 🧋',
  'Nice try, you are coming! 😄',
  'Too busy being awesome 😎',
  'You cannot dodge coffee! ☕',
  'Fine, you convinced me! ✨',
];

const COFFEE_CHOICES = [
  { id: 'latte', label: 'Vanilla Oat Latte ☕', icon: '☕' },
  { id: 'caramel', label: 'Caramel Macchiato 🧋', icon: '🧋' },
  { id: 'iced', label: 'Iced Spanish Latte 🧊', icon: '🧊' },
  { id: 'mocha', label: 'Belgian Hot Mocha 🍫', icon: '🍫' },
];

const PASTRY_CHOICES = [
  { id: 'croissant', label: 'Butter Croissant 🥐' },
  { id: 'cinnamon', label: 'Cinnamon Roll 🍥' },
  { id: 'cookie', label: 'Choc Chunk Cookie 🍪' },
];

// Web Audio API friendly marimba & celebration sounds
const playCafeSound = (type: 'hover' | 'success') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'hover') {
      [659.25, 830.61, 987.77].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.06, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.35);
      });
    } else {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.12, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.6);
      });
    }
  } catch {
    // Autoplay restrictions or unsupported environments
  }
};

/**
 * SCENE 2 — THE COFFEE INVITATION & REACTIVE "YEAH" INTERACTION
 * Light, warm, aesthetic cafe atmosphere — NO DARK COLORS.
 * When cursor hovers / selects "Yeah":
 * - Magnetic attraction tracking
 * - Rising coffee aroma particles
 * - Playful reaction badge & audio chime
 * - Runaway button commentary
 */
export const Scene2Question: React.FC<Scene2QuestionProps> = ({ progress }) => {
  const { START, PEAK } = SCROLL_TIMELINE.SCENE_2;

  const [hasAccepted, setHasAccepted] = useState(false);
  const [maybePhraseIndex, setMaybePhraseIndex] = useState(0);
  const [maybePosition, setMaybePosition] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  // Interactive "Yeah" button state
  const [isHoveringYeah, setIsHoveringYeah] = useState(false);
  const [yeahMagnet, setYeahMagnet] = useState({ x: 0, y: 0 });
  const [aromaParticles, setAromaParticles] = useState<Array<{ id: number; emoji: string; left: number }>>([]);
  const particleCountRef = useRef(0);

  // Order choices in accepted view
  const [selectedCoffee, setSelectedCoffee] = useState(COFFEE_CHOICES[0].label);
  const [selectedPastry, setSelectedPastry] = useState(PASTRY_CHOICES[0].label);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const maybeBtnRef = useRef<HTMLButtonElement | null>(null);
  const yeahBtnRef = useRef<HTMLButtonElement | null>(null);

  // Visibility based on scroll position
  const isVisible = progress >= START;
  const opacity = Math.min(1, Math.max(0, (progress - START) / (PEAK - START)));
  const scale = 0.94 + 0.06 * opacity;
  const translateY = (1 - opacity) * 40;

  // Runaway button dodge logic
  const triggerDodge = () => {
    setMaybePhraseIndex((prev) => (prev + 1) % PLAYFUL_PHRASES.length);
    setDodgeCount((prev) => prev + 1);

    const minDistance = 90;
    const maxDistanceX = 160;
    const maxDistanceY = 100;

    const angle = Math.random() * Math.PI * 2;
    const distanceX = minDistance + Math.random() * (maxDistanceX - minDistance);
    const distanceY = minDistance + Math.random() * (maxDistanceY - minDistance);

    const newX = Math.cos(angle) * distanceX;
    const newY = Math.sin(angle) * distanceY;

    setMaybePosition({ x: newX, y: newY });
  };

  // Proximity dodge for maybe button
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!maybeBtnRef.current || hasAccepted || !isVisible) return;
      const rect = maybeBtnRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      if (dist < 75) {
        triggerDodge();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasAccepted, isVisible]);

  // Magnetic cursor tracker for "Yeah"
  const handleYeahMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!yeahBtnRef.current) return;
    const rect = yeahBtnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.22;
    const offsetY = (e.clientY - centerY) * 0.22;
    setYeahMagnet({ x: offsetX, y: offsetY });
  };

  const handleYeahMouseEnter = () => {
    setIsHoveringYeah(true);
    playCafeSound('hover');

    // Spawn rising aroma particles
    const emojis = ['☕', '✨', '🥐', '💛', '🍩', '🧋', '🍰'];
    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: particleCountRef.current++,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: 15 + Math.random() * 70,
    }));
    setAromaParticles(newParticles);
  };

  const handleYeahMouseLeave = () => {
    setIsHoveringYeah(false);
    setYeahMagnet({ x: 0, y: 0 });
  };

  // Golden Amber celebration
  const handleYesClick = () => {
    setHasAccepted(true);
    playCafeSound('success');

    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 45 * (timeLeft / duration);

      confetti({
        particleCount,
        spread: 360,
        startVelocity: 32,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#D97706', '#F59E0B', '#FBBF24', '#FEF3C7', '#B45309'],
      });
    }, 240);
  };

  // Copy custom text invite
  const handleCopyInvite = () => {
    const inviteMessage = `Hey! I said YES to coffee! ☕ Let's get ${selectedCoffee} & ${selectedPastry}. When are you free this week?`;
    navigator.clipboard?.writeText(inviteMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    });
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      id="scene-2-question-stage"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: opacity > 0.3 ? 'auto' : 'none',
        opacity,
        transform: `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
        transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
        zIndex: 40,
        padding: '1.5rem',
      }}
    >
      {/* Radiant Sunlit Amber Halo (Light theme) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 'min(92vw, 800px)',
          height: 'min(92vw, 800px)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(251, 191, 36, 0.12) 42%, transparent 70%)',
          filter: 'blur(85px)',
          pointerEvents: 'none',
        }}
      />

      {/* The Warm Milk Glass Proposal Card */}
      <div
        className="obsidian-glass-card"
        style={{
          width: 'min(94vw, 560px)',
          padding: 'clamp(2.4rem, 5vw, 3.4rem) clamp(1.8rem, 4vw, 2.8rem)',
          textAlign: 'center',
          boxShadow: '0 25px 70px rgba(120, 53, 15, 0.09), 0 0 45px rgba(245, 158, 11, 0.14)',
          border: '1.5px solid rgba(217, 119, 6, 0.24)',
          background: 'rgba(255, 255, 255, 0.94)',
        }}
      >
        {!hasAccepted ? (
          <>
            {/* Eyebrow */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans-support)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--amber-gold)',
                  display: 'inline-block',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '9999px',
                  background: 'rgba(254, 243, 199, 0.8)',
                  border: '1px solid rgba(217, 119, 6, 0.25)',
                }}
              >
                ✦ {COPY.scene2.eyebrow} ✦
              </span>
            </div>

            {/* Main Proposal Headline */}
            <h2
              style={{
                fontFamily: 'var(--font-serif-poetic)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(2.2rem, 4.8vw, 3.4rem)',
                color: 'var(--text-pure)',
                margin: '0 0 1rem 0',
                lineHeight: 1.18,
                textShadow: '0 2px 15px rgba(120, 53, 15, 0.08)',
              }}
            >
              {COPY.scene2.headline}
            </h2>

            {/* Subtext */}
            <p
              style={{
                fontFamily: 'var(--font-sans-support)',
                fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                color: 'var(--text-whisper)',
                lineHeight: 1.65,
                margin: '0 auto 2.2rem auto',
                maxWidth: '44ch',
              }}
            >
              {COPY.scene2.subtext}
            </p>

            {/* Actions Zone with Reactive Hover Interactions */}
            <div
              id="question-buttons-container"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                minHeight: '85px',
              }}
            >
              {/* Dynamic Interactive Speech Bubble when cursor is on "Yeah" */}
              {isHoveringYeah && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-42px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#26150B',
                    color: '#FFFDF7',
                    padding: '0.3rem 0.85rem',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-sans-support)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    boxShadow: '0 8px 20px rgba(120, 53, 15, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    whiteSpace: 'nowrap',
                    animation: 'bounce-tooltip 0.3s ease-out forwards',
                    zIndex: 35,
                    pointerEvents: 'none',
                  }}
                >
                  <span>10/10 Excellent choice! ☕</span>
                </div>
              )}

              {/* Floating Aroma Particles */}
              {isHoveringYeah &&
                aromaParticles.map((p) => (
                  <span
                    key={p.id}
                    style={{
                      position: 'absolute',
                      left: `${p.left}%`,
                      bottom: '55px',
                      fontSize: '1.3rem',
                      pointerEvents: 'none',
                      animation: 'float-up-aroma 1.4s ease-out forwards',
                      zIndex: 30,
                    }}
                  >
                    {p.emoji}
                  </span>
                ))}

              {/* "Yes, let’s get coffee! ☕" — Magnetic & Reactive Golden Caramel Button */}
              <button
                ref={yeahBtnRef}
                id="btn-yeah"
                type="button"
                onClick={handleYesClick}
                onMouseEnter={handleYeahMouseEnter}
                onMouseLeave={handleYeahMouseLeave}
                onMouseMove={handleYeahMouseMove}
                style={{
                  position: 'relative',
                  padding: '0.95rem 2.4rem',
                  borderRadius: '9999px',
                  background:
                    'linear-gradient(135deg, #F59E0B 0%, #D97706 60%, #B45309 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: isHoveringYeah
                    ? '0 16px 40px rgba(217, 119, 6, 0.5), 0 0 30px rgba(245, 158, 11, 0.4)'
                    : '0 10px 28px rgba(217, 119, 6, 0.35), 0 2px 5px rgba(120, 53, 15, 0.1)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans-support)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transform: `translate(${yeahMagnet.x}px, ${yeahMagnet.y}px) scale(${
                    isHoveringYeah ? 1.08 : 1
                  })`,
                  transition:
                    'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
                  zIndex: 25,
                }}
              >
                {COPY.scene2.yesButton}
              </button>

              {/* Playful Runaway Button with Responsive Banter */}
              <button
                ref={maybeBtnRef}
                id="btn-maybe"
                type="button"
                onMouseEnter={triggerDodge}
                onTouchStart={(e) => {
                  e.preventDefault();
                  triggerDodge();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  triggerDodge();
                }}
                style={{
                  position: 'relative',
                  transform: `translate(${maybePosition.x}px, ${maybePosition.y}px)`,
                  transition:
                    'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease',
                  padding: '0.85rem 1.8rem',
                  borderRadius: '9999px',
                  background: isHoveringYeah ? 'rgba(254, 243, 199, 0.9)' : 'rgba(243, 237, 227, 0.85)',
                  border: '1px solid rgba(217, 119, 6, 0.3)',
                  color: isHoveringYeah ? 'var(--amber-deep)' : 'var(--text-whisper)',
                  fontFamily: 'var(--font-sans-support)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  zIndex: 20,
                }}
              >
                {isHoveringYeah ? 'Whew, good choice! 🥐' : PLAYFUL_PHRASES[maybePhraseIndex]}
              </button>
            </div>

            {dodgeCount > 1 && (
              <p
                style={{
                  fontFamily: 'var(--font-sans-support)',
                  fontSize: '0.84rem',
                  color: 'var(--amber-gold)',
                  marginTop: '1.4rem',
                  fontStyle: 'italic',
                  fontWeight: 500,
                }}
              >
                (Don’t worry, good friends don’t let friends skip coffee.)
              </p>
            )}
          </>
        ) : (
          /* Confirmation & Interactive Coffee Order */
          <div
            id="acceptance-celebration"
            style={{
              animation: 'fade-in 0.6s ease-out forwards',
            }}
          >
            <div
              style={{
                fontSize: '3.6rem',
                marginBottom: '0.8rem',
                filter: 'drop-shadow(0 6px 15px rgba(217, 119, 6, 0.3))',
              }}
            >
              ☕✨🥐
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-serif-poetic)',
                fontStyle: 'italic',
                fontSize: 'clamp(2.3rem, 5vw, 3.4rem)',
                color: 'var(--text-pure)',
                margin: '0 0 0.8rem 0',
                textShadow: '0 2px 14px rgba(120, 53, 15, 0.1)',
              }}
            >
              {COPY.scene2.acceptedHeadline}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-sans-support)',
                fontSize: '0.98rem',
                color: 'var(--text-whisper)',
                lineHeight: 1.65,
                maxWidth: '42ch',
                margin: '0 auto 1.6rem auto',
              }}
            >
              {COPY.scene2.acceptedMessage}
            </p>

            {/* Interactive Coffee Customizer */}
            <div
              style={{
                background: 'rgba(254, 243, 199, 0.45)',
                border: '1px solid rgba(217, 119, 6, 0.2)',
                borderRadius: '18px',
                padding: '1.25rem',
                marginBottom: '1.8rem',
                textAlign: 'left',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans-support)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--amber-gold)',
                  marginBottom: '0.6rem',
                }}
              >
                ✦ What are we drinking?
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                {COFFEE_CHOICES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCoffee(c.label)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '9999px',
                      background: selectedCoffee === c.label ? '#D97706' : '#FFFFFF',
                      color: selectedCoffee === c.label ? '#FFFFFF' : '#26150B',
                      border: '1px solid rgba(217, 119, 6, 0.3)',
                      fontFamily: 'var(--font-sans-support)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-sans-support)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--amber-gold)',
                  marginBottom: '0.6rem',
                }}
              >
                ✦ Pair with a treat:
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                {PASTRY_CHOICES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPastry(p.label)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '9999px',
                      background: selectedPastry === p.label ? '#D97706' : '#FFFFFF',
                      color: selectedPastry === p.label ? '#FFFFFF' : '#26150B',
                      border: '1px solid rgba(217, 119, 6, 0.3)',
                      fontFamily: 'var(--font-sans-support)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.8rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={handleCopyInvite}
                style={{
                  padding: '0.8rem 1.8rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans-support)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {copied ? '✓ Text Copied to Clipboard!' : 'Copy Text to Send 💌'}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleYesClick();
                }}
                style={{
                  padding: '0.8rem 1.4rem',
                  borderRadius: '9999px',
                  background: 'rgba(254, 243, 199, 0.8)',
                  border: '1px solid rgba(217, 119, 6, 0.3)',
                  color: 'var(--amber-deep)',
                  fontFamily: 'var(--font-sans-support)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Replay Confetti ✨
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float-up-aroma {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-75px) scale(1.3);
            opacity: 0;
          }
        }

        @keyframes bounce-tooltip {
          0% {
            transform: translateX(-50%) translateY(8px) scale(0.9);
            opacity: 0;
          }
          60% {
            transform: translateX(-50%) translateY(-3px) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
