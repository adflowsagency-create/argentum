import React from 'react';
import { ShoppingBag, Phone, Package } from 'lucide-react';
import type { BasketWithDetails } from '../../types/database';

interface BasketCardProps {
  basket: BasketWithDetails;
  onOpenBasket: (basketId: string) => void;
  isHighlighted?: boolean;
}

export default function BasketCard({
  basket,
  onOpenBasket,
  isHighlighted,
}: BasketCardProps) {
  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const totalItems = basket.items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div
      onClick={() => onOpenBasket(basket.basket_id)}
      className={`bg-white rounded-lg shadow-sm border-2 p-4 transition-all duration-300 hover:shadow-md cursor-pointer ${
        isHighlighted
          ? 'border-green-500 ring-4 ring-green-200 animate-pulse'
          : 'border-gray-200 hover:border-green-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2 text-green-600" />
            {basket.cliente.nombre}
          </h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Phone className="h-3 w-3 mr-1" />
            {basket.cliente.telefono_whatsapp}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <Package className="h-4 w-4 mr-1" />
          <span>{totalItems} items</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(basket.total)}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenBasket(basket.basket_id);
            }}
            className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            Ver / editar
          </button>
        </div>
      </div>
    </div>
  );
}
