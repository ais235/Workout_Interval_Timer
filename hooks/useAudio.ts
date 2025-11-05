
import { useCallback, useMemo } from 'react';

export const useAudio = (url: string) => {
  const audio = useMemo(() => typeof Audio !== 'undefined' ? new Audio(url) : undefined, [url]);

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [audio]);

  return { play };
};
