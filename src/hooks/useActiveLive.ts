import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useActiveLive() {
  const [activeLive, setActiveLive] = useState<typeof mockLives[0] | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkActiveLive = () => {
      try {
        // Get lives that are currently active
        const { data: activeLives, error } = await supabase
          .from('lives')
          .select('*')
          .eq('estado', 'activo')
          .order('fecha_hora', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching active live:', error);
          setActiveLive(null);
          return;
        }

        const active = activeLives?.[0];

        if (active) {
          // Calculate stats for the active live
          const { data: baskets } = await supabase
            .from('baskets')
            .select('total')
            .eq('live_id', active.live_id);

          const { data: pedidos } = await supabase
            .from('pedidos')
            .select('pedido_id')
            .eq('live_id', active.live_id);

          const ventas_total = baskets?.reduce((sum, b) => sum + (b.total || 0), 0) || 0;
          const pedidos_count = pedidos?.length || 0;

          const liveWithStats = {
            ...active,
            ventas_total,
            pedidos_count,
            estado: active.estado as 'programado' | 'activo' | 'finalizado'
          };

        const dismissedLiveId = localStorage.getItem('dismissedLiveBanner');

          if (dismissedLiveId !== active.live_id) {
            setActiveLive(liveWithStats);
          setIsDismissed(false);
        } else {
          setIsDismissed(true);
        }
      } else {
          // No active live found
        setActiveLive(null);
        setIsDismissed(false);
        localStorage.removeItem('dismissedLiveBanner');
      }
      } catch (error) {
        console.error('Error in checkActiveLive:', error);
        setActiveLive(null);
      }
    };

    checkActiveLive();
    const interval = setInterval(checkActiveLive, 10000); // Check every 10 seconds

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
