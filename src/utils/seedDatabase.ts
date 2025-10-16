import { supabase } from '../lib/supabaseClient';

export async function seedDatabase() {
  console.log('🌱 Iniciando seed de base de datos...');

  try {
    // 1. Productos
    console.log('📦 Insertando productos...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert([
        {
          nombre: 'Collar Corazón Plata',
          categoria: 'Collares',
          precio_unitario: 450.00,
          costo_unitario: 180.00,
          descripcion: 'Elegante collar con dije de corazón en plata 925',
          cantidad_en_stock: 15,
          imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        },
        {
          nombre: 'Pulsera Perlas Naturales',
          categoria: 'Pulseras',
          precio_unitario: 320.00,
          costo_unitario: 128.00,
          descripcion: 'Pulsera elegante con perlas naturales de agua dulce',
          cantidad_en_stock: 8,
          imagen_url: 'https://images.pexels.com/photos/1454779/pexels-photo-1454779.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        },
        {
          nombre: 'Brazalete Oro Rosa',
          categoria: 'Brazaletes',
          precio_unitario: 680.00,
          costo_unitario: 272.00,
          descripcion: 'Brazalete moderno en oro rosa con acabado mate',
          cantidad_en_stock: 3,
          imagen_url: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        },
        {
          nombre: 'Dije Estrella Circonias',
          categoria: 'Dijes',
          precio_unitario: 280.00,
          costo_unitario: 98.00,
          descripcion: 'Dije en forma de estrella con circonias brillantes',
          cantidad_en_stock: 0,
          imagen_url: 'https://images.pexels.com/photos/1438254/pexels-photo-1438254.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        },
        {
          nombre: 'Anillo Solitario Diamante',
          categoria: 'Anillos',
          precio_unitario: 1200.00,
          costo_unitario: 480.00,
          descripcion: 'Anillo solitario con diamante de 0.5 quilates',
          cantidad_en_stock: 2,
          imagen_url: 'https://images.pexels.com/photos/1454779/pexels-photo-1454779.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        },
        {
          nombre: 'Aretes Perla Cultivada',
          categoria: 'Aretes',
          precio_unitario: 380.00,
          costo_unitario: 152.00,
          descripcion: 'Aretes elegantes con perlas cultivadas',
          cantidad_en_stock: 12,
          imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        },
        {
          nombre: 'Collar Cadena Infinito',
          categoria: 'Collares',
          precio_unitario: 520.00,
          costo_unitario: 208.00,
          descripcion: 'Collar con símbolo de infinito en oro blanco',
          cantidad_en_stock: 10,
          imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        },
        {
          nombre: 'Pulsera Eslabones Plata',
          categoria: 'Pulseras',
          precio_unitario: 420.00,
          costo_unitario: 168.00,
          descripcion: 'Pulsera de eslabones gruesos en plata sterling',
          cantidad_en_stock: 6,
          imagen_url: 'https://images.pexels.com/photos/1454779/pexels-photo-1454779.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        },
        {
          nombre: 'Anillo Piedra Lunar',
          categoria: 'Anillos',
          precio_unitario: 580.00,
          costo_unitario: 232.00,
          descripcion: 'Anillo con piedra lunar natural engastada',
          cantidad_en_stock: 4,
          imagen_url: 'https://images.pexels.com/photos/1454779/pexels-photo-1454779.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        },
        {
          nombre: 'Aretes Cristal Swarovski',
          categoria: 'Aretes',
          precio_unitario: 460.00,
          costo_unitario: 184.00,
          descripcion: 'Aretes con cristales Swarovski auténticos',
          cantidad_en_stock: 18,
          imagen_url: 'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=300',
          activo: true
        }
      ])
      .select();

    if (productsError) throw productsError;
    console.log(`✅ ${products?.length} productos insertados`);

    // 2. Clientes
    console.log('👥 Insertando clientes...');
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .insert([
        {
          nombre: 'Ana García',
          telefono_whatsapp: '+5215555551234',
          email: 'ana.garcia@email.com',
          direccion: 'Av. Reforma 123, CDMX',
          tags: ['Cliente Frecuente', 'VIP'],
          ltv: 2100.00,
          frecuencia: 5,
          fecha_alta: new Date('2023-10-01').toISOString()
        },
        {
          nombre: 'Laura Martínez',
          telefono_whatsapp: '+5215555555678',
          email: 'laura.martinez@email.com',
          tags: ['Cliente Frecuente'],
          ltv: 890.00,
          frecuencia: 3,
          fecha_alta: new Date('2023-12-15').toISOString()
        },
        {
          nombre: 'Roberto Silva',
          telefono_whatsapp: '+5215555559012',
          tags: ['Mayorista'],
          ltv: 1450.00,
          frecuencia: 4,
          fecha_alta: new Date('2023-11-20').toISOString()
        },
        {
          nombre: 'Carmen López',
          telefono_whatsapp: '+5215555557890',
          email: 'carmen.lopez@email.com',
          direccion: 'Calle Juárez 456, Guadalajara',
          tags: ['VIP', 'Revendedora'],
          ltv: 2980.00,
          frecuencia: 7,
          fecha_alta: new Date('2023-09-10').toISOString()
        },
        {
          nombre: 'Miguel Hernández',
          telefono_whatsapp: '+5215555553456',
          tags: ['Nuevo Cliente'],
          ltv: 450.00,
          frecuencia: 1,
          fecha_alta: new Date('2024-01-10').toISOString()
        },
        {
          nombre: 'Patricia Ruiz',
          telefono_whatsapp: '+5215555552345',
          email: 'patricia.ruiz@email.com',
          tags: ['Cliente Frecuente'],
          ltv: 1250.00,
          frecuencia: 4,
          fecha_alta: new Date('2023-11-05').toISOString()
        },
        {
          nombre: 'José Ramírez',
          telefono_whatsapp: '+5215555556789',
          direccion: 'Av. Insurgentes 789, CDMX',
          tags: ['Mayorista', 'VIP'],
          ltv: 3500.00,
          frecuencia: 8,
          fecha_alta: new Date('2023-08-20').toISOString()
        },
        {
          nombre: 'María González',
          telefono_whatsapp: '+5215555554321',
          email: 'maria.gonzalez@email.com',
          tags: ['Nuevo Cliente'],
          ltv: 320.00,
          frecuencia: 1,
          fecha_alta: new Date('2024-01-15').toISOString()
        }
      ])
      .select();

    if (clientesError) throw clientesError;
    console.log(`✅ ${clientes?.length} clientes insertados`);

    // 3. Lives
    console.log('📺 Insertando lives...');
    const now = new Date();
    const { data: lives, error: livesError } = await supabase
      .from('lives')
      .insert([
        {
          titulo: 'Nuevas Colecciones de Invierno',
          fecha_hora: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días atrás
          estado: 'finalizado',
          notas: 'Presentación de collares y pulseras de la nueva temporada'
        },
        {
          titulo: 'Especial Día de las Madres',
          fecha_hora: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días atrás
          estado: 'finalizado',
          notas: 'Live especial con descuentos en joyería para mamá'
        },
        {
          titulo: 'Live de Anillos de Compromiso',
          fecha_hora: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // En 2 días
          estado: 'programado',
          notas: 'Presentación de colección de anillos de compromiso y matrimonio'
        },
        {
          titulo: 'Ofertas Flash - Joyería de Plata',
          fecha_hora: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // En 5 días
          estado: 'programado',
          notas: 'Descuentos especiales en toda la línea de plata 925'
        },
        {
          titulo: 'Liquidación de Temporada',
          fecha_hora: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 días atrás
          estado: 'finalizado',
          notas: 'Liquidación de inventario de temporada pasada'
        }
      ])
      .select();

    if (livesError) throw livesError;
    console.log(`✅ ${lives?.length} lives insertados`);

    // 4. Pedidos con items
    console.log('🛒 Insertando pedidos...');

    if (!clientes || !products || !lives) {
      throw new Error('No se pudieron obtener datos necesarios para crear pedidos');
    }

    const pedidosData = [
      {
        cliente_id: clientes[0].cliente_id,
        estado: 'Pendiente' as const,
        subtotal: 450.00,
        impuestos: 72.00,
        total: 522.00,
        empleado: 'María González',
        notas: 'Cliente requiere entrega urgente',
        items: [
          {
            product_id: products[0].product_id,
            cantidad: 1,
            precio_unitario_snapshot: 450.00,
            costo_unitario_snapshot: 180.00
          }
        ]
      },
      {
        cliente_id: clientes[1].cliente_id,
        estado: 'Confirmado' as const,
        subtotal: 640.00,
        impuestos: 102.40,
        total: 742.40,
        empleado: 'Carlos Ruiz',
        live_id: lives[0].live_id,
        items: [
          {
            product_id: products[1].product_id,
            cantidad: 2,
            precio_unitario_snapshot: 320.00,
            costo_unitario_snapshot: 128.00
          }
        ]
      },
      {
        cliente_id: clientes[2].cliente_id,
        estado: 'Pagado' as const,
        subtotal: 1360.00,
        impuestos: 217.60,
        total: 1577.60,
        empleado: 'María González',
        items: [
          {
            product_id: products[2].product_id,
            cantidad: 2,
            precio_unitario_snapshot: 680.00,
            costo_unitario_snapshot: 272.00
          }
        ]
      },
      {
        cliente_id: clientes[3].cliente_id,
        estado: 'Entregado' as const,
        subtotal: 1200.00,
        impuestos: 192.00,
        total: 1392.00,
        empleado: 'Carlos Ruiz',
        live_id: lives[1].live_id,
        items: [
          {
            product_id: products[4].product_id,
            cantidad: 1,
            precio_unitario_snapshot: 1200.00,
            costo_unitario_snapshot: 480.00
          }
        ]
      },
      {
        cliente_id: clientes[4].cliente_id,
        estado: 'Pagado' as const,
        subtotal: 760.00,
        impuestos: 121.60,
        total: 881.60,
        empleado: 'María González',
        items: [
          {
            product_id: products[5].product_id,
            cantidad: 2,
            precio_unitario_snapshot: 380.00,
            costo_unitario_snapshot: 152.00
          }
        ]
      },
      {
        cliente_id: clientes[0].cliente_id,
        estado: 'Entregado' as const,
        subtotal: 840.00,
        impuestos: 134.40,
        total: 974.40,
        empleado: 'Carlos Ruiz',
        items: [
          {
            product_id: products[1].product_id,
            cantidad: 1,
            precio_unitario_snapshot: 320.00,
            costo_unitario_snapshot: 128.00
          },
          {
            product_id: products[6].product_id,
            cantidad: 1,
            precio_unitario_snapshot: 520.00,
            costo_unitario_snapshot: 208.00
          }
        ]
      }
    ];

    let pedidosInsertados = 0;
    for (const pedidoData of pedidosData) {
      const { items, ...pedido } = pedidoData;

      const { data: pedidoCreado, error: pedidoError } = await supabase
        .from('pedidos')
        .insert(pedido)
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      const pedidoItems = items.map(item => ({
        ...item,
        pedido_id: pedidoCreado.pedido_id
      }));

      const { error: itemsError } = await supabase
        .from('pedido_items')
        .insert(pedidoItems);

      if (itemsError) throw itemsError;

      pedidosInsertados++;
    }

    console.log(`✅ ${pedidosInsertados} pedidos insertados con sus items`);

    // 5. Baskets para lives finalizados
    console.log('🧺 Insertando baskets de lives finalizados...');

    const livesFin = lives.filter(l => l.estado === 'finalizado');
    let basketsInsertados = 0;

    for (const live of livesFin.slice(0, 2)) {
      const clientesParaBaskets = clientes.slice(0, 3);

      for (const cliente of clientesParaBaskets) {
        const { data: basket, error: basketError } = await supabase
          .from('baskets')
          .insert({
            live_id: live.live_id,
            cliente_id: cliente.cliente_id,
            estado: 'cerrada',
            subtotal: 1000.00,
            total: 1160.00
          })
          .select()
          .single();

        if (basketError) throw basketError;

        await supabase
          .from('basket_items')
          .insert([
            {
              basket_id: basket.basket_id,
              product_id: products[0].product_id,
              cantidad: 1,
              precio_unitario: 450.00
            },
            {
              basket_id: basket.basket_id,
              product_id: products[1].product_id,
              cantidad: 1,
              precio_unitario: 320.00
            }
          ]);

        basketsInsertados++;
      }
    }

    console.log(`✅ ${basketsInsertados} baskets insertados`);

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${products?.length} productos`);
    console.log(`   - ${clientes?.length} clientes`);
    console.log(`   - ${lives?.length} lives`);
    console.log(`   - ${pedidosInsertados} pedidos`);
    console.log(`   - ${basketsInsertados} baskets`);

    return {
      success: true,
      data: {
        products: products?.length || 0,
        clientes: clientes?.length || 0,
        lives: lives?.length || 0,
        pedidos: pedidosInsertados,
        baskets: basketsInsertados
      }
    };

  } catch (error) {
    console.error('❌ Error en seed:', error);
    return {
      success: false,
      error: error
    };
  }
}

export async function clearDatabase() {
  console.log('🗑️  Limpiando base de datos...');

  try {
    await supabase.from('basket_items').delete().neq('basket_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('baskets').delete().neq('basket_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('pedido_items').delete().neq('pedido_item_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('pedidos').delete().neq('pedido_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('lives').delete().neq('live_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('clientes').delete().neq('cliente_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('product_id', '00000000-0000-0000-0000-000000000000');

    console.log('✅ Base de datos limpiada');
    return { success: true };
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    return { success: false, error };
  }
}
