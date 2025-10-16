import { supabase } from '../lib/supabaseClient';
import type { Pedido, PedidoItem } from '../types/database';
import { clienteService } from './clienteService';
import { productService } from './productService';

export const pedidoService = {
  async getAll() {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(pedidoId: string) {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(*),
        items:pedido_items(
          *,
          product:products(*)
        )
      `)
      .eq('pedido_id', pedidoId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(pedido: Omit<Pedido, 'pedido_id' | 'created_at' | 'updated_at'>, items: Omit<PedidoItem, 'pedido_item_id' | 'pedido_id'>[]) {
    const { data: pedidoData, error: pedidoError } = await supabase
      .from('pedidos')
      .insert(pedido)
      .select()
      .single();

    if (pedidoError) throw pedidoError;

    const itemsWithPedidoId = items.map(item => ({
      ...item,
      pedido_id: pedidoData.pedido_id,
    }));

    const { error: itemsError } = await supabase
      .from('pedido_items')
      .insert(itemsWithPedidoId);

    if (itemsError) throw itemsError;

    for (const item of items) {
      await productService.updateStock(item.product_id, -item.cantidad);
    }

    await clienteService.updateMetrics(pedido.cliente_id, pedido.total);

    return pedidoData;
  },

  async updateEstado(pedidoId: string, estado: Pedido['estado']) {
    const { data, error } = await supabase
      .from('pedidos')
      .update({ estado })
      .eq('pedido_id', pedidoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateNotas(pedidoId: string, notas: string) {
    const { data, error } = await supabase
      .from('pedidos')
      .update({ notas })
      .eq('pedido_id', pedidoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(pedidoId: string) {
    const pedido = await this.getById(pedidoId);
    if (!pedido) throw new Error('Pedido no encontrado');

    if (pedido.items) {
      for (const item of pedido.items) {
        await productService.updateStock(item.product_id, item.cantidad);
      }
    }

    const { error } = await supabase
      .from('pedidos')
      .delete()
      .eq('pedido_id', pedidoId);

    if (error) throw error;

    await clienteService.updateMetrics(pedido.cliente_id, -pedido.total);
  },

  async getByEstado(estado: Pedido['estado']) {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .eq('estado', estado)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByCliente(clienteId: string) {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        items:pedido_items(
          *,
          product:products(*)
        )
      `)
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByLive(liveId: string) {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .eq('live_id', liveId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
