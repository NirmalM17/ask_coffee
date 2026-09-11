import React from 'react';
import { Scene0Opening } from './Scene0Opening';
import { Scene1Video } from './Scene1Video';
import { Scene2Question } from './Scene2Question';

interface StageProps {
  progress?: number;
}

/**
 * 3D WARM LIGHT CAFE STAGE
 * 1. Warm Ivory Cream Base & Radiant Sunlit Amber Aurora
 * 2. Secondary Honey Peach Bloom & Warm Horizon Reflection
 * 3. Scene 0 Friendly Prologue ("WE HAVEN’T CAUGHT UP PROPERLY IN A WHILE...")
 * 4. Scene 1 Warm 3D Video Reveal ("JUST BETWEEN FRIENDS")
 * 5. Scene 2 The Coffee Question & Interactive Reactive "Yeah" Button
 */
export const Stage: React.FC<StageProps> = ({ progress = 0 }) => {
  // Golden amber aurora intensity & bloom as progress advances
  const bloomT = Math.max(0, Math.min(1, (progress - 0.35) / 0.45));
  const glowScale = (0.95 + bloomT * 0.18).toFixed(3);
  const glowOpacity = (0.75 + bloomT * 0.25).toFixed(2);

  // Parallax floor shift
  const floorTranslateY = (progress * -40).toFixed(1);

  return (
    <div
      id="cinematic-canvas-stage"
      className="cinematic-stage"
      role="region"
      aria-label="Warm Cafe Invitation Canvas"
    >
      {/* LAYER 1: WARM IVORY CREAM STAGE BASE */}
      <div
        id="layer-1-stage-base"
        className="layer-stage-base"
        aria-hidden="true"
      />

      {/* LAYER 2: RADIANT SUNSET AMBER & HONEY AURORA */}
      <div
        id="layer-2-gold-aurora"
        className="layer-gold-aurora"
        aria-hidden="true"
        style={{
          opacity: Number(glowOpacity),
          transform: `translate(-50%, -10%) scale(${glowScale})`,
        }}
      />

      {/* LAYER 3: SECONDARY HONEY PEACH BLOOM */}
      <div
        id="layer-3-peach-bloom"
        className="layer-peach-bloom"
        aria-hidden="true"
      />

      {/* LAYER 4: STAGE REFLECTIVE FLOOR */}
      <div
        id="layer-4-stage-floor"
        className="layer-stage-floor"
        aria-hidden="true"
        style={{
          transform: `rotateX(74deg) translateY(${floorTranslateY}px)`,
        }}
      />

      {/* LAYER 5: CONTENT LAYER */}
      <div id="layer-5-content" style={{ position: 'absolute', inset: 0, zIndex: 25 }}>
        {/* Scene 0: Honest Prologue */}
        <Scene0Opening progress={progress} />

        {/* Scene 1: Warm 3D Video Reveal */}
        <Scene1Video progress={progress} />

        {/* Scene 2: The Heartfelt Coffee Question & Reactive Button */}
        <Scene2Question progress={progress} />
      </div>

      {/* LAYER 6: WARM AMBER VIGNETTE */}
      <div
        id="layer-6-vignette"
        className="layer-vignette"
        aria-hidden="true"
      />

      {/* LAYER 7: SUBTLE WARM TEXTURE */}
      <div
        id="layer-7-grain"
        className="layer-grain"
        aria-hidden="true"
      />
    </div>
  );
};
