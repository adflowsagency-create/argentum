import { useState, useEffect } from 'react';
import { mockLives } from '../data/mockData';

export function useActiveLive() {
  const [activeLive, setActiveLive] = useState<typeof mockLives[0] | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkActiveLive = () => {
      const active = mockLives.find(live => live.estado === 'activo');

      if (active) {
        const dismissedLiveId = localStorage.getItem('dismissedLiveBanner');

        if (dismissedLiveId !== active.live_id) {
          setActiveLive(active);
          setIsDismissed(false);
        } else {
          setIsDismissed(true);
        }
      } else {
        setActiveLive(null);
        setIsDismissed(false);
        localStorage.removeItem('dismissedLiveBanner');
      }
    };

    checkActiveLive();
    const interval = setInterval(checkActiveLive, 30000);

    return () => clearInterval(interval);
  }, []);

  const dismissBanner = (liveId: string) => {
    localStorage.setItem('dismissedLiveBanner', liveId);
    setIsDismissed(true);
  };

  return {
    activeLive,
    isDismissed,
    dismissBanner,
    shouldShowBanner: activeLive && !isDismissed
  };
}
