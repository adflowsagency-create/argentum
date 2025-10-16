import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  Video, 
  BarChart3, 
  Calculator, 
  Settings,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, color: 'text-blue-600' },
  { id: 'inventario', label: 'Inventario', icon: Package, color: 'text-green-600' },
  { id: 'clientes', label: 'Clientes', icon: Users, color: 'text-purple-600' },
  { id: 'lives', label: 'Lives', icon: Video, color: 'text-red-600' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'text-green-500' },
  { id: 'analytics', label: 'Analítica', icon: BarChart3, color: 'text-indigo-600' },
  { id: 'contabilidad', label: 'Contabilidad', icon: Calculator, color: 'text-amber-600' },
  { id: 'configuracion', label: 'Configuración', icon: Settings, color: 'text-gray-600' },
];

export default function Sidebar({ activeModule, onModuleChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Argentum OS</h1>
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onModuleChange(item.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 text-center">
              v1.0
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Plataforma de gestión
            </p>
          </div>
        </div>
      </div>
    </>
  );
}