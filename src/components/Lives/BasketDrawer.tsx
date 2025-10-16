import React, { useState } from 'react';
import { X, Search, Plus, Minus, Trash2, ShoppingCart, Package } from 'lucide-react';
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

  const availableProducts = products.filter((p) => {
    const availableStock = p.stockDisponible ?? p.cantidad_en_stock;
    return (
      p.activo &&
      availableStock > 0 &&
      !basket.items.some((item) => item.product_id === p.product_id)
    );
  });

  const filteredProducts = productSearch.trim()
    ? availableProducts.filter((p) =>
        p.nombre.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.categoria.toLowerCase().includes(productSearch.toLowerCase())
      )
    : availableProducts.slice(0, 5);

  const handleAddProduct = async (productId: string) => {
    try {
      await onAddProduct(basket.basket_id, productId);
      setProductSearch('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateQuantity = async (basketItemId: string, newQuantity: number) => {
    try {
      await onUpdateQuantity(basketItemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (basketItemId: string) => {
    try {
      await onRemoveItem(basketItemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[70] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-2xl bg-white shadow-2xl z-[80] transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Canasta de {basket.cliente.nombre}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">{basket.cliente.telefono_whatsapp}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Add Product Section - Higher Priority */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-6 w-6 mr-2 text-green-600" />
              Agregar Producto
            </h3>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar productos por nombre o categoría..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
              />
            </div>

            <div className="space-y-2">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {productSearch ? 'No se encontraron productos' : 'No hay productos disponibles'}
                  </p>
                </div>
              ) : (
                <>
                  {filteredProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {product.imagen_url && (
                          <img
                            src={product.imagen_url}
                            alt={product.nombre}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-base">
                            {product.nombre}
                          </p>
                          <p className="text-sm text-gray-500">{product.categoria}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-base font-bold text-green-600">
                              {formatCurrency(product.precio_unitario)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Stock: {product.stockDisponible ?? product.cantidad_en_stock}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddProduct(product.product_id);
                        }}
                        className="ml-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors flex-shrink-0 shadow-sm"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {!productSearch && availableProducts.length > 5 && (
                    <p className="text-center text-sm text-gray-500 py-2">
                      Mostrando 5 de {availableProducts.length} productos. Usa la búsqueda para ver más.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Basket Items Section - Lower Priority */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-gray-600" />
              Productos en Canasta ({basket.items.length})
            </h3>

            {basket.items.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">Canasta vacía</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {basket.items.map((item) => {
                  const productFromInventory = products.find(
                    (product) => product.product_id === item.product_id
                  );
                  const remainingStock =
                    productFromInventory?.stockDisponible ??
                    productFromInventory?.cantidad_en_stock ??
                    Math.max(item.product.cantidad_en_stock - item.cantidad, 0);
                  const maxQuantity = remainingStock + item.cantidad;

                  return (
                    <div
                      key={item.basket_item_id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {item.product.imagen_url && (
                            <img
                              src={item.product.imagen_url}
                              alt={item.product.nombre}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {item.product.nombre}
                            </h4>
                            <p className="text-xs text-gray-500">{item.product.categoria}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveItem(item.basket_item_id);
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleUpdateQuantity(item.basket_item_id, item.cantidad - 1);
                            }}
                            className="p-1.5 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.cantidad <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium text-sm">
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleUpdateQuantity(item.basket_item_id, item.cantidad + 1);
                            }}
                            className="p-1.5 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.cantidad >= maxQuantity}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.total_item)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.precio_unitario_snapshot)} c/u
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Total */}
        <div className="border-t-2 border-gray-200 p-4 sm:p-6 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-900">Total:</span>
            <span className="text-3xl font-bold text-green-600">
              {formatCurrency(basket.total)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
