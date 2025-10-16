import React from 'react';
import { ShoppingBag, Phone, Package } from 'lucide-react';
import type { BasketWithDetails, Product } from '../../types/database';

interface BasketCardProps {
  basket: BasketWithDetails;
  onOpenBasket: (basketId: string) => void;
  onQuickAdd: (basketId: string, productId: string) => void;
  suggestedProducts?: Product[];
  isHighlighted?: boolean;
}

export default function BasketCard({
  basket,
  onOpenBasket,
  onQuickAdd,
  suggestedProducts,
  isHighlighted,
}: BasketCardProps) {
  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const totalItems = basket.items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-4 transition-all duration-300 hover:shadow-md ${
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

      {suggestedProducts && suggestedProducts.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Agregar rápido</p>
          <div className="flex flex-wrap gap-2">
            {suggestedProducts.slice(0, 5).map((product) => (
              <button
                key={product.product_id}
                type="button"
                onClick={() => onQuickAdd(basket.basket_id, product.product_id)}
                className="px-3 py-1 text-xs font-medium rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                title={`Agregar ${product.nombre}`}
              >
                {product.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

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
            onClick={() => onOpenBasket(basket.basket_id)}
            className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            Ver / editar
          </button>
        </div>
      </div>
    </div>
  );
}
