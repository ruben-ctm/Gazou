import { useEffect, useRef } from 'react';

export function useFadingAudio(src, shouldPlay, fadeDuration = 800) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current && src) {
      const audio = new Audio(src);
      audio.loop = true;
      audioRef.current = audio;
    } else if (audioRef.current && src !== audioRef.current.getAttribute('src')) {
      audioRef.current.src = src;
    }
  }, [src]);

  useEffect(() => {
    let fadeInterval;
    const audio = audioRef.current;
    
    if (!audio) return;

    if (shouldPlay) {
      audio.volume = 0;
      audio.play().catch(e => console.warn('Audio auto-play blocked', e));

      const steps = 20;
      const stepTime = fadeDuration / steps;
      
      fadeInterval = setInterval(() => {
        if (audio.volume < 0.95) {
          audio.volume = Math.min(1, audio.volume + (1 / steps));
        } else {
          audio.volume = 1;
          clearInterval(fadeInterval);
        }
      }, stepTime);
    } else {
      // Fade out
      const steps = 20;
      const stepTime = fadeDuration / steps;
      
      fadeInterval = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - (1 / steps));
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeInterval);
        }
      }, stepTime);
    }

    return () => clearInterval(fadeInterval);
  }, [shouldPlay, fadeDuration]);

  // Cleanup completely on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return audioRef;
}
