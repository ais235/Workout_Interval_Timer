
import { useEffect, useRef } from 'react';

export const useWakeLock = () => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error(`Failed to acquire wake lock: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      } else {
        console.log('Wake Lock API is not supported in this browser.');
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
        if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
            requestWakeLock();
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
          .then(() => {
            wakeLockRef.current = null;
          })
          .catch(err => {
             console.error(`Failed to release wake lock: ${err instanceof Error ? err.message : 'Unknown error'}`);
          });
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};
