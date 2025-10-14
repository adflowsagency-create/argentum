import { supabase } from '../lib/supabaseClient';

export async function seedDatabase() {
  try {
    const { data: existingClientes } = await supabase
      .from('clientes')
      .select('cliente_id')
      .limit(1);

    if (existingClientes && existingClientes.length > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    const clientes = [
      {
        nombre: 'María García',
        telefono_whatsapp: '+52 55 1234 5678',
        email: 'maria@example.com',
        tags: ['VIP', 'Regular'],
        ltv: 2500.0,
        frecuencia: 12,
      },
      {
        nombre: 'Ana Martínez',
        telefono_whatsapp: '+52 55 2345 6789',
        email: 'ana@example.com',
        tags: ['Regular'],
        ltv: 1800.0,
        frecuencia: 8,
      },
      {
        nombre: 'Sofía López',
        telefono_whatsapp: '+52 55 3456 7890',
        tags: ['Nueva'],
        ltv: 450.0,
        frecuencia: 2,
      },
      {
        nombre: 'Carmen Rodríguez',
        telefono_whatsapp: '+52 55 4567 8901',
        email: 'carmen@example.com',
        tags: ['VIP'],
        ltv: 3200.0,
        frecuencia: 15,
      },
      {
        nombre: 'Laura Hernández',
        telefono_whatsapp: '+52 55 5678 9012',
        tags: ['Regular'],
        ltv: 1200.0,
        frecuencia: 6,
      },
    ];

    const { data: insertedClientes } = await supabase
      .from('clientes')
      .insert(clientes)
      .select();

    console.log('Seeded clientes:', insertedClientes?.length);

    const products = [
      {
        nombre: 'Blusa Floral',
        categoria: 'Ropa',
        precio_unitario: 350.0,
        costo_unitario: 180.0,
        descripcion: 'Blusa estampado floral, talla única',
        cantidad_en_stock: 15,
        imagen_url: 'https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=400',
        activo: true,
      },
      {
        nombre: 'Vestido Casual',
        categoria: 'Ropa',
        precio_unitario: 480.0,
        costo_unitario: 240.0,
        descripcion: 'Vestido casual de algodón',
        cantidad_en_stock: 10,
        imagen_url: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400',
        activo: true,
      },
      {
        nombre: 'Bolsa de Mano',
        categoria: 'Accesorios',
        precio_unitario: 280.0,
        costo_unitario: 150.0,
        descripcion: 'Bolsa elegante con detalles dorados',
        cantidad_en_stock: 20,
        imagen_url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
        activo: true,
      },
      {
        nombre: 'Aretes Largos',
        categoria: 'Joyería',
        precio_unitario: 150.0,
        costo_unitario: 60.0,
        descripcion: 'Aretes largos con diseño moderno',
        cantidad_en_stock: 30,
        imagen_url: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=400',
        activo: true,
      },
      {
        nombre: 'Collar Plateado',
        categoria: 'Joyería',
        precio_unitario: 220.0,
        costo_unitario: 100.0,
        descripcion: 'Collar de plata con dije',
        cantidad_en_stock: 25,
        imagen_url: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
        activo: true,
      },
      {
        nombre: 'Zapatos Casual',
        categoria: 'Calzado',
        precio_unitario: 550.0,
        costo_unitario: 280.0,
        descripcion: 'Zapatos casuales cómodos',
        cantidad_en_stock: 12,
        imagen_url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
        activo: true,
      },
      {
        nombre: 'Bufanda de Seda',
        categoria: 'Accesorios',
        precio_unitario: 180.0,
        costo_unitario: 80.0,
        descripcion: 'Bufanda de seda suave',
        cantidad_en_stock: 18,
        imagen_url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
        activo: true,
      },
      {
        nombre: 'Pantalón de Mezclilla',
        categoria: 'Ropa',
        precio_unitario: 420.0,
        costo_unitario: 210.0,
        descripcion: 'Pantalón de mezclilla corte recto',
        cantidad_en_stock: 14,
        imagen_url: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
        activo: true,
      },
    ];

    const { data: insertedProducts } = await supabase
      .from('products')
      .insert(products)
      .select();

    console.log('Seeded products:', insertedProducts?.length);

    const liveDate = new Date();
    liveDate.setHours(liveDate.getHours() - 1);

    const { data: insertedLive } = await supabase
      .from('lives')
      .insert({
        titulo: 'Nueva Colección Primavera 2025',
        fecha_hora: liveDate.toISOString(),
        estado: 'activo',
        notas: 'Presentación de nuevos productos de temporada',
      })
      .select()
      .single();

    console.log('Seeded live:', insertedLive?.live_id);

    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}
