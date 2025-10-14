import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  Video,
  Calendar,
  Download,
  BarChart3,
  PieChart
} from 'lucide-react';
import type { DashboardStats, ProductoVendido, ClienteTop } from '../../types/database';

// Mock data
const mockStats: DashboardStats = {
  ventasHoy: 2450.00,
  ventasMes: 45680.00,
  pedidosPendientes: 12,
  stockBajo: 8,
  margenPromedio: 65.4,
  ticketPromedio: 425.50
};

const mockTopProductos: ProductoVendido[] = [
  { nombre: 'Collar Corazón Plata', cantidad_vendida: 45, ingresos_total: 20250.00, margen_total: 12150.00 },
  { nombre: 'Pulsera Perlas Naturales', cantidad_vendida: 32, ingresos_total: 10240.00, margen_total: 6144.00 },
  { nombre: 'Brazalete Oro Rosa', cantidad_vendida: 18, ingresos_total: 12240.00, margen_total: 7344.00 },
  { nombre: 'Dije Estrella Circonias', cantidad_vendida: 28, ingresos_total: 7840.00, margen_total: 5096.00 }
];

const mockTopClientes: ClienteTop[] = [
  { nombre: 'Ana García', total_compras: 8, ltv: 3420.00, ultima_compra: '2024-01-15' },
  { nombre: 'Laura Martínez', total_compras: 6, ltv: 2890.00, ultima_compra: '2024-01-14' },
  { nombre: 'Roberto Silva', total_compras: 5, ltv: 2150.00, ultima_compra: '2024-01-13' },
  { nombre: 'Carmen López', total_compras: 7, ltv: 2980.00, ultima_compra: '2024-01-12' }
];

const ventasPorDia = [
  { fecha: '2024-01-08', ventas: 1200, pedidos: 8 },
  { fecha: '2024-01-09', ventas: 1850, pedidos: 12 },
  { fecha: '2024-01-10', ventas: 2100, pedidos: 15 },
  { fecha: '2024-01-11', ventas: 1650, pedidos: 10 },
  { fecha: '2024-01-12', ventas: 2400, pedidos: 18 },
  { fecha: '2024-01-13', ventas: 1900, pedidos: 13 },
  { fecha: '2024-01-14', ventas: 2200, pedidos: 16 },
  { fecha: '2024-01-15', ventas: 2450, pedidos: 17 }
];

export default function Dashboard() {
  const [selectedPeriodo, setSelectedPeriodo] = useState('7d');

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const statsCards = [
    {
      title: 'Ventas Hoy',
      value: formatCurrency(mockStats.ventasHoy),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12.5%'
    },
    {
      title: 'Ventas del Mes',
      value: formatCurrency(mockStats.ventasMes),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+18.2%'
    },
    {
      title: 'Pedidos Pendientes',
      value: mockStats.pedidosPendientes.toString(),
      icon: ShoppingCart,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      change: '-2'
    },
    {
      title: 'Stock Bajo',
      value: mockStats.stockBajo.toString(),
      icon: Package,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: '+3'
    },
    {
      title: 'Margen Promedio',
      value: `${mockStats.margenPromedio}%`,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+2.1%'
    },
    {
      title: 'Ticket Promedio',
      value: formatCurrency(mockStats.ticketPromedio),
      icon: PieChart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: '+8.3%'
    }
  ];

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analítica & Reportes</h1>
          <p className="text-gray-600 mt-1">Dashboard de rendimiento y métricas clave</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex space-x-2">
          <select
            value={selectedPeriodo}
            onChange={(e) => setSelectedPeriodo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} vs período anterior
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Ventas por Día */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Ventas por Día</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {ventasPorDia.slice(-5).map((day, index) => {
              const maxVentas = Math.max(...ventasPorDia.map(d => d.ventas));
              const percentage = (day.ventas / maxVentas) * 100;
              
              return (
                <div key={day.fecha} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 w-12">
                      {formatDate(day.fecha)}
                    </span>
                    <div className="flex-1 w-32 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(day.ventas)}</p>
                    <p className="text-xs text-gray-500">{day.pedidos} pedidos</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Productos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Productos</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {mockTopProductos.map((producto, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {producto.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {producto.cantidad_vendida} vendidos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(producto.ingresos_total)}
                  </p>
                  <p className="text-xs text-green-600">
                    +{formatCurrency(producto.margen_total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Mejores Clientes</h3>
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Compras</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">LTV</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Última Compra</th>
              </tr>
            </thead>
            <tbody>
              {mockTopClientes.map((cliente, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {cliente.nombre.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {cliente.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {cliente.total_compras}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-green-600">
                    {formatCurrency(cliente.ltv)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDate(cliente.ultima_compra)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}