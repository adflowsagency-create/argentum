import React from 'react';
import { X, Calendar, DollarSign, Users, TrendingUp, Package } from 'lucide-react';
import type { Live } from '../../types/database';
import { mockPedidos } from '../../data/mockData';

interface LiveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveId: string | null;
  lives: (Live & { ventas_total: number; pedidos_count: number; estado: 'programado' | 'activo' | 'finalizado' })[];
}

export default function LiveDetailsModal({ isOpen, onClose, liveId, lives }: LiveDetailsModalProps) {
  if (!isOpen || !liveId) return null;

  const live = lives.find(l => l.live_id === liveId);
  if (!live) return null;

  // Get orders associated with this live
  const livePedidos = mockPedidos.filter(pedido => pedido.live_id === liveId);
  
  const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate live duration (assuming 2-3 hours average)
  const liveDuration = live.estado === 'finalizado' ? '2h 45m' : 'En curso';
  
  // Calculate average order value
  const averageOrderValue = livePedidos.length > 0 
    ? livePedidos.reduce((sum, pedido) => sum + pedido.total, 0) / livePedidos.length 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {live.titulo || `Live #${live.live_id}`}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDateTime(live.fecha_hora)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Live Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Información del Live</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Estado</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    live.estado === 'finalizado' 
                      ? 'bg-gray-100 text-gray-800' 
                      : live.estado === 'activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {live.estado.charAt(0).toUpperCase() + live.estado.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Duración</p>
                  <p className="font-medium">{liveDuration}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha y Hora</p>
                  <p className="font-medium">{formatTime(live.fecha_hora)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Creado</p>
                  <p className="font-medium">{formatTime(live.created_at)}</p>
                </div>
              </div>
              {live.notas && (
                <div className="mt-4">
                  <p className="text-gray-500 text-sm">Notas</p>
                  <p className="text-gray-900">{live.notas}</p>
                </div>
              )}
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(live.ventas_total)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Pedidos</p>
                    <p className="text-lg font-bold text-gray-900">{live.pedidos_count}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Ticket Promedio</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(averageOrderValue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Package className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Conversión</p>
                    <p className="text-lg font-bold text-gray-900">
                      {live.pedidos_count > 0 ? '85%' : '0%'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders from Live */}
            {livePedidos.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  Pedidos del Live ({livePedidos.length})
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Pedido
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Cliente
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Estado
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Total
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Hora
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {livePedidos.map((pedido) => (
                          <tr key={pedido.pedido_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              #{pedido.pedido_id}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {pedido.cliente.nombre}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                pedido.estado === 'Pagado' 
                                  ? 'bg-green-100 text-green-800'
                                  : pedido.estado === 'Confirmado'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {pedido.estado}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-green-600">
                              {formatCurrency(pedido.total)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {formatTime(pedido.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Insights */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Insights del Live</h3>
              <div className="space-y-2 text-sm text-blue-800">
                {live.ventas_total > 3000 && (
                  <p>• Excelente rendimiento: Superaste el promedio de ventas por live</p>
                )}
                {live.pedidos_count > 10 && (
                  <p>• Alta participación: Más de 10 pedidos durante el live</p>
                )}
                {averageOrderValue > 400 && (
                  <p>• Ticket alto: El ticket promedio fue superior a $400</p>
                )}
                <p>• Mejor horario para lives: Entre 7:00 PM y 9:00 PM</p>
                <p>• Productos más vendidos en lives: Collares y Pulseras</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}