import { supabase } from '../lib/supabaseClient';
import type { DashboardStats, ProductoVendido, ClienteTop } from '../types/database';

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayISO = firstDayOfMonth.toISOString();

    const { data: pedidosHoy } = await supabase
      .from('pedidos')
      .select('total')
      .gte('created_at', todayISO)
      .in('estado', ['Confirmado', 'Pagado', 'Entregado']);

    const { data: pedidosMes } = await supabase
      .from('pedidos')
      .select('total')
      .gte('created_at', firstDayISO)
      .in('estado', ['Confirmado', 'Pagado', 'Entregado']);

    const { data: pedidosPendientes, count: countPendientes } = await supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'Pendiente');

    const { data: productsLowStock, count: countLowStock } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('activo', true)
      .lte('cantidad_en_stock', 5);

    const { data: pedidosParaMargen } = await supabase
      .from('pedidos')
      .select('subtotal, total, items:pedido_items(costo_unitario_snapshot, cantidad)')
      .in('estado', ['Confirmado', 'Pagado', 'Entregado']);

    let margenTotal = 0;
    let ventasTotal = 0;

    if (pedidosParaMargen) {
      for (const pedido of pedidosParaMargen) {
        const costoTotal = (pedido.items || []).reduce(
          (sum: number, item: any) => sum + item.costo_unitario_snapshot * item.cantidad,
          0
        );
        const margen = pedido.subtotal - costoTotal;
        margenTotal += margen;
        ventasTotal += pedido.subtotal;
      }
    }

    const margenPromedio = ventasTotal > 0 ? (margenTotal / ventasTotal) * 100 : 0;

    const ventasHoy = (pedidosHoy || []).reduce((sum, p) => sum + (p.total || 0), 0);
    const ventasMes = (pedidosMes || []).reduce((sum, p) => sum + (p.total || 0), 0);

    const totalPedidos = pedidosMes?.length || 0;
    const ticketPromedio = totalPedidos > 0 ? ventasMes / totalPedidos : 0;

    return {
      ventasHoy,
      ventasMes,
      pedidosPendientes: countPendientes || 0,
      stockBajo: countLowStock || 0,
      margenPromedio,
      ticketPromedio,
    };
  },

  async getTopProductos(limit: number = 10): Promise<ProductoVendido[]> {
    const { data } = await supabase
      .from('pedido_items')
      .select(`
        product_id,
        cantidad,
        precio_unitario_snapshot,
        costo_unitario_snapshot,
        product:products(nombre)
      `);

    if (!data) return [];

    const productMap = new Map<string, ProductoVendido>();

    for (const item of data) {
      const existing = productMap.get(item.product_id);
      const ingresos = item.cantidad * item.precio_unitario_snapshot;
      const costo = item.cantidad * item.costo_unitario_snapshot;
      const margen = ingresos - costo;

      if (existing) {
        existing.cantidad_vendida += item.cantidad;
        existing.ingresos_total += ingresos;
        existing.margen_total += margen;
      } else {
        productMap.set(item.product_id, {
          nombre: (item.product as any)?.nombre || 'Producto desconocido',
          cantidad_vendida: item.cantidad,
          ingresos_total: ingresos,
          margen_total: margen,
        });
      }
    }

    return Array.from(productMap.values())
      .sort((a, b) => b.ingresos_total - a.ingresos_total)
      .slice(0, limit);
  },

  async getTopClientes(limit: number = 10): Promise<ClienteTop[]> {
    const { data } = await supabase
      .from('clientes')
      .select(`
        nombre,
        ltv,
        frecuencia,
        pedidos:pedidos(created_at)
      `)
      .order('ltv', { ascending: false })
      .limit(limit);

    if (!data) return [];

    return data.map((cliente: any) => {
      const ultimoPedido = cliente.pedidos?.[0];
      return {
        nombre: cliente.nombre,
        total_compras: cliente.frecuencia,
        ltv: cliente.ltv,
        ultima_compra: ultimoPedido?.created_at || cliente.created_at,
      };
    });
  },

  async getVentasPorDia(dias: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dias);

    const { data } = await supabase
      .from('pedidos')
      .select('created_at, total')
      .gte('created_at', startDate.toISOString())
      .in('estado', ['Confirmado', 'Pagado', 'Entregado'])
      .order('created_at');

    if (!data) return [];

    const ventasPorFecha = new Map<string, { ventas: number; pedidos: number }>();

    for (const pedido of data) {
      const fecha = new Date(pedido.created_at).toISOString().split('T')[0];
      const existing = ventasPorFecha.get(fecha);

      if (existing) {
        existing.ventas += pedido.total;
        existing.pedidos += 1;
      } else {
        ventasPorFecha.set(fecha, {
          ventas: pedido.total,
          pedidos: 1,
        });
      }
    }

    return Array.from(ventasPorFecha.entries())
      .map(([fecha, stats]) => ({
        fecha,
        ...stats,
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  },
};
