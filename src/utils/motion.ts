import gsap from 'gsap';
import type { CSSProperties } from 'react';

export interface BeatMotionConfig {
  start: number;
  end: number;
  peakStart?: number; // Absolute progress point where peak hold begins
  peakEnd?: number;   // Absolute progress point where peak hold ends
  fadeInRatio?: number;  // Fallback if peakStart/peakEnd not provided
  fadeOutRatio?: number; // Fallback if peakStart/peakEnd not provided
  translateYRange?: [number, number]; // [start, end] in px
  translateXRange?: [number, number]; // [start, end] in px
  scaleRange?: [number, number];      // [start, end]
  blurRange?: [number, number];       // [start, end] in px (e.g. [4, 0])
}

export interface BeatTransform {
  opacity: number;
  translateY: number;
  translateX: number;
  scale: number;
  isActive: boolean;
  style: CSSProperties;
}

/**
 * Computes smooth cinematic opacity, spatial displacement, and camera-depth transforms
 */
export function calculateBeatMotion(
  progress: number,
  config: BeatMotionConfig
): BeatTransform {
  const {
    start,
    end,
    peakStart,
    peakEnd,
    fadeInRatio = 0.28,
    fadeOutRatio = 0.28,
    translateYRange = [28, -20],
    translateXRange = [0, 0],
    scaleRange = [0.98, 1.01],
  } = config;

  if (progress < start || progress > end) {
    const isPast = progress > end;
    const pastY = isPast ? translateYRange[1] : translateYRange[0];
    const pastX = isPast ? translateXRange[1] : translateXRange[0];
    const pastScale = isPast ? scaleRange[1] : scaleRange[0];

    return {
      opacity: 0,
      translateY: pastY,
      translateX: pastX,
      scale: pastScale,
      isActive: false,
      style: {
        opacity: 0,
        transform: `translate3d(${pastX.toFixed(1)}px, ${pastY.toFixed(1)}px, 0) scale(${pastScale.toFixed(4)})`,
        pointerEvents: 'none',
        visibility: 'hidden',
      },
    };
  }

  const span = end - start;
  const lifespanT = gsap.utils.clamp(0, 1, (progress - start) / span);

  // Compute opacity envelope:
  let opacity = 1;

  if (peakStart !== undefined && peakEnd !== undefined) {
    if (progress < peakStart) {
      const enterSpan = Math.max(0.001, peakStart - start);
      const t = gsap.utils.clamp(0, 1, (progress - start) / enterSpan);
      // Sinusoidal ease-out
      opacity = Math.sin((t * Math.PI) / 2);
    } else if (progress > peakEnd) {
      const exitSpan = Math.max(0.001, end - peakEnd);
      const t = gsap.utils.clamp(0, 1, (progress - peakEnd) / exitSpan);
      // Cosine ease-in
      opacity = Math.cos((t * Math.PI) / 2);
    } else {
      // Peak hold region
      opacity = 1;
    }
  } else {
    // Ratio-based envelope
    if (lifespanT < fadeInRatio) {
      const fadeInT = lifespanT / fadeInRatio;
      opacity = Math.sin((fadeInT * Math.PI) / 2);
    } else if (lifespanT > 1 - fadeOutRatio) {
      const fadeOutT = (lifespanT - (1 - fadeOutRatio)) / fadeOutRatio;
      opacity = Math.cos((fadeOutT * Math.PI) / 2);
    }
  }

  opacity = gsap.utils.clamp(0, 1, opacity);

  // Continuous subtle spatial drift & camera push across the entire lifespan
  const translateY = gsap.utils.interpolate(translateYRange[0], translateYRange[1], lifespanT);
  const translateX = gsap.utils.interpolate(translateXRange[0], translateXRange[1], lifespanT);
  const scale = gsap.utils.interpolate(scaleRange[0], scaleRange[1], lifespanT);

  return {
    opacity,
    translateY,
    translateX,
    scale,
    isActive: opacity > 0.003,
    style: {
      opacity,
      transform: `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`,
      pointerEvents: opacity > 0.6 ? 'auto' : 'none',
      visibility: opacity > 0.001 ? 'visible' : 'hidden',
      willChange: 'opacity, transform',
    },
  };
}
