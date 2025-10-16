import { supabase } from '../lib/supabaseClient';
import type { Cliente } from '../types/database';

export const clienteService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre');

    if (error) throw error;
    return data || [];
  },

  async getById(clienteId: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('cliente_id', clienteId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(cliente: Omit<Cliente, 'cliente_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(clienteId: string, updates: Partial<Omit<Cliente, 'cliente_id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('cliente_id', clienteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(clienteId: string) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('cliente_id', clienteId);

    if (error) throw error;
  },

  async updateMetrics(clienteId: string, pedidoTotal: number) {
    const cliente = await this.getById(clienteId);
    if (!cliente) return;

    const { error } = await supabase
      .from('clientes')
      .update({
        ltv: cliente.ltv + pedidoTotal,
        frecuencia: cliente.frecuencia + 1,
      })
      .eq('cliente_id', clienteId);

    if (error) throw error;
  },

  async search(searchTerm: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .or(`nombre.ilike.%${searchTerm}%,telefono_whatsapp.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .order('nombre');

    if (error) throw error;
    return data || [];
  },

  async getByTag(tag: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .contains('tags', [tag])
      .order('nombre');

    if (error) throw error;
    return data || [];
  },

  async getTopClientes(limit: number = 10) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('ltv', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
