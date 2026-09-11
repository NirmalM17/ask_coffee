import { useEffect, useState, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export interface ScrollProgressReturn {
  progress: number;
  scrollToProgress: (targetProgress: number, duration?: number) => void;
  lenisInstance: Lenis | null;
}

export function useScrollProgress(): ScrollProgressReturn {
  const [progress, setProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.1 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out style
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    const updateProgress = (e?: { progress: number }) => {
      let current = 0;
      if (e && typeof e.progress === 'number') {
        current = Math.max(0, Math.min(1, e.progress));
      } else {
        const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        current = Math.max(0, Math.min(1, scrollY / maxScroll));
      }
      setProgress(current);
    };

    lenis.on('scroll', updateProgress);
    window.addEventListener('resize', () => updateProgress(), { passive: true });

    // Initial check
    updateProgress();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('resize', () => updateProgress());
      lenisRef.current = null;
    };
  }, []);

  const scrollToProgress = useCallback((targetProgress: number, duration = 1.4) => {
    const lenis = lenisRef.current;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const targetY = Math.max(0, Math.min(1, targetProgress)) * maxScroll;

    if (lenis) {
      lenis.scrollTo(targetY, {
        duration,
        easing: (t) => 1 - Math.pow(1 - t, 3), // cubic power3.out
      });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    }
  }, []);

  return {
    progress,
    scrollToProgress,
    lenisInstance: lenisRef.current,
  };
}
