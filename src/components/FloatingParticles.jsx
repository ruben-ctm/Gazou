import { useEffect, useRef } from 'react';

const EMOJIS = ['✨', '🌸', '💛', '⭐', '🤍', '🌺', '💫'];

export default function FloatingParticles({ unlocked }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!unlocked) return;
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      p.style.cssText = `
        left: ${Math.random() * 100}vw;
        font-size: ${Math.random() * 16 + 10}px;
        animation-delay: ${Math.random() * 8}s;
        animation-duration: ${Math.random() * 8 + 8}s;
      `;
      container.appendChild(p);
      particles.push(p);
    }

    return () => particles.forEach(p => p.remove());
  }, [unlocked]);

  return <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}
