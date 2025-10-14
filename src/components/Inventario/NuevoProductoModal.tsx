import React, { useState } from 'react';
import { X, Package, Upload } from 'lucide-react';
import type { Product } from '../../types/database';

interface NuevoProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProduct: (productData: Omit<Product, 'product_id' | 'activo' | 'created_at' | 'updated_at'>) => void;
}

const categorias = ['Collares', 'Pulseras', 'Brazaletes', 'Dijes', 'Anillos', 'Aretes'];

export default function NuevoProductoModal({ isOpen, onClose, onCreateProduct }: NuevoProductoModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Collares',
    precio_unitario: 0,
    costo_unitario: 0,
    descripcion: '',
    cantidad_en_stock: 1,
    imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (formData.precio_unitario <= 0) {
      newErrors.precio_unitario = 'El precio debe ser mayor a 0';
    }

    if (formData.costo_unitario < 0) {
      newErrors.costo_unitario = 'El costo no puede ser negativo';
    }

    if (formData.cantidad_en_stock < 0) {
      newErrors.cantidad_en_stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onCreateProduct(formData);
    
    // Reset form
    setFormData({
      nombre: '',
      categoria: 'Collares',
      precio_unitario: 0,
      costo_unitario: 0,
      descripcion: '',
      cantidad_en_stock: 1,
      imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300'
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      categoria: 'Collares',
      precio_unitario: 0,
      costo_unitario: 0,
      descripcion: '',
      cantidad_en_stock: 1,
      imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Producto</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Collar Elegante Plata"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de Venta *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.precio_unitario}
                    onChange={(e) => setFormData({ ...formData, precio_unitario: Number(e.target.value) })}
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.precio_unitario ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                {errors.precio_unitario && (
                  <p className="mt-1 text-sm text-red-600">{errors.precio_unitario}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo Unitario
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.costo_unitario}
                    onChange={(e) => setFormData({ ...formData, costo_unitario: Number(e.target.value) })}
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.costo_unitario ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                {errors.costo_unitario && (
                  <p className="mt-1 text-sm text-red-600">{errors.costo_unitario}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Inicial
                </label>
                <input
                  type="number"
                  value={formData.cantidad_en_stock}
                  onChange={(e) => setFormData({ ...formData, cantidad_en_stock: Number(e.target.value) })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cantidad_en_stock ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="0"
                  placeholder="1"
                />
                {errors.cantidad_en_stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.cantidad_en_stock}</p>
                )}
              </div>
            </div>

            {/* Margin Display */}
            {formData.precio_unitario > 0 && formData.costo_unitario > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Margen de Ganancia:</span>
                  <span className="text-lg font-bold text-green-600">
                    {(((formData.precio_unitario - formData.costo_unitario) / formData.precio_unitario) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-green-700">Ganancia por unidad:</span>
                  <span className="text-sm font-medium text-green-700">
                    ${(formData.precio_unitario - formData.costo_unitario).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Descripción detallada del producto..."
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Subir</span>
                </button>
              </div>
              
              {/* Image Preview */}
              {formData.imagen_url && (
                <div className="mt-3">
                  <img
                    src={formData.imagen_url}
                    alt="Vista previa"
                    className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Package className="h-4 w-4 mr-2" />
            Crear Producto
          </button>
        </div>
      </div>
    </div>
  );
}