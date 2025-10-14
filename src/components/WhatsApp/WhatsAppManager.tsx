import React, { useState } from 'react';
import { MessageSquare, Send, Search, Filter, CheckCircle, Clock, AlertCircle, Phone } from 'lucide-react';
import { mockMensajesWhatsApp, mockClientes } from '../../data/mockData';
import type { MensajeWhatsApp, TipoMensajeWhatsApp } from '../../types/database';

const statusColors = {
  'enviado': 'bg-green-100 text-green-800 border-green-200',
  'entregado': 'bg-blue-100 text-blue-800 border-blue-200',
  'leido': 'bg-purple-100 text-purple-800 border-purple-200',
  'fallido': 'bg-red-100 text-red-800 border-red-200',
  'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const statusIcons = {
  'enviado': CheckCircle,
  'entregado': CheckCircle,
  'leido': CheckCircle,
  'fallido': AlertCircle,
  'pendiente': Clock
};

const tipoColors: Record<TipoMensajeWhatsApp, string> = {
  'confirmacion': 'bg-blue-100 text-blue-800',
  'estado': 'bg-green-100 text-green-800',
  'recordatorio': 'bg-amber-100 text-amber-800'
};

export default function WhatsAppManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoMensajeWhatsApp | 'Todos'>('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  const filteredMensajes = mockMensajesWhatsApp.filter(mensaje => {
    const cliente = mockClientes.find(c => c.cliente_id === mensaje.cliente_id);
    const matchesSearch = cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mensaje.payload.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = selectedTipo === 'Todos' || mensaje.tipo === selectedTipo;
    const matchesStatus = selectedStatus === 'Todos' || mensaje.status === selectedStatus;
    
    return matchesSearch && matchesTipo && matchesStatus;
  });

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getClienteNombre = (clienteId: string) => {
    const cliente = mockClientes.find(c => c.cliente_id === clienteId);
    return cliente?.nombre || 'Cliente no encontrado';
  };

  const getClienteTelefono = (clienteId: string) => {
    const cliente = mockClientes.find(c => c.cliente_id === clienteId);
    return cliente?.telefono_whatsapp || '';
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp</h1>
          <p className="text-gray-600 mt-1">Historial de mensajes y comunicaciones</p>
        </div>
        
        <button className="mt-4 lg:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center">
          <Send className="h-4 w-4 mr-2" />
          Enviar Mensaje
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mensajes Enviados</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {mockMensajesWhatsApp.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregados</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {mockMensajesWhatsApp.filter(m => m.status === 'entregado').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Entrega</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">95%</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Respuestas</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100">
              <Phone className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por cliente o contenido del mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value as TipoMensajeWhatsApp | 'Todos')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Todos">Todos los tipos</option>
                <option value="confirmacion">Confirmación</option>
                <option value="estado">Estado</option>
                <option value="recordatorio">Recordatorio</option>
              </select>
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Todos">Todos los estados</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="leido">Leído</option>
              <option value="fallido">Fallido</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Historial de Mensajes ({filteredMensajes.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredMensajes.map((mensaje) => {
            const StatusIcon = statusIcons[mensaje.status as keyof typeof statusIcons] || Clock;
            
            return (
              <div key={mensaje.msg_id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {getClienteNombre(mensaje.cliente_id)}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${tipoColors[mensaje.tipo]}`}>
                          {mensaje.tipo.charAt(0).toUpperCase() + mensaje.tipo.slice(1)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[mensaje.status as keyof typeof statusColors] || statusColors.pendiente}`}>
                          <StatusIcon className="h-3 w-3 inline mr-1" />
                          {mensaje.status.charAt(0).toUpperCase() + mensaje.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(mensaje.created_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {getClienteTelefono(mensaje.cliente_id)}
                      </span>
                      {mensaje.pedido_id && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-blue-600">
                            Pedido #{mensaje.pedido_id}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-400">
                      <p className="text-sm text-gray-800">{mensaje.payload}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredMensajes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            
            <MessageSquare className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron mensajes</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedTipo !== 'Todos' || selectedStatus !== 'Todos'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Los mensajes de WhatsApp aparecerán aquí cuando se envíen'
            }
          </p>
        </div>
      )}

      {/* Connection Status */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <div>
            <p className="text-sm font-medium text-green-800">Evolution API Conectada</p>
            <p className="text-xs text-green-600">
              Última sincronización: {new Date().toLocaleTimeString('es-MX')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}