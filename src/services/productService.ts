import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types/database';

export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    return data || [];
  },

  async getById(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', productId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(product: Omit<Product, 'product_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(productId: string, updates: Partial<Omit<Product, 'product_id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('product_id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(productId: string) {
    const { error } = await supabase
      .from('products')
      .update({ activo: false })
      .eq('product_id', productId);

    if (error) throw error;
  },

  async updateStock(productId: string, quantityChange: number) {
    const { error } = await supabase.rpc('update_product_stock', {
      p_product_id: productId,
      p_quantity: quantityChange,
    });

    if (error) throw error;
  },

  async getLowStock(threshold: number = 5) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('activo', true)
      .lte('cantidad_en_stock', threshold)
      .order('cantidad_en_stock');

    if (error) throw error;
    return data || [];
  },

  async getByCategory(categoria: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('activo', true)
      .eq('categoria', categoria)
      .order('nombre');

    if (error) throw error;
    return data || [];
  },

  async search(searchTerm: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('activo', true)
      .or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
      .order('nombre');

    if (error) throw error;
    return data || [];
  },
};
