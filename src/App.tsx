import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import PedidosPipeline from './components/Pedidos/PedidosPipeline';
import InventarioTable from './components/Inventario/InventarioTable';
import Dashboard from './components/Analytics/Dashboard';
import LivesManager from './components/Lives/LivesManager';
import ClientesManager from './components/Clientes/ClientesManager';
import ContabilidadManager from './components/Contabilidad/ContabilidadManager';
import ConfiguracionManager from './components/Configuracion/ConfiguracionManager';
import WhatsAppManager from './components/WhatsApp/WhatsAppManager';
import { mockNotifications, markNotificationAsRead, addNotification } from './data/mockData';
import type { Notification } from './types/database';

function App() {
  const [activeModule, setActiveModule] = useState('pedidos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleMarkNotificationRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications([...mockNotifications]);
  };

  const handleAddNotification = (notification: Omit<Notification, 'id' | 'created_at'>) => {
    addNotification(notification);
    setNotifications([...mockNotifications]);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'pedidos':
        return <PedidosPipeline onAddNotification={handleAddNotification} />;
      case 'inventario':
        return <InventarioTable onAddNotification={handleAddNotification} />;
      case 'analytics':
        return <Dashboard />;
      case 'lives':
        return <LivesManager onAddNotification={handleAddNotification} />;
      case 'clientes':
        return <ClientesManager />;
      case 'whatsapp':
        return <WhatsAppManager />;
      case 'contabilidad':
        return <ContabilidadManager />;
      case 'configuracion':
        return <ConfiguracionManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          activeModule={activeModule}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default App;