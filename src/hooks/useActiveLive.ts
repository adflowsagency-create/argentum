import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Live } from '../types/database';

// Helper function to check if a live should be automatically activated
const shouldAutoActivateLive = (fechaHora: string): boolean => {
  const liveTime = new Date(fechaHora);
  const now = new Date();
  return now >= liveTime;
};

// Helper function to check if manual start should be available (15 minutes before)
const canManuallyStart = (fechaHora: string): boolean => {
  const liveTime = new Date(fechaHora);
  const now = new Date();
  const fifteenMinutesBefore = new Date(liveTime.getTime() - 15 * 60 * 1000);
  return now >= fifteenMinutesBefore && now < liveTime;
};

type LiveWithStats = Live & {
  ventas_total: number;
  pedidos_count: number;
  estado: 'programado' | 'activo' | 'finalizado';
};

export function useActiveLive() {
  const [activeLive, setActiveLive] = useState<LiveWithStats | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkActiveLive = async () => {
      try {
        // First, check for scheduled lives that should be auto-activated
        const { data: scheduledLives, error: scheduledError } = await supabase
          .from('lives')
          .select('*')
          .eq('estado', 'programado')
          .order('fecha_hora', { ascending: true });

        if (scheduledError) {
          console.error('Error fetching scheduled lives:', scheduledError);
        } else if (scheduledLives) {
          // Auto-activate lives that have reached their scheduled time
          for (const live of scheduledLives) {
            if (shouldAutoActivateLive(live.fecha_hora)) {
              console.log(`Auto-activating live: ${live.titulo}`);
              
              const { error: updateError } = await supabase
                .from('lives')
                .update({ estado: 'activo' })
                .eq('live_id', live.live_id);

              if (updateError) {
                console.error('Error auto-activating live:', updateError);
              }
            }
          }
        }

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
    const interval = setInterval(checkActiveLive, 30000); // Check every 30 seconds

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
