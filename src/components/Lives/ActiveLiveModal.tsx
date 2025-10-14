import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Search, User, Phone, Package, DollarSign } from 'lucide-react';
import type { Live, Cliente, Product } from '../../types/database';
import { mockClientes, mockProducts } from '../../data/mockData';

interface ActiveLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveId: string | null;
  lives: (Live & { ventas_total: number; pedidos_count: number; estado: 'programado' | 'activo' | 'finalizado' })[];
  onAddNotification: (notification: any) => void;
}

interface CartItem {
  product: Product;
  cantidad: number;
}

export default function ActiveLiveModal({ isOpen, onClose, liveId, lives, onAddNotification }: ActiveLiveModalProps) {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [clienteSearch, setClienteSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showClienteSelector, setShowClienteSelector] = useState(false);

  const live = lives.find(l => l.live_id === liveId);

  const filteredClientes = mockClientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(clienteSearch.toLowerCase()) ||
    cliente.telefono_whatsapp.includes(clienteSearch)
  );

  const filteredProducts = mockProducts.filter(product =>
    product.activo &&
    product.cantidad_en_stock > 0 &&
    (product.nombre.toLowerCase().includes(productSearch.toLowerCase()) ||
     product.categoria.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.product_id === product.product_id);
    
    if (existingItem) {
      if (existingItem.cantidad >= product.cantidad_en_stock) {
        alert(`Stock máximo: ${product.cantidad_en_stock}`);
        return;
      }
      setCart(cart.map(item =>
        item.product.product_id === product.product_id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, cantidad: 1 }]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.product.product_id !== productId));
      return;
    }

    const product = mockProducts.find(p => p.product_id === productId);
    if (product && newQuantity > product.cantidad_en_stock) {
      alert(`Stock máximo: ${product.cantidad_en_stock}`);
      return;
    }

    setCart(cart.map(item =>
      item.product.product_id === productId
        ? { ...item, cantidad: newQuantity }
        : item
    ));
  };

  const createOrder = () => {
    if (!selectedCliente) {
      alert('Selecciona un cliente');
      return;
    }

    if (cart.length === 0) {
      alert('Agrega productos al carrito');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.precio_unitario * item.cantidad), 0);
    const total = subtotal;

    // Simulate order creation
    const orderId = `live_${Date.now()}`;
    
    onAddNotification({
      title: 'Pedido Creado en Live',
      message: `Pedido #${orderId} de ${selectedCliente.nombre} por $${total.toFixed(2)}`,
      type: 'success',
      read: false
    });

    // Reset cart and client
    setCart([]);
    setSelectedCliente(null);
    setClienteSearch('');
    setShowClienteSelector(false);

    alert(`¡Pedido creado exitosamente!\nCliente: ${selectedCliente.nombre}\nTotal: $${total.toFixed(2)}`);
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.precio_unitario * item.cantidad), 0);

  if (!isOpen || !live) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                🔴 EN VIVO: {live.titulo || `Live #${live.live_id}`}
              </h2>
              <p className="text-sm text-gray-600">Creando pedidos en tiempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[70vh]">
          {/* Left Panel - Products */}
          <div className="flex-1 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Productos Disponibles</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.product_id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
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
                        <span className="text-xs text-gray-500">Stock: {product.cantidad_en_stock}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Cart & Client */}
          <div className="w-96 p-6 bg-gray-50 overflow-y-auto">
            {/* Client Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Cliente</h3>
              {!selectedCliente ? (
                <div>
                  {!showClienteSelector ? (
                    <button
                      onClick={() => setShowClienteSelector(true)}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 transition-colors"
                    >
                      <User className="h-5 w-5 mx-auto mb-1" />
                      Seleccionar Cliente
                    </button>
                  ) : (
                    <div>
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Buscar cliente..."
                          value={clienteSearch}
                          onChange={(e) => setClienteSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {filteredClientes.slice(0, 5).map((cliente) => (
                          <button
                            key={cliente.cliente_id}
                            onClick={() => {
                              setSelectedCliente(cliente);
                              setShowClienteSelector(false);
                              setClienteSearch('');
                            }}
                            className="w-full p-2 text-left hover:bg-gray-100 rounded text-sm"
                          >
                            <div className="font-medium">{cliente.nombre}</div>
                            <div className="text-gray-500">{cliente.telefono_whatsapp}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{selectedCliente.nombre}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {selectedCliente.telefono_whatsapp}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCliente(null);
                        setShowClienteSelector(false);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Carrito ({cart.length})
              </h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Carrito vacío</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.product_id} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.imagen_url}
                          alt={item.product.nombre}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{item.product.nombre}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(item.product.precio_unitario)}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateQuantity(item.product.product_id, item.cantidad - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(item.product.product_id, item.cantidad + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total & Checkout */}
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(cartTotal)}</span>
                </div>
                
                <button
                  onClick={createOrder}
                  disabled={!selectedCliente || cart.length === 0}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Crear Pedido
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}