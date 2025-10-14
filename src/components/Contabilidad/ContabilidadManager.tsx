import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calculator, PieChart, BarChart3, Download, Calendar } from 'lucide-react';
import { mockPedidos, mockProducts } from '../../data/mockData';

export default function ContabilidadManager() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  // Calculate financial metrics
  const calculateMetrics = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    
    let filteredPedidos = mockPedidos;
    
    if (selectedPeriod === 'semana') {
      filteredPedidos = mockPedidos.filter(p => new Date(p.created_at) >= startOfWeek);
    } else if (selectedPeriod === 'mes') {
      filteredPedidos = mockPedidos.filter(p => new Date(p.created_at) >= startOfMonth);
    }

    const ingresos = filteredPedidos.reduce((sum, pedido) => sum + pedido.subtotal, 0);
    const impuestos = filteredPedidos.reduce((sum, pedido) => sum + pedido.impuestos, 0);
    const ventasTotales = filteredPedidos.reduce((sum, pedido) => sum + pedido.total, 0);
    
    // Calculate costs (simplified - using average cost from products)
    const costos = filteredPedidos.reduce((sum, pedido) => {
      // Simulate cost calculation based on average product cost
      return sum + (pedido.subtotal * 0.4); // Assuming 40% cost ratio
    }, 0);
    
    const margenBruto = ingresos - costos;
    const margenPorcentaje = ingresos > 0 ? (margenBruto / ingresos) * 100 : 0;
    
    const ticketPromedio = filteredPedidos.length > 0 ? ventasTotales / filteredPedidos.length : 0;
    
    return {
      ingresos,
      costos,
      margenBruto,
      margenPorcentaje,
      impuestos,
      ventasTotales,
      ticketPromedio,
      numeroPedidos: filteredPedidos.length
    };
  };

  const metrics = calculateMetrics();
  
  const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  // Top products by margin
  const topProductsByMargin = mockProducts
    .map(product => {
      const margen = product.precio_unitario - product.costo_unitario;
      const margenPorcentaje = ((margen / product.precio_unitario) * 100);
      return {
        ...product,
        margen,
        margenPorcentaje
      };
    })
    .sort((a, b) => b.margen - a.margen)
    .slice(0, 5);

  // Margin by category
  const marginByCategory = mockProducts.reduce((acc, product) => {
    if (!acc[product.categoria]) {
      acc[product.categoria] = {
        categoria: product.categoria,
        totalMargen: 0,
        totalVentas: 0,
        count: 0
      };
    }
    
    const margen = product.precio_unitario - product.costo_unitario;
    acc[product.categoria].totalMargen += margen;
    acc[product.categoria].totalVentas += product.precio_unitario;
    acc[product.categoria].count += 1;
    
    return acc;
  }, {} as Record<string, any>);

  const categoryMargins = Object.values(marginByCategory).map((cat: any) => ({
    ...cat,
    margenPromedio: cat.totalMargen / cat.count,
    margenPorcentaje: ((cat.totalMargen / cat.totalVentas) * 100)
  }));

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
          <p className="text-gray-600 mt-1">Análisis financiero y márgenes de ganancia</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mes</option>
            <option value="todo">Todo el Tiempo</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(metrics.ingresos)}</p>
              <p className="text-sm text-green-600 mt-1">+12.5% vs anterior</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Costos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(metrics.costos)}</p>
              <p className="text-sm text-red-600 mt-1">+8.2% vs anterior</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Margen Bruto</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(metrics.margenBruto)}</p>
              <p className="text-sm text-green-600 mt-1">{metrics.margenPorcentaje.toFixed(1)}% margen</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(metrics.ticketPromedio)}</p>
              <p className="text-sm text-blue-600 mt-1">{metrics.numeroPedidos} pedidos</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Top Products by Margin */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Productos por Margen</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {topProductsByMargin.map((product, index) => (
              <div key={product.product_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.nombre}</p>
                    <p className="text-xs text-gray-500">{product.categoria}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {formatCurrency(product.margen)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.margenPorcentaje.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Margin by Category */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Margen por Categoría</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {categoryMargins.map((category, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];
              const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100', 'bg-red-100', 'bg-indigo-100'];
              
              return (
                <div key={category.categoria} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.categoria}</p>
                      <p className="text-xs text-gray-500">{category.count} productos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {category.margenPorcentaje.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(category.margenPromedio)} promedio
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Financial Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen Financiero Detallado</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Estado de Resultados</h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Ingresos por Ventas</span>
                <span className="font-medium">{formatCurrency(metrics.ingresos)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">(-) Costo de Ventas</span>
                <span className="font-medium text-red-600">-{formatCurrency(metrics.costos)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 font-semibold">
                <span className="text-gray-900">Margen Bruto</span>
                <span className="text-green-600">{formatCurrency(metrics.margenBruto)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Impuestos Cobrados</span>
                <span className="font-medium">{formatCurrency(metrics.impuestos)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-lg">
                <span className="text-gray-900">Total Ventas</span>
                <span className="text-blue-600">{formatCurrency(metrics.ventasTotales)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">KPIs Clave</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Margen de Ganancia</span>
                  <span className="text-lg font-bold text-green-600">
                    {metrics.margenPorcentaje.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ticket Promedio</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(metrics.ticketPromedio)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Número de Pedidos</span>
                  <span className="text-lg font-bold text-purple-600">
                    {metrics.numeroPedidos}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ratio Costo/Ingreso</span>
                  <span className="text-lg font-bold text-amber-600">
                    {metrics.ingresos > 0 ? ((metrics.costos / metrics.ingresos) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}