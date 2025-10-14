import React, { useState, useEffect } from 'react';
import { X, Video, TrendingUp, Users, DollarSign } from 'lucide-react';

interface LiveAnnouncementBannerProps {
  liveId: string;
  titulo: string;
  notas?: string;
  ventas_total: number;
  pedidos_count: number;
  onJoinLive: () => void;
  onDismiss: () => void;
}

export default function LiveAnnouncementBanner({
  liveId,
  titulo,
  notas,
  ventas_total,
  pedidos_count,
  onJoinLive,
  onDismiss
}: LiveAnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="py-3 cursor-pointer hover:bg-black/5 transition-colors duration-200 rounded-lg"
            onClick={onJoinLive}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0 flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping" />
                  </div>
                  <Video className="h-5 w-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-white font-bold text-base sm:text-lg truncate">
                      {titulo}
                    </h3>
                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                      EN VIVO
                    </span>
                  </div>

                  {notas && (
                    <p className="text-white/90 text-sm hidden sm:block truncate">
                      {notas}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="hidden md:flex items-center space-x-4 text-white/95 text-sm">
                  {ventas_total > 0 && (
                    <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">{formatCurrency(ventas_total)}</span>
                    </div>
                  )}

                  {pedidos_count > 0 && (
                    <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{pedidos_count} pedidos</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={onJoinLive}
                  className="bg-white text-green-600 px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Ingresar</span>
                  <span className="sm:hidden">Ver</span>
                </button>

                <button
                  onClick={handleDismiss}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
