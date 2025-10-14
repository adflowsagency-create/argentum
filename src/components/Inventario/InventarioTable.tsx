import React, { useState } from 'react';
import { Search, Filter, Plus, Upload, Download, CreditCard as Edit, Trash2, AlertTriangle, Package } from 'lucide-react';
import type { Product } from '../../types/database';
import { mockProducts, addProduct, updateProduct } from '../../data/mockData';
import NuevoProductoModal from './NuevoProductoModal';
import ReabastecerModal from './ReabastecerModal';

interface InventarioTableProps {
  onAddNotification: (notification: any) => void;
}

const categorias = ['Todas', 'Collares', 'Pulseras', 'Brazaletes', 'Dijes', 'Anillos', 'Aretes'];

export default function InventarioTable({ onAddNotification }: InventarioTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [showStockBajo, setShowStockBajo] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showReabastecer, setShowReabastecer] = useState(false);
  const [showNuevoProducto, setShowNuevoProducto] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === 'Todas' || product.categoria === selectedCategoria;
    const matchesStockBajo = !showStockBajo || product.cantidad_en_stock <= 5;
    
    return matchesSearch && matchesCategoria && matchesStockBajo && product.activo;
  });

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  
  const getMargenPorcentaje = (precio: number, costo: number) => {
    const margen = ((precio - costo) / precio) * 100;
    return `${margen.toFixed(1)}%`;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Sin stock' };
    if (stock <= 5) return { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Stock bajo' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'En stock' };
  };

  const handleCreateProduct = (productData: any) => {
    const newProduct: Product = {
      product_id: `${Date.now()}`,
      ...productData,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addProduct(newProduct);
    
    onAddNotification({
      title: 'Producto Creado',
      message: `Nuevo producto "${productData.nombre}" agregado al inventario`,
      type: 'success',
      read: false
    });
  };

  const handleRestock = (restockData: any) => {
    restockData.items.forEach((item: any) => {
      const product = mockProducts.find(p => p.product_id === item.product_id);
      if (product) {
        updateProduct(item.product_id, {
          cantidad_en_stock: product.cantidad_en_stock + item.cantidad,
          costo_unitario: item.costo_unitario || product.costo_unitario,
          updated_at: new Date().toISOString()
        });
      }
    });
    
    onAddNotification({
      title: 'Reabastecimiento Completado',
      message: `Se reabastecieron ${restockData.items.length} productos`,
      type: 'success',
      read: false
    });
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-600 mt-1">Gestiona tus productos y stock</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex space-x-2">
          <button 
            onClick={() => setShowReabastecer(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Reabastecer
          </button>
          <button 
            onClick={() => setShowNuevoProducto(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showStockBajo}
                onChange={(e) => setShowStockBajo(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Solo stock bajo</span>
            </label>
            
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span className="text-sm">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Table/Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margen
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.cantidad_en_stock);
                
                return (
                  <tr key={product.product_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.imagen_url}
                            alt={product.nombre}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {product.product_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {product.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                          {product.cantidad_en_stock}
                        </span>
                        {product.cantidad_en_stock <= 5 && (
                          <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(product.precio_unitario)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(product.costo_unitario)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {getMargenPorcentaje(product.precio_unitario, product.costo_unitario)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setEditingProduct(product.product_id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.cantidad_en_stock);
            
            return (
              <div key={product.product_id} className="p-4 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <img
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                    src={product.imagen_url}
                    alt={product.nombre}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.nombre}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {product.categoria}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                        Stock: {product.cantidad_en_stock}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Precio</p>
                        <p className="font-medium">{formatCurrency(product.precio_unitario)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Costo</p>
                        <p className="font-medium">{formatCurrency(product.costo_unitario)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Margen</p>
                        <p className="font-medium text-green-600">
                          {getMargenPorcentaje(product.precio_unitario, product.costo_unitario)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategoria !== 'Todas' || showStockBajo
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Agrega tu primer producto para comenzar'
            }
          </p>
          <button 
            onClick={() => setShowNuevoProducto(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Agregar Producto
          </button>
        </div>
      )}

      {/* Modals */}
      <NuevoProductoModal
        isOpen={showNuevoProducto}
        onClose={() => setShowNuevoProducto(false)}
        onCreateProduct={handleCreateProduct}
      />
      
      <ReabastecerModal
        isOpen={showReabastecer}
        onClose={() => setShowReabastecer(false)}
        onRestock={handleRestock}
        products={mockProducts}
      />
    </div>
  );
}