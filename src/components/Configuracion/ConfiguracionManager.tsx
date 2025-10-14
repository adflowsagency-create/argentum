import React, { useState } from 'react';
import { Settings, Bell, Users, Shield, MessageSquare, Tag, Save, Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { mockUsers } from '../../data/mockData';

export default function ConfiguracionManager() {
  const [activeTab, setActiveTab] = useState('notificaciones');
  const [showNewUser, setShowNewUser] = useState(false);

  const tabs = [
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'permisos', label: 'Permisos', icon: Shield },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'categorias', label: 'Categorías', icon: Tag }
  ];

  const renderNotificaciones = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Notificaciones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Nuevos Pedidos</h4>
              <p className="text-sm text-gray-500">Recibir notificación cuando se cree un nuevo pedido</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Stock Bajo</h4>
              <p className="text-sm text-gray-500">Alertar cuando un producto tenga stock bajo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Lives Iniciados</h4>
              <p className="text-sm text-gray-500">Notificar cuando un live programado inicie</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Reabastecimientos</h4>
              <p className="text-sm text-gray-500">Confirmar cuando se complete un reabastecimiento</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Umbral de Stock Bajo</h4>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            defaultValue={5}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
          />
          <span className="text-sm text-gray-600">unidades o menos</span>
        </div>
      </div>
    </div>
  );

  const renderUsuarios = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Gestión de Usuarios</h3>
        <button
          onClick={() => setShowNewUser(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockUsers.map((user) => (
              <tr key={user.user_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.nombre.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.rol === 'Admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : user.rol === 'Operador'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.activo 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPermisos = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Configuración de Permisos por Rol</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-medium text-purple-900 mb-4">Administrador</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-800">Ver todo</span>
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-800">Crear/Editar</span>
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-800">Eliminar</span>
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-800">Configuración</span>
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-800">Reportes</span>
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
            </div>
          </div>
        </div>

        {/* Operador */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-4">Operador</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Ver pedidos/inventario</span>
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Crear/Editar pedidos</span>
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Reabastecer</span>
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Eliminar</span>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Configuración</span>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Visor */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Visor</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Ver analítica</span>
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Ver reportes</span>
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Crear/Editar</span>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Eliminar</span>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Configuración</span>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWhatsApp = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Plantillas de WhatsApp</h3>
      
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-3">Confirmación de Pedido</h4>
          <textarea
            rows={4}
            defaultValue="¡Hola {cliente}! Tu pedido #{pedido_id} ha sido confirmado. Total: {total}. {productos}. ¡Gracias por tu compra!"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          <div className="mt-2 text-xs text-gray-500">
            Variables disponibles: {'{cliente}'}, {'{pedido_id}'}, {'{total}'}, {'{productos}'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-3">Cambio de Estado</h4>
          <textarea
            rows={3}
            defaultValue="Hola {cliente}, tu pedido #{pedido_id} está {estado}. Total: {total}. Puedes pasar a recogerlo."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          <div className="mt-2 text-xs text-gray-500">
            Variables disponibles: {'{cliente}'}, {'{pedido_id}'}, {'{estado}'}, {'{total}'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-3">Recordatorio</h4>
          <textarea
            rows={3}
            defaultValue="Hola {cliente}, recordatorio: tienes un pedido pendiente de pago. Total: {total}. ¡Gracias!"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          <div className="mt-2 text-xs text-gray-500">
            Variables disponibles: {'{cliente}'}, {'{total}'}, {'{dias_pendiente}'}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">Configuración Evolution API</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">URL del Servidor</label>
            <input
              type="url"
              placeholder="https://api.evolution.com"
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">Token de API</label>
            <input
              type="password"
              placeholder="••••••••••••••••"
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategorias = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Categorías de Productos</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Collares', 'Pulseras', 'Brazaletes', 'Dijes', 'Anillos', 'Aretes'].map((categoria, index) => (
          <div key={categoria} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'][index]}`} />
                <span className="font-medium text-gray-900">{categoria}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Etiquetas de Clientes</h4>
        <div className="flex flex-wrap gap-2">
          {['Cliente Frecuente', 'VIP', 'Mayorista', 'Revendedora', 'Nuevo Cliente'].map((tag, index) => (
            <span
              key={tag}
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                ['bg-blue-100 text-blue-800', 'bg-purple-100 text-purple-800', 'bg-green-100 text-green-800', 'bg-pink-100 text-pink-800', 'bg-yellow-100 text-yellow-800'][index]
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Personaliza tu experiencia en Argentum OS</p>
        </div>
        
        <button className="mt-4 lg:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'notificaciones' && renderNotificaciones()}
        {activeTab === 'usuarios' && renderUsuarios()}
        {activeTab === 'permisos' && renderPermisos()}
        {activeTab === 'whatsapp' && renderWhatsApp()}
        {activeTab === 'categorias' && renderCategorias()}
      </div>
    </div>
  );
}