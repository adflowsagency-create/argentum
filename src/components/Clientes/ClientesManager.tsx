import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, CreditCard as Edit, Trash2, Phone, Mail, MapPin, Tag, User, X } from 'lucide-react';
import type { Cliente, EstadoClientePedido } from '../../types/database';
import { mockClientes } from '../../data/mockData';

const estadoColors: Record<EstadoClientePedido, string> = {
  'Enviado': 'bg-blue-100 text-blue-800 border-blue-200',
  'Por Pagar': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Apartado': 'bg-purple-100 text-purple-800 border-purple-200',
  'Pagado': 'bg-green-100 text-green-800 border-green-200'
};

const tagColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-yellow-100 text-yellow-800'
];

export default function ClientesManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [selectedEstado, setSelectedEstado] = useState<EstadoClientePedido | 'Todos'>('Todos');
  const [showNuevoCliente, setShowNuevoCliente] = useState(false);

  // Nuevo cliente form state
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    telefono_whatsapp: '',
    email: '',
    direccion: '',
    tags: [] as string[]
  });

  const handleCreateCliente = () => {
    if (!nuevoCliente.nombre.trim() || !nuevoCliente.telefono_whatsapp.trim()) {
      alert('Nombre y teléfono son obligatorios');
      return;
    }

    // Check if phone already exists
    const existingCliente = mockClientes.find(c => c.telefono_whatsapp === nuevoCliente.telefono_whatsapp);
    if (existingCliente) {
      alert('Ya existe un cliente con este teléfono');
      return;
    }

    // Create new client
    const newCliente: Cliente = {
      cliente_id: `cliente_${Date.now()}`,
      nombre: nuevoCliente.nombre,
      telefono_whatsapp: nuevoCliente.telefono_whatsapp,
      email: nuevoCliente.email || undefined,
      direccion: nuevoCliente.direccion || undefined,
      tags: nuevoCliente.tags.length > 0 ? nuevoCliente.tags : ['Nuevo Cliente'],
      ltv: 0,
      frecuencia: 0,
      fecha_alta: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to mock data (in a real app, this would be an API call)
    mockClientes.push(newCliente);

    // Reset form and close modal
    setNuevoCliente({
      nombre: '',
      telefono_whatsapp: '',
      email: '',
      direccion: '',
      tags: []
    });
    setShowNuevoCliente(false);

    alert('Cliente creado exitosamente');
  };

  // Get all unique tags
  const allTags = Array.from(new Set(mockClientes.flatMap(cliente => cliente.tags)));
  
  const filteredClientes = mockClientes.filter(cliente => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.telefono_whatsapp.includes(searchTerm) ||
                         cliente.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'Todos' || cliente.tags.includes(selectedTag);
    const matchesEstado = selectedEstado === 'Todos' || cliente.estado_ultimo_pedido === selectedEstado;
    
    return matchesSearch && matchesTag && matchesEstado;
  });

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">Gestiona tu base de clientes y su historial</p>
        </div>
        
        <button 
          onClick={() => setShowNuevoCliente(true)}
          className="mt-4 lg:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{mockClientes.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes VIP</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {mockClientes.filter(c => c.tags.includes('VIP')).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">LTV Promedio</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(mockClientes.reduce((sum, c) => sum + c.ltv, 0) / mockClientes.length)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nuevos Este Mes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {mockClientes.filter(c => c.tags.includes('Nuevo Cliente')).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-amber-100">
              <Plus className="h-6 w-6 text-amber-600" />
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
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Todos">Todas las etiquetas</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value as EstadoClientePedido | 'Todos')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Enviado">Enviado</option>
              <option value="Por Pagar">Por Pagar</option>
              <option value="Apartado">Apartado</option>
              <option value="Pagado">Pagado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table/Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etiquetas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LTV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compras
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.cliente_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {cliente.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {cliente.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          Cliente desde {formatDate(cliente.fecha_alta)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-400" />
                      {cliente.telefono_whatsapp}
                    </div>
                    {cliente.email && (
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {cliente.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {cliente.tags.map((tag, index) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTagColor(index)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cliente.estado_ultimo_pedido && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${estadoColors[cliente.estado_ultimo_pedido]}`}>
                        {cliente.estado_ultimo_pedido}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(cliente.ltv)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cliente.frecuencia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {filteredClientes.map((cliente) => (
            <div key={cliente.cliente_id} className="p-4 border-b border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">
                    {cliente.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {cliente.nombre}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-1" />
                      {cliente.telefono_whatsapp}
                    </div>
                    
                    {cliente.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-1" />
                        {cliente.email}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cliente.tags.map((tag, index) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTagColor(index)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-gray-500">LTV</p>
                        <p className="font-medium text-green-600">{formatCurrency(cliente.ltv)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Compras</p>
                        <p className="font-medium">{cliente.frecuencia}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Estado</p>
                        {cliente.estado_ultimo_pedido && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${estadoColors[cliente.estado_ultimo_pedido]}`}>
                            {cliente.estado_ultimo_pedido}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedTag !== 'Todos' || selectedEstado !== 'Todos'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Agrega tu primer cliente para comenzar'
            }
          </p>
          <button 
            onClick={() => setShowNuevoCliente(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Agregar Cliente
          </button>
        </div>
      )}

      {/* Nuevo Cliente Modal */}
      {showNuevoCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Nuevo Cliente</h3>
              <button
                onClick={() => setShowNuevoCliente(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Cliente Frecuente', 'VIP', 'Mayorista', 'Revendedora'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const currentTags = nuevoCliente.tags || [];
                          if (currentTags.includes(tag)) {
                            setNuevoCliente({
                              ...nuevoCliente,
                              tags: currentTags.filter(t => t !== tag)
                            });
                          } else {
                            setNuevoCliente({
                              ...nuevoCliente,
                              tags: [...currentTags, tag]
                            });
                          }
                        }}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          (nuevoCliente.tags || []).includes(tag)
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowNuevoCliente(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCliente}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}