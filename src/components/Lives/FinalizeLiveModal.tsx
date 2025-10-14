import React from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import type { BasketWithDetails } from '../../types/database';

interface FinalizeLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  baskets: BasketWithDetails[];
  totalRevenue: number;
  isProcessing: boolean;
}

export default function FinalizeLiveModal({
  isOpen,
  onClose,
  onConfirm,
  baskets,
  totalRevenue,
  isProcessing,
}: FinalizeLiveModalProps) {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900">Finalizar Live</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Importante:</strong> Esta acción es irreversible. Todas las canastas abiertas
              se convertirán en pedidos confirmados y el Live se marcará como finalizado.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total de Canastas</p>
              <p className="text-2xl font-bold text-gray-900">{baskets.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-700 mb-1">Facturación Total</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Canastas que se convertirán en pedidos:
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {baskets.map((basket) => (
                <div
                  key={basket.basket_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{basket.cliente.nombre}</p>
                    <p className="text-sm text-gray-500">
                      {basket.items.reduce((sum, item) => sum + item.cantidad, 0)} productos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(basket.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {baskets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No hay canastas activas para convertir en pedidos.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing || baskets.length === 0}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Confirmar y Finalizar Live</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
