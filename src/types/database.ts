export interface Product {
  product_id: string;
  nombre: string;
  categoria: string;
  precio_unitario: number;
  costo_unitario: number;
  descripcion?: string;
  cantidad_en_stock: number;
  imagen_url?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  cliente_id: string;
  nombre: string;
  telefono_whatsapp: string;
  email?: string;
  direccion?: string;
  tags: string[];
  estado_ultimo_pedido?: EstadoClientePedido;
  fecha_alta: string;
  ltv: number;
  frecuencia: number;
  created_at: string;
  updated_at: string;
}

export type EstadoPedido = 'Pendiente' | 'Confirmado' | 'Pagado' | 'Entregado' | 'Cancelado';
export type EstadoClientePedido = 'Enviado' | 'Por Pagar' | 'Apartado' | 'Pagado';

export interface Pedido {
  pedido_id: string;
  cliente_id: string;
  live_id?: string;
  estado: EstadoPedido;
  subtotal: number;
  impuestos: number;
  total: number;
  empleado: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export interface PedidoItem {
  pedido_item_id: string;
  pedido_id: string;
  product_id: string;
  cantidad: number;
  precio_unitario_snapshot: number;
  costo_unitario_snapshot: number;
  total_item: number;
}

export interface Reabastecimiento {
  restock_id: string;
  proveedor?: string;
  empleado: string;
  created_at: string;
}

export interface ReabastecimientoItem {
  restock_item_id: string;
  restock_id: string;
  product_id: string;
  cantidad: number;
  costo_unitario: number;
}

export interface Live {
  live_id: string;
  titulo?: string;
  fecha_hora: string;
  notas?: string;
  created_at: string;
}

export type TipoMensajeWhatsApp = 'confirmacion' | 'estado' | 'recordatorio';

export interface MensajeWhatsApp {
  msg_id: string;
  pedido_id?: string;
  cliente_id: string;
  tipo: TipoMensajeWhatsApp;
  payload: string;
  status: string;
  created_at: string;
}

export interface User {
  user_id: string;
  nombre: string;
  email: string;
  rol: 'Admin' | 'Operador' | 'Visor';
  activo: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface DashboardStats {
  ventasHoy: number;
  ventasMes: number;
  pedidosPendientes: number;
  stockBajo: number;
  margenPromedio: number;
  ticketPromedio: number;
}

export interface ProductoVendido {
  nombre: string;
  cantidad_vendida: number;
  ingresos_total: number;
  margen_total: number;
}

export interface ClienteTop {
  nombre: string;
  total_compras: number;
  ltv: number;
  ultima_compra: string;
}