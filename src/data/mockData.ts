import type { 
  Product, 
  Cliente, 
  Pedido, 
  Live, 
  MensajeWhatsApp, 
  User, 
  Notification 
} from '../types/database';

// Mock Products
export let mockProducts: Product[] = [
  {
    product_id: '1',
    nombre: 'Collar Corazón Plata',
    categoria: 'Collares',
    precio_unitario: 450.00,
    costo_unitario: 180.00,
    descripcion: 'Elegante collar con dije de corazón en plata 925',
    cantidad_en_stock: 15,
    imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300',
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    product_id: '2',
    nombre: 'Pulsera Perlas Naturales',
    categoria: 'Pulseras',
    precio_unitario: 320.00,
    costo_unitario: 128.00,
    descripcion: 'Pulsera elegante con perlas naturales de agua dulce',
    cantidad_en_stock: 8,
    imagen_url: 'https://images.pexels.com/photos/1454779/pexels-photo-1454779.jpeg?auto=compress&cs=tinysrgb&w=300',
    activo: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-15T11:20:00Z'
  },
  {
    product_id: '3',
    nombre: 'Brazalete Oro Rosa',
    categoria: 'Brazaletes',
    precio_unitario: 680.00,
    costo_unitario: 272.00,
    descripcion: 'Brazalete moderno en oro rosa con acabado mate',
    cantidad_en_stock: 3,
    imagen_url: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300',
    activo: true,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-15T09:15:00Z'
  },
  {
    product_id: '4',
    nombre: 'Dije Estrella Circonias',
    categoria: 'Dijes',
    precio_unitario: 280.00,
    costo_unitario: 98.00,
    descripcion: 'Dije en forma de estrella con circonias brillantes',
    cantidad_en_stock: 0,
    imagen_url: 'https://images.pexels.com/photos/1438254/pexels-photo-1438254.jpeg?auto=compress&cs=tinysrgb&w=300',
    activo: true,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-14T16:45:00Z'
  },
  {
    product_id: '5',
    nombre: 'Anillo Solitario Diamante',
    categoria: 'Anillos',
    precio_unitario: 1200.00,
    costo_unitario: 480.00,
    descripcion: 'Anillo solitario con diamante de 0.5 quilates',
    cantidad_en_stock: 2,
    imagen_url: 'https://images.pexels.com/photos/1454779/pexels-photo-1454779.jpeg?auto=compress&cs=tinysrgb&w=300',
    activo: true,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-15T12:00:00Z'
  },
  {
    product_id: '6',
    nombre: 'Aretes Perla Cultivada',
    categoria: 'Aretes',
    precio_unitario: 380.00,
    costo_unitario: 152.00,
    descripcion: 'Aretes elegantes con perlas cultivadas',
    cantidad_en_stock: 12,
    imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300',
    activo: true,
    created_at: '2024-01-06T00:00:00Z',
    updated_at: '2024-01-15T13:30:00Z'
  }
];

// Mock Clientes
export const mockClientes: Cliente[] = [
  {
    cliente_id: '1',
    nombre: 'Ana García',
    telefono_whatsapp: '+5215555551234',
    email: 'ana.garcia@email.com',
    direccion: 'Av. Reforma 123, CDMX',
    tags: ['Cliente Frecuente', 'VIP'],
    estado_ultimo_pedido: 'Pagado',
    ltv: 2100.00,
    frecuencia: 5,
    fecha_alta: '2023-10-01T00:00:00Z',
    created_at: '2023-10-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    cliente_id: '2',
    nombre: 'Laura Martínez',
    telefono_whatsapp: '+5215555555678',
    email: 'laura.martinez@email.com',
    tags: ['Cliente Frecuente'],
    estado_ultimo_pedido: 'Enviado',
    ltv: 890.00,
    frecuencia: 3,
    fecha_alta: '2023-12-15T00:00:00Z',
    created_at: '2023-12-15T00:00:00Z',
    updated_at: '2024-01-15T14:20:00Z'
  },
  {
    cliente_id: '3',
    nombre: 'Roberto Silva',
    telefono_whatsapp: '+5215555559012',
    tags: ['Mayorista'],
    estado_ultimo_pedido: 'Por Pagar',
    ltv: 1450.00,
    frecuencia: 4,
    fecha_alta: '2023-11-20T00:00:00Z',
    created_at: '2023-11-20T00:00:00Z',
    updated_at: '2024-01-14T16:15:00Z'
  },
  {
    cliente_id: '4',
    nombre: 'Carmen López',
    telefono_whatsapp: '+5215555557890',
    email: 'carmen.lopez@email.com',
    direccion: 'Calle Juárez 456, Guadalajara',
    tags: ['VIP', 'Revendedora'],
    estado_ultimo_pedido: 'Apartado',
    ltv: 2980.00,
    frecuencia: 7,
    fecha_alta: '2023-09-10T00:00:00Z',
    created_at: '2023-09-10T00:00:00Z',
    updated_at: '2024-01-12T08:45:00Z'
  },
  {
    cliente_id: '5',
    nombre: 'Miguel Hernández',
    telefono_whatsapp: '+5215555553456',
    tags: ['Nuevo Cliente'],
    estado_ultimo_pedido: 'Pagado',
    ltv: 450.00,
    frecuencia: 1,
    fecha_alta: '2024-01-10T00:00:00Z',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T15:20:00Z'
  }
];

// Mock Pedidos
export const mockPedidos: (Pedido & { cliente: Cliente })[] = [
  {
    pedido_id: '1',
    cliente_id: '1',
    estado: 'Pendiente',
    subtotal: 450.00,
    impuestos: 72.00,
    total: 522.00,
    empleado: 'María González',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    cliente: mockClientes[0]
  },
  {
    pedido_id: '2',
    cliente_id: '2',
    estado: 'Confirmado',
    subtotal: 320.00,
    impuestos: 51.20,
    total: 371.20,
    empleado: 'Carlos Ruiz',
    live_id: 'live1',
    created_at: '2024-01-15T14:20:00Z',
    updated_at: '2024-01-15T14:45:00Z',
    cliente: mockClientes[1]
  },
  {
    pedido_id: '3',
    cliente_id: '3',
    estado: 'Pagado',
    subtotal: 680.00,
    impuestos: 108.80,
    total: 788.80,
    empleado: 'María González',
    created_at: '2024-01-14T16:15:00Z',
    updated_at: '2024-01-15T09:30:00Z',
    cliente: mockClientes[2]
  }
];

// Mock Lives
export let mockLives: (Live & { ventas_total: number; pedidos_count: number; estado: 'programado' | 'activo' | 'finalizado' })[] = [
  {
    live_id: '1',
    titulo: 'Nuevas Colecciones de Invierno',
    fecha_hora: '2024-01-15T19:00:00Z',
    notas: 'Presentación de collares y pulseras de la nueva temporada',
    created_at: '2024-01-15T10:00:00Z',
    ventas_total: 4250.00,
    pedidos_count: 12,
    estado: 'finalizado'
  },
  {
    live_id: '2',
    titulo: 'Especial San Valentín',
    fecha_hora: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    notas: 'Productos románticos con descuentos especiales',
    created_at: '2024-01-16T09:00:00Z',
    ventas_total: 0,
    pedidos_count: 0,
    estado: 'programado'
  },
  {
    live_id: '3',
    titulo: 'Live Nocturno - Ofertas Flash',
    fecha_hora: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago (should be active)
    notas: 'Liquidación de inventario selecto',
    created_at: '2024-01-14T15:00:00Z',
    ventas_total: 1250.00,
    pedidos_count: 4,
    estado: 'activo'
  }
];

// Mock WhatsApp Messages
export const mockMensajesWhatsApp: MensajeWhatsApp[] = [
  {
    msg_id: '1',
    pedido_id: '1',
    cliente_id: '1',
    tipo: 'confirmacion',
    payload: '¡Hola Ana! Tu pedido #1 ha sido confirmado. Total: $522.00. Collar Corazón Plata x1. ¡Gracias por tu compra!',
    status: 'enviado',
    created_at: '2024-01-15T10:35:00Z'
  },
  {
    msg_id: '2',
    pedido_id: '2',
    cliente_id: '2',
    tipo: 'estado',
    payload: 'Hola Laura, tu pedido #2 está listo para entrega. Total: $371.20. Puedes pasar a recogerlo.',
    status: 'entregado',
    created_at: '2024-01-15T14:50:00Z'
  },
  {
    msg_id: '3',
    cliente_id: '3',
    tipo: 'recordatorio',
    payload: 'Hola Roberto, recordatorio: tienes un pedido pendiente de pago. Total: $788.80. ¡Gracias!',
    status: 'enviado',
    created_at: '2024-01-15T16:00:00Z'
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    user_id: '1',
    nombre: 'María González',
    email: 'maria@argentumos.com',
    rol: 'Admin',
    activo: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    user_id: '2',
    nombre: 'Carlos Ruiz',
    email: 'carlos@argentumos.com',
    rol: 'Operador',
    activo: true,
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    user_id: '3',
    nombre: 'Ana Viewer',
    email: 'ana.viewer@argentumos.com',
    rol: 'Visor',
    activo: true,
    created_at: '2024-01-03T00:00:00Z'
  }
];

// Mock Notifications
export let mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Live Iniciado',
    message: 'El live "Live Nocturno - Ofertas Flash" ha comenzado',
    type: 'info',
    read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Stock Bajo',
    message: 'El producto "Brazalete Oro Rosa" tiene solo 3 unidades en stock',
    type: 'warning',
    read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Nuevo Pedido',
    message: 'Nuevo pedido #1 de Ana García por $522.00',
    type: 'success',
    read: true,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

// Helper functions to update mock data
export const addProduct = (product: Product) => {
  mockProducts.push(product);
};

export const updateProduct = (productId: string, updates: Partial<Product>) => {
  const index = mockProducts.findIndex(p => p.product_id === productId);
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...updates };
  }
};

export const updateLiveStatus = (liveId: string, estado: 'programado' | 'activo' | 'finalizado') => {
  const index = mockLives.findIndex(l => l.live_id === liveId);
  if (index !== -1) {
    mockLives[index].estado = estado;
  }
};

export const addNotification = (notification: Omit<Notification, 'id' | 'created_at'>) => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  mockNotifications.unshift(newNotification);
};

export const markNotificationAsRead = (notificationId: string) => {
  const index = mockNotifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    mockNotifications[index].read = true;
  }
};