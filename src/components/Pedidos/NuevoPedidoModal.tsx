import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Minus, User, Phone, Mail, MapPin, AlertTriangle, ShoppingCart, Package } from 'lucide-react';
import type { Cliente, Product, PedidoItem } from '../../types/database';
import { mockClientes, mockProducts, addProduct } from '../../data/mockData';

interface NuevoPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePedido: (pedidoData: any) => void;
}

export default function NuevoPedidoModal({ isOpen, onClose, onCreatePedido }: NuevoPedidoModalProps) {
  const [step, setStep] = useState<'cliente' | 'productos' | 'resumen'>('cliente');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showNuevoCliente, setShowNuevoCliente] = useState(false);
  const [showNuevoProducto, setShowNuevoProducto] = useState(false);
  const [clienteSearch, setClienteSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [cartItems, setCartItems] = useState<(PedidoItem & { product: Product })[]>([]);

  // Nuevo cliente form
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    telefono_whatsapp: '',
    email: '',
    direccion: ''
  });

  // Nuevo producto form
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: 'Collares',
    precio_unitario: 0,
    costo_unitario: 0,
    cantidad_en_stock: 1,
    descripcion: '',
    imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300'
  });

  const filteredClientes = mockClientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(clienteSearch.toLowerCase()) ||
    cliente.telefono_whatsapp.includes(clienteSearch)
  );

  const filteredProducts = mockProducts.filter(product =>
    product.activo &&
    (product.nombre.toLowerCase().includes(productSearch.toLowerCase()) ||
     product.categoria.toLowerCase().includes(productSearch.toLowerCase()))
  ).sort((a, b) => {
    // Productos más vendidos arriba (simulado por frecuencia de compra)
    if (a.categoria === 'Collares' && b.categoria !== 'Collares') return -1;
    if (b.categoria === 'Collares' && a.categoria !== 'Collares') return 1;
    return b.precio_unitario - a.precio_unitario;
  });

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product_id === product.product_id);
    
    if (existingItem) {
      if (existingItem.cantidad >= product.cantidad_en_stock) {
        alert(`No hay suficiente stock. Disponible: ${product.cantidad_en_stock}`);
        return;
      }
      
      setCartItems(cartItems.map(item =>
        item.product_id === product.product_id
          ? { ...item, cantidad: item.cantidad + 1, total_item: (item.cantidad + 1) * item.precio_unitario_snapshot }
          : item
      ));
    } else {
      if (product.cantidad_en_stock === 0) {
        alert('Producto sin stock disponible');
        return;
      }
      
      const newItem: PedidoItem & { product: Product } = {
        pedido_item_id: `temp_${Date.now()}`,
        pedido_id: '',
        product_id: product.product_id,
        cantidad: 1,
        precio_unitario_snapshot: product.precio_unitario,
        costo_unitario_snapshot: product.costo_unitario,
        total_item: product.precio_unitario,
        product
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.product_id !== productId));
      return;
    }

    const product = mockProducts.find(p => p.product_id === productId);
    if (product && newQuantity > product.cantidad_en_stock) {
      alert(`No hay suficiente stock. Disponible: ${product.cantidad_en_stock}`);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.product_id === productId
        ? { ...item, cantidad: newQuantity, total_item: newQuantity * item.precio_unitario_snapshot }
        : item
    ));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total_item, 0);
  const total = subtotal; // Sin impuestos como solicitado

  const handleCreateCliente = () => {
    if (!nuevoCliente.nombre || !nuevoCliente.telefono_whatsapp) {
      alert('Nombre y teléfono son obligatorios');
      return;
    }

    // Verificar que no exista el teléfono
    const existingCliente = mockClientes.find(c => c.telefono_whatsapp === nuevoCliente.telefono_whatsapp);
    if (existingCliente) {
      alert('Ya existe un cliente con este teléfono');
      return;
    }

    const newCliente: Cliente = {
      cliente_id: `temp_${Date.now()}`,
      ...nuevoCliente,
      tags: ['Nuevo Cliente'],
      ltv: 0,
      frecuencia: 0,
      fecha_alta: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setSelectedCliente(newCliente);
    setShowNuevoCliente(false);
    setStep('productos');
  };

  const handleCreateProducto = () => {
    if (!nuevoProducto.nombre || nuevoProducto.precio_unitario <= 0) {
      alert('Nombre y precio son obligatorios');
      return;
    }

    const newProduct: Product = {
      product_id: `temp_${Date.now()}`,
      ...nuevoProducto,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addProduct(newProduct);
    setShowNuevoProducto(false);
    setNuevoProducto({
      nombre: '',
      categoria: 'Collares',
      precio_unitario: 0,
      costo_unitario: 0,
      cantidad_en_stock: 1,
      descripcion: '',
      imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300'
    });
    
    // Agregar automáticamente al carrito
    addToCart(newProduct);
  };

  const handleCreatePedido = () => {
    if (!selectedCliente || cartItems.length === 0) return;

    const pedidoData = {
      cliente: selectedCliente,
      items: cartItems,
      subtotal,
      impuestos: 0, // Sin impuestos
      total,
      empleado: 'Usuario Actual' // En producción vendría del contexto de usuario
    };

    onCreatePedido(pedidoData);
    
    // Reset form
    setStep('cliente');
    setSelectedCliente(null);
    setCartItems([]);
    setClienteSearch('');
    setProductSearch('');
    setNuevoCliente({ nombre: '', telefono_whatsapp: '', email: '', direccion: '' });
    onClose();
  };

  const resetForm = () => {
    setStep('cliente');
    setSelectedCliente(null);
    setShowNuevoCliente(false);
    setShowNuevoProducto(false);
    setCartItems([]);
    setClienteSearch('');
    setProductSearch('');
    setNuevoCliente({ nombre: '', telefono_whatsapp: '', email: '', direccion: '' });
    setNuevoProducto({
      nombre: '',
      categoria: 'Collares',
      precio_unitario: 0,
      costo_unitario: 0,
      cantidad_en_stock: 1,
      descripcion: '',
      imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Pedido</h2>
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'cliente' ? 'text-blue-600' : step === 'productos' || step === 'resumen' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'cliente' ? 'bg-blue-100' : step === 'productos' || step === 'resumen' ? 'bg-green-100' : 'bg-gray-100'}`}>
                1
              </div>
              <span className="text-sm font-medium">Cliente</span>
            </div>
            <div className={`w-8 h-px ${step === 'productos' || step === 'resumen' ? 'bg-green-300' : 'bg-gray-300'}`} />
            <div className={`flex items-center space-x-2 ${step === 'productos' ? 'text-blue-600' : step === 'resumen' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'productos' ? 'bg-blue-100' : step === 'resumen' ? 'bg-green-100' : 'bg-gray-100'}`}>
                2
              </div>
              <span className="text-sm font-medium">Productos</span>
            </div>
            <div className={`w-8 h-px ${step === 'resumen' ? 'bg-green-300' : 'bg-gray-300'}`} />
            <div className={`flex items-center space-x-2 ${step === 'resumen' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'resumen' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="text-sm font-medium">Resumen</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 'cliente' && (
            <div className="space-y-6">
              {!showNuevoCliente ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar Cliente
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
                        value={clienteSearch}
                        onChange={(e) => setClienteSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {clienteSearch && (
                    <div className="space-y-2">
                      {filteredClientes.length > 0 ? (
                        filteredClientes.map((cliente) => (
                          <div
                            key={cliente.cliente_id}
                            onClick={() => setSelectedCliente(cliente)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedCliente?.cliente_id === cliente.cliente_id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{cliente.nombre}</h4>
                                <p className="text-sm text-gray-500">{cliente.telefono_whatsapp}</p>
                                {cliente.email && (
                                  <p className="text-sm text-gray-500">{cliente.email}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-600">
                                  LTV: {formatCurrency(cliente.ltv)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {cliente.frecuencia} compras
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No se encontró el cliente</p>
                          <button
                            onClick={() => setShowNuevoCliente(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Crear Nuevo Cliente
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!clienteSearch && (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Busca un cliente existente o crea uno nuevo</p>
                      <button
                        onClick={() => setShowNuevoCliente(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Nuevo Cliente
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Nuevo Cliente</h3>
                    <button
                      onClick={() => setShowNuevoCliente(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={nuevoCliente.nombre}
                        onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={nuevoCliente.telefono_whatsapp}
                        onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono_whatsapp: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+52 55 1234 5678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={nuevoCliente.email}
                        onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="email@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={nuevoCliente.direccion}
                        onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dirección completa"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreateCliente}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Crear Cliente y Continuar
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'productos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Agregar Productos</h3>
                  <p className="text-sm text-gray-500">Cliente: {selectedCliente?.nombre}</p>
                </div>
                <button
                  onClick={() => setStep('cliente')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Cambiar Cliente
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.product_id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={product.imagen_url}
                        alt={product.nombre}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.nombre}</h4>
                        <p className="text-sm text-gray-500">{product.categoria}</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(product.precio_unitario)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.cantidad_en_stock === 0 
                              ? 'bg-red-100 text-red-800' 
                              : product.cantidad_en_stock <= 5 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            Stock: {product.cantidad_en_stock}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={product.cantidad_en_stock === 0}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart */}
              {cartItems.length > 0 && (
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Carrito ({cartItems.length} productos)</h4>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product.imagen_url}
                            alt={item.product.nombre}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{item.product.nombre}</p>
                            <p className="text-sm text-gray-500">{formatCurrency(item.precio_unitario_snapshot)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.cantidad - 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.cantidad}</span>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.cantidad + 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              disabled={item.cantidad >= item.product.cantidad_en_stock}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-medium text-gray-900 w-20 text-right">
                            {formatCurrency(item.total_item)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'resumen' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del Pedido</h3>
                
                {/* Cliente Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Nombre</p>
                      <p className="font-medium">{selectedCliente?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Teléfono</p>
                      <p className="font-medium">{selectedCliente?.telefono_whatsapp}</p>
                    </div>
                    {selectedCliente?.email && (
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{selectedCliente.email}</p>
                      </div>
                    )}
                    {selectedCliente?.direccion && (
                      <div>
                        <p className="text-gray-500">Dirección</p>
                        <p className="font-medium">{selectedCliente.direccion}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Productos */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium text-gray-900">Productos</h4>
                  {cartItems.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.imagen_url}
                          alt={item.product.nombre}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.product.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {item.cantidad} x {formatCurrency(item.precio_unitario_snapshot)}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(item.total_item)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-green-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {step !== 'cliente' && (
              <button
                onClick={() => setStep(step === 'resumen' ? 'productos' : 'cliente')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => { resetForm(); onClose(); }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            
            {step === 'cliente' && selectedCliente && (
              <button
                onClick={() => setStep('productos')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuar
              </button>
            )}
            
            {step === 'productos' && cartItems.length > 0 && (
              <button
                onClick={() => setStep('resumen')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Revisar Pedido
              </button>
            )}
            
            {step === 'resumen' && (
              <button
                onClick={handleCreatePedido}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Crear Pedido
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nuevo Producto Modal */}
      {showNuevoProducto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Crear Producto Rápido</h3>
              <button
                onClick={() => setShowNuevoProducto(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Collar Especial Live"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={nuevoProducto.categoria}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Collares">Collares</option>
                    <option value="Pulseras">Pulseras</option>
                    <option value="Brazaletes">Brazaletes</option>
                    <option value="Dijes">Dijes</option>
                    <option value="Anillos">Anillos</option>
                    <option value="Aretes">Aretes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    value={nuevoProducto.cantidad_en_stock}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad_en_stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Venta *
                  </label>
                  <input
                    type="number"
                    value={nuevoProducto.precio_unitario}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio_unitario: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo
                  </label>
                  <input
                    type="number"
                    value={nuevoProducto.costo_unitario}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, costo_unitario: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={nuevoProducto.descripcion}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Descripción del producto..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowNuevoProducto(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProducto}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Package className="h-4 w-4 mr-2" />
                Crear y Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}