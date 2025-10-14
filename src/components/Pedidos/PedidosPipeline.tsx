import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, CreditCard as Edit, Trash2, MessageSquare, X, ShoppingCart } from 'lucide-react';
import type { Pedido, Cliente, EstadoPedido } from '../../types/database';
import NuevoPedidoModal from './NuevoPedidoModal';
import { mockPedidos } from '../../data/mockData';

interface PedidosPipelineProps {
  onAddNotification: (notification: any) => void;
}

const estadoColors: Record<EstadoPedido, string> = {
  'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Confirmado': 'bg-blue-100 text-blue-800 border-blue-200',
  'Pagado': 'bg-green-100 text-green-800 border-green-200',
  'Entregado': 'bg-gray-100 text-gray-800 border-gray-200',
  'Cancelado': 'bg-red-100 text-red-800 border-red-200'
};

export default function PedidosPipeline({ onAddNotification }: PedidosPipelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<EstadoPedido | 'Todos'>('Todos');
  const [showNuevoPedido, setShowNuevoPedido] = useState(false);
  const [pedidos, setPedidos] = useState(mockPedidos);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showPedidoDetails, setShowPedidoDetails] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedPedidoForNotes, setSelectedPedidoForNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [selectedPedidoForEdit, setSelectedPedidoForEdit] = useState<string | null>(null);

  const filteredPedidos = mockPedidos.filter(pedido => {
    const matchesSearch = pedido.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.pedido_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = selectedEstado === 'Todos' || pedido.estado === selectedEstado;
    return matchesSearch && matchesEstado;
  });

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreatePedido = (pedidoData: any) => {
    // En producción, esto haría una llamada a la API
    const newPedido: Pedido & { cliente: Cliente } = {
      pedido_id: `${Date.now()}`,
      cliente_id: pedidoData.cliente.cliente_id,
      estado: 'Pendiente',
      subtotal: pedidoData.subtotal,
      impuestos: pedidoData.impuestos,
      total: pedidoData.total,
      empleado: pedidoData.empleado,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      cliente: pedidoData.cliente
    };

    setPedidos([newPedido, ...pedidos]);
    
    // Agregar notificación
    onAddNotification({
      title: 'Nuevo Pedido',
      message: `Nuevo pedido #${newPedido.pedido_id} de ${pedidoData.cliente.nombre} por ${formatCurrency(pedidoData.total)}`,
      type: 'success',
      read: false
    });
    
    // Simular envío de WhatsApp
    alert(`Pedido creado exitosamente!\n\nSe enviará confirmación por WhatsApp a ${pedidoData.cliente.telefono_whatsapp}\n\nTotal: $${pedidoData.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`);
  };

  const handleDeleteClick = (pedidoId: string) => {
    setPedidoToDelete(pedidoId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmText === 'ELIMINAR' && pedidoToDelete) {
      // Remove pedido from list
      setPedidos(pedidos.filter(p => p.pedido_id !== pedidoToDelete));
      
      // Add notification
      onAddNotification({
        title: 'Pedido Eliminado',
        message: `El pedido #${pedidoToDelete} ha sido eliminado`,
        type: 'warning',
        read: false
      });
      
      // Reset modal state
      setShowDeleteModal(false);
      setPedidoToDelete(null);
      setDeleteConfirmText('');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPedidoToDelete(null);
    setDeleteConfirmText('');
  };

  const handleViewDetails = (pedidoId: string) => {
    setSelectedPedidoId(pedidoId);
    setShowPedidoDetails(true);
  };

  const handleEditOrder = (pedidoId: string, estado: EstadoPedido) => {
    if (estado === 'Entregado' || estado === 'Cancelado') {
      return;
    }
    setSelectedPedidoForEdit(pedidoId);
    setShowEditOrder(true);
  };

  const handleCloseEditOrder = () => {
    setShowEditOrder(false);
    setSelectedPedidoForEdit(null);
  };

  const handleAddNotes = (pedidoId: string) => {
    const pedido = mockPedidos.find(p => p.pedido_id === pedidoId);
    setSelectedPedidoForNotes(pedidoId);
    setNotesText(pedido?.notas || '');
    setShowNotesModal(true);
  };

  const handleSaveNotes = () => {
    if (selectedPedidoForNotes) {
      // Update the pedido with new notes
      const updatedPedidos = pedidos.map(pedido => 
        pedido.pedido_id === selectedPedidoForNotes 
          ? { ...pedido, notas: notesText, updated_at: new Date().toISOString() }
          : pedido
      );
      setPedidos(updatedPedidos);
      
      // Also update mockPedidos for consistency
      const pedidoIndex = mockPedidos.findIndex(p => p.pedido_id === selectedPedidoForNotes);
      if (pedidoIndex !== -1) {
        mockPedidos[pedidoIndex] = { 
          ...mockPedidos[pedidoIndex], 
          notas: notesText,
          updated_at: new Date().toISOString()
        };
      }
      
      onAddNotification({
        title: 'Notas Actualizadas',
        message: `Se actualizaron las notas del pedido #${selectedPedidoForNotes}`,
        type: 'success',
        read: false
      });
      
      // Reset modal state
      setShowNotesModal(false);
      setSelectedPedidoForNotes(null);
      setNotesText('');
    }
  };

  const handleCancelNotes = () => {
    setShowNotesModal(false);
    setSelectedPedidoForNotes(null);
    setNotesText('');
  };

  const selectedPedido = selectedPedidoId ? mockPedidos.find(p => p.pedido_id === selectedPedidoId) : null;
  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-1">Gestiona tu pipeline de ventas</p>
        </div>
        
        <button 
          onClick={() => setShowNuevoPedido(true)}
          className="mt-4 lg:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Pedido
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por cliente o ID de pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value as EstadoPedido | 'Todos')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Pagado">Pagado</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pipeline Cards */}
      <div className="grid gap-4 md:gap-6">
        {filteredPedidos.map((pedido) => (
          <div key={pedido.pedido_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      #{pedido.pedido_id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${estadoColors[pedido.estado]}`}>
                      {pedido.estado}
                    </span>
                    {pedido.live_id && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        LIVE
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Cliente</p>
                    <p className="font-medium text-gray-900">{pedido.cliente.nombre}</p>
                    <p className="text-gray-500">{pedido.cliente.telefono_whatsapp}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-bold text-lg text-green-600">{formatCurrency(pedido.total)}</p>
                    <p className="text-gray-500">Subtotal: {formatCurrency(pedido.subtotal)}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Fecha</p>
                    <p className="font-medium text-gray-900">{formatDate(pedido.created_at)}</p>
                    <p className="text-gray-500">Por: {pedido.empleado}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(pedido.pedido_id);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditOrder(pedido.pedido_id, pedido.estado);
                  }}
                  disabled={pedido.estado === 'Entregado' || pedido.estado === 'Cancelado'}
                  className={`p-2 rounded-lg transition-colors ${
                    pedido.estado === 'Entregado' || pedido.estado === 'Cancelado'
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNotes(pedido.pedido_id);
                  }}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(pedido.pedido_id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPedidos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ShoppingCart className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedEstado !== 'Todos' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Crea tu primer pedido para comenzar'
            }
          </p>
          <button 
            onClick={() => setShowNuevoPedido(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Crear Pedido
          </button>
        </div>
      )}

      {/* Modal Nuevo Pedido */}
      <NuevoPedidoModal
        isOpen={showNuevoPedido}
        onClose={() => setShowNuevoPedido(false)}
        onCreatePedido={handleCreatePedido}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
              <button
                onClick={handleDeleteCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">¿Eliminar pedido?</h4>
                  <p className="text-sm text-gray-500">Pedido #{pedidoToDelete}</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  <strong>¡Atención!</strong> Esta acción no se puede deshacer. El pedido será eliminado permanentemente.
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Para confirmar, escribe <strong>ELIMINAR</strong> en el campo de abajo:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Escribe ELIMINAR"
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmText !== 'ELIMINAR'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showPedidoDetails && selectedPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Detalles del Pedido #{selectedPedido.pedido_id}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedPedido.created_at)}
                </p>
              </div>
              <button
                onClick={() => setShowPedidoDetails(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {/* Status and Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Estado del Pedido</h4>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-2 rounded-full text-sm font-medium border ${estadoColors[selectedPedido.estado]}`}>
                        {selectedPedido.estado}
                      </span>
                      {selectedPedido.live_id && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          LIVE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Empleado</h4>
                    <p className="text-gray-700">{selectedPedido.empleado}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Información del Cliente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700 font-medium">Nombre</p>
                      <p className="text-blue-800">{selectedPedido.cliente.nombre}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-medium">Teléfono</p>
                      <p className="text-blue-800">{selectedPedido.cliente.telefono_whatsapp}</p>
                    </div>
                    {selectedPedido.cliente.email && (
                      <div>
                        <p className="text-blue-700 font-medium">Email</p>
                        <p className="text-blue-800">{selectedPedido.cliente.email}</p>
                      </div>
                    )}
                    {selectedPedido.cliente.direccion && (
                      <div>
                        <p className="text-blue-700 font-medium">Dirección</p>
                        <p className="text-blue-800">{selectedPedido.cliente.direccion}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedPedido.cliente.tags.length > 0 && (
                    <div className="mt-3">
                      <p className="text-blue-700 font-medium mb-2">Etiquetas</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedPedido.cliente.tags.map((tag, index) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-4">Resumen del Pedido</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Subtotal</span>
                      <span className="font-medium text-green-800">{formatCurrency(selectedPedido.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Impuestos</span>
                      <span className="font-medium text-green-800">{formatCurrency(selectedPedido.impuestos)}</span>
                    </div>
                    <div className="border-t border-green-300 pt-3 flex justify-between">
                      <span className="text-lg font-semibold text-green-900">Total</span>
                      <span className="text-xl font-bold text-green-600">{formatCurrency(selectedPedido.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedPedido.notas && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Notas</h4>
                    <p className="text-yellow-800">{selectedPedido.notas}</p>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Historial</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Pedido creado</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedPedido.created_at)}</p>
                      </div>
                    </div>
                    {selectedPedido.updated_at !== selectedPedido.created_at && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Última actualización</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedPedido.updated_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPedidoDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Editar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Agregar Notas</h3>
                  <p className="text-sm text-gray-500">Pedido #{selectedPedidoForNotes}</p>
                </div>
              </div>
              <button
                onClick={handleCancelNotes}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas del Pedido
                  </label>
                  <textarea
                    rows={6}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Escribe notas adicionales sobre este pedido..."
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Las notas son útiles para recordar detalles especiales, 
                    instrucciones de entrega, o cualquier información relevante del pedido.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelNotes}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNotes}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Guardar Notas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditOrder && selectedPedidoForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Edit className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Editar Pedido</h3>
                  <p className="text-sm text-gray-500">Pedido #{selectedPedidoForEdit}</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditOrder}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Funcionalidad en Desarrollo</p>
                    <p className="text-xs text-blue-700">
                      La edición completa de pedidos estará disponible próximamente.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Order Status Change */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Cambiar Estado del Pedido</h4>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    defaultValue={mockPedidos.find(p => p.pedido_id === selectedPedidoForEdit)?.estado}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Acciones Rápidas</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm bg-white border border-yellow-300 rounded hover:bg-yellow-50 transition-colors">
                        📱 Enviar confirmación por WhatsApp
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm bg-white border border-yellow-300 rounded hover:bg-yellow-50 transition-colors">
                        📧 Enviar detalles por email
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm bg-white border border-yellow-300 rounded hover:bg-yellow-50 transition-colors">
                        🖨️ Imprimir recibo
                      </button>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Restricciones</h4>
                    <div className="space-y-2 text-sm text-red-700">
                      <p>• No se pueden editar pedidos entregados</p>
                      <p>• No se pueden editar pedidos cancelados</p>
                      <p>• Los cambios requieren confirmación</p>
                      <p>• Se notificará al cliente automáticamente</p>
                    </div>
                  </div>
                </div>

                {/* Future Features Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Próximamente Disponible</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-800 mb-1">✏️ Editar Productos</p>
                      <p>Agregar, quitar o modificar productos del pedido</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">👤 Cambiar Cliente</p>
                      <p>Reasignar el pedido a otro cliente</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">💰 Ajustar Precios</p>
                      <p>Aplicar descuentos o modificar precios</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">📅 Programar Entrega</p>
                      <p>Establecer fecha y hora de entrega</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseEditOrder}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Cambios guardados exitosamente');
                  handleCloseEditOrder();
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}