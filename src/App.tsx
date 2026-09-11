import { useScrollProgress } from './hooks/useScrollProgress';
import { Stage } from './components/Stage';

export default function App() {
  const { progress } = useScrollProgress();

  return (
    <main
      id="app-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        backgroundColor: 'var(--bg-stage-void)',
      }}
    >
      {/* 
        STAGE: 3D WARM CAFE INVITATION FOUNDATION
        - Warm Cream & Radiant Sunlit Amber Aurora (Light theme, no dark colors)
        - Scene 0 Honest Prologue ("WE HAVEN’T CAUGHT UP PROPERLY IN A WHILE...")
        - Scene 1 3D Video Reveal ("JUST BETWEEN FRIENDS")
        - Scene 2 The Coffee Question & Reactive Interactive "Yeah" Button
      */}
      <Stage progress={progress} />

      {/* 
        Scroll track providing smooth document height for Lenis smooth scrolling 
      */}
      <div id="scroll-track" className="scroll-canvas" aria-hidden="true" />
    </main>
  );
}
