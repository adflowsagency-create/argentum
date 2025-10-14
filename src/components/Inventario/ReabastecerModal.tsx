import React, { useState } from 'react';
import { X, Upload, Plus, Minus, Search, Package } from 'lucide-react';
import type { Product } from '../../types/database';

interface ReabastecerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestock: (restockData: any) => void;
  products: Product[];
}

interface RestockItem {
  product_id: string;
  product: Product;
  cantidad: number;
  costo_unitario?: number;
}

export default function ReabastecerModal({ isOpen, onClose, onRestock, products }: ReabastecerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [restockItems, setRestockItems] = useState<RestockItem[]>([]);
  const [proveedor, setProveedor] = useState('');

  const filteredProducts = products.filter(product =>
    product.activo &&
    (product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.categoria.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !restockItems.some(item => item.product_id === product.product_id)
  );

  const addProduct = (product: Product) => {
    const newItem: RestockItem = {
      product_id: product.product_id,
      product,
      cantidad: 1,
      costo_unitario: product.costo_unitario
    };
    setRestockItems([...restockItems, newItem]);
    setSearchTerm('');
  };

  const updateQuantity = (productId: string, cantidad: number) => {
    if (cantidad <= 0) {
      setRestockItems(restockItems.filter(item => item.product_id !== productId));
      return;
    }

    setRestockItems(restockItems.map(item =>
      item.product_id === productId ? { ...item, cantidad } : item
    ));
  };

  const updateCost = (productId: string, costo_unitario: number) => {
    setRestockItems(restockItems.map(item =>
      item.product_id === productId ? { ...item, costo_unitario } : item
    ));
  };

  const removeItem = (productId: string) => {
    setRestockItems(restockItems.filter(item => item.product_id !== productId));
  };

  const handleSubmit = () => {
    if (restockItems.length === 0) {
      alert('Agrega al menos un producto para reabastecer');
      return;
    }

    const restockData = {
      proveedor,
      empleado: 'Usuario Actual',
      items: restockItems.map(item => ({
        product_id: item.product_id,
        cantidad: item.cantidad,
        costo_unitario: item.costo_unitario || item.product.costo_unitario
      }))
    };

    onRestock(restockData);
    
    // Reset form
    setRestockItems([]);
    setProveedor('');
    setSearchTerm('');
    onClose();
  };

  const handleClose = () => {
    setRestockItems([]);
    setProveedor('');
    setSearchTerm('');
    onClose();
  };

  const totalItems = restockItems.reduce((sum, item) => sum + item.cantidad, 0);
  const totalCost = restockItems.reduce((sum, item) => 
    sum + (item.cantidad * (item.costo_unitario || item.product.costo_unitario)), 0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reabastecimiento Masivo</h2>
            <p className="text-sm text-gray-500 mt-1">Agrega múltiples productos y cantidades</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Proveedor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor (Opcional)
              </label>
              <input
                type="text"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nombre del proveedor"
              />
            </div>

            {/* Product Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Productos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos para reabastecer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Product Results */}
              {searchTerm && (
                <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.product_id}
                        onClick={() => addProduct(product)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.imagen_url}
                            alt={product.nombre}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{product.nombre}</p>
                            <p className="text-sm text-gray-500">
                              {product.categoria} • Stock actual: {product.cantidad_en_stock}
                            </p>
                          </div>
                          <Plus className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No se encontraron productos
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Restock Items */}
            {restockItems.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Productos a Reabastecer ({restockItems.length})
                </h3>
                
                <div className="space-y-3">
                  {restockItems.map((item) => (
                    <div key={item.product_id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.imagen_url}
                          alt={item.product.nombre}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{item.product.nombre}</h4>
                          <p className="text-sm text-gray-500">
                            Stock actual: {item.product.cantidad_en_stock} • {item.product.categoria}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* Quantity */}
                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Cantidad:</label>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => updateQuantity(item.product_id, item.cantidad - 1)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                value={item.cantidad}
                                onChange={(e) => updateQuantity(item.product_id, Number(e.target.value))}
                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                                min="1"
                              />
                              <button
                                onClick={() => updateQuantity(item.product_id, item.cantidad + 1)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Cost */}
                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Costo:</label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                              <input
                                type="number"
                                value={item.costo_unitario || item.product.costo_unitario}
                                onChange={(e) => updateCost(item.product_id, Number(e.target.value))}
                                className="w-20 pl-6 pr-2 py-1 text-sm border border-gray-300 rounded"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Total de productos: {restockItems.length}
                      </p>
                      <p className="text-sm text-green-700">
                        Total de unidades: {totalItems}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        Costo Total: ${totalCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {restockItems.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay productos seleccionados</p>
                <p className="text-sm text-gray-400">
                  Busca y selecciona productos para reabastecer
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {restockItems.length > 0 && (
              <span>{restockItems.length} productos • {totalItems} unidades</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={restockItems.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Upload className="h-4 w-4 mr-2" />
              Reabastecer ({restockItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}