import React, { useState } from 'react';
import { Search, Plus, Package } from 'lucide-react';
import type { Product } from '../../types/database';

interface ProductSidebarProps {
  products: Product[];
  onAddNewProduct: (product: { nombre: string; precio_unitario: number; cantidad_en_stock: number }) => Promise<void>;
}

export default function ProductSidebar({ products, onAddNewProduct }: ProductSidebarProps) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    precio_unitario: '',
    cantidad_en_stock: '',
  });

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const filteredProducts = products.filter(
    (p) =>
      p.activo &&
      (p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.categoria.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddProduct = async () => {
    if (!newProduct.nombre || !newProduct.precio_unitario || !newProduct.cantidad_en_stock) {
      alert('Por favor completa todos los campos');
      return;
    }

    await onAddNewProduct({
      nombre: newProduct.nombre,
      precio_unitario: parseFloat(newProduct.precio_unitario),
      cantidad_en_stock: parseInt(newProduct.cantidad_en_stock),
    });

    setNewProduct({ nombre: '', precio_unitario: '', cantidad_en_stock: '' });
    setShowAddModal(false);
  };

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Agregar nuevo producto"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hay productos disponibles</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  {product.imagen_url && (
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {product.nombre}
                    </h4>
                    <p className="text-xs text-gray-500">{product.categoria}</p>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      {formatCurrency(product.precio_unitario)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs ${
                          product.cantidad_en_stock > 10
                            ? 'text-gray-600'
                            : product.cantidad_en_stock > 0
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }`}
                      >
                        Stock: {product.cantidad_en_stock}
                      </span>
                      {product.cantidad_en_stock === 0 && (
                        <span className="text-xs font-medium text-red-600">Agotado</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Producto</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  value={newProduct.nombre}
                  onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                  placeholder="Ej: Blusa Floral"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Unitario
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.precio_unitario}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, precio_unitario: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Inicial
                </label>
                <input
                  type="number"
                  value={newProduct.cantidad_en_stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, cantidad_en_stock: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewProduct({ nombre: '', precio_unitario: '', cantidad_en_stock: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
