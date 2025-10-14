import React from 'react';
import { DollarSign, ShoppingCart, Package } from 'lucide-react';
import type { LiveStats } from '../../types/database';

interface LiveStatsPanelProps {
  stats: LiveStats;
}

export default function LiveStatsPanel({ stats }: LiveStatsPanelProps) {
  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Facturación Total</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {formatCurrency(stats.facturacion_total)}
            </p>
          </div>
          <div className="p-3 rounded-full bg-green-100">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Canastas Activas</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {stats.canastas_activas}
            </p>
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Productos Vendidos</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {stats.productos_vendidos}
            </p>
          </div>
          <div className="p-3 rounded-full bg-orange-100">
            <Package className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
