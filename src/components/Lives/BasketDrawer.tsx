import React, { useState } from 'react';
import { X, Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import type { BasketWithDetails, Product } from '../../types/database';

interface BasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  basket: BasketWithDetails | null;
  products: Product[];
  onAddProduct: (basketId: string, productId: string) => Promise<void>;
  onUpdateQuantity: (basketItemId: string, newQuantity: number) => Promise<void>;
  onRemoveItem: (basketItemId: string) => Promise<void>;
}

export default function BasketDrawer({
  isOpen,
  onClose,
  basket,
  products,
  onAddProduct,
  onUpdateQuantity,
  onRemoveItem,
}: BasketDrawerProps) {
  const [productSearch, setProductSearch] = useState('');

  if (!isOpen || !basket) return null;

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const availableProducts = products.filter(
    (p) =>
      p.activo &&
      p.cantidad_en_stock > 0 &&
      !basket.items.some((item) => item.product_id === p.product_id) &&
      (p.nombre.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.categoria.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const handleAddProduct = async (productId: string) => {
    await onAddProduct(basket.basket_id, productId);
    setProductSearch('');
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Canasta de {basket.cliente.nombre}
              </h2>
              <p className="text-sm text-gray-500">{basket.cliente.telefono_whatsapp}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Productos en Canasta ({basket.items.length})
            </h3>

            {basket.items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Canasta vacía</p>
              </div>
            ) : (
              <div className="space-y-3">
                {basket.items.map((item) => (
                  <div
                    key={item.basket_item_id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start space-x-3">
                      {item.product.imagen_url && (
                        <img
                          src={item.product.imagen_url}
                          alt={item.product.nombre}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{item.product.nombre}</h4>
                        <p className="text-sm text-gray-500">{item.product.categoria}</p>
                        <p className="text-sm font-medium text-green-600 mt-1">
                          {formatCurrency(item.precio_unitario_snapshot)}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.basket_item_id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.basket_item_id, item.cantidad - 1)
                          }
                          className="p-1 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.cantidad}</span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.basket_item_id, item.cantidad + 1)
                          }
                          className="p-1 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                          disabled={item.cantidad >= item.product.cantidad_en_stock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(item.total_item)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Agregar Producto</h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {productSearch && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableProducts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay productos disponibles
                  </p>
                ) : (
                  availableProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {product.imagen_url && (
                          <img
                            src={product.imagen_url}
                            alt={product.nombre}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {product.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(product.precio_unitario)} - Stock:{' '}
                            {product.cantidad_en_stock}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddProduct(product.product_id)}
                        className="ml-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6 sticky bottom-0 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(basket.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
