/*
  # Create Live Sales Management Schema

  ## Summary
  This migration creates the complete database schema for the Live Sales Management System,
  enabling real-time multi-basket sales operations during live events.

  ## New Tables

  ### 1. `products`
  Stores product catalog with inventory tracking
  - `product_id` (uuid, primary key)
  - `nombre` (text) - Product name
  - `categoria` (text) - Product category
  - `precio_unitario` (decimal) - Unit price
  - `costo_unitario` (decimal) - Unit cost
  - `descripcion` (text, optional) - Product description
  - `cantidad_en_stock` (integer) - Current stock quantity
  - `imagen_url` (text, optional) - Product image URL
  - `activo` (boolean) - Whether product is active, default true
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 2. `clientes`
  Customer information and purchase history
  - `cliente_id` (uuid, primary key)
  - `nombre` (text) - Customer name
  - `telefono_whatsapp` (text) - WhatsApp phone number
  - `email` (text, optional) - Email address
  - `direccion` (text, optional) - Physical address
  - `tags` (text array) - Customer tags/labels
  - `ltv` (decimal) - Lifetime value, default 0
  - `frecuencia` (integer) - Purchase frequency count, default 0
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 3. `lives`
  Live event tracking
  - `live_id` (uuid, primary key)
  - `titulo` (text, optional) - Live title
  - `fecha_hora` (timestamptz) - Scheduled date and time
  - `estado` (text) - Status: 'programado', 'activo', 'finalizado'
  - `notas` (text, optional) - Live notes
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `baskets`
  Temporary shopping baskets during live events
  - `basket_id` (uuid, primary key)
  - `live_id` (uuid, foreign key) - Associated live event
  - `cliente_id` (uuid, foreign key) - Customer
  - `estado` (text) - Status: 'abierta', 'finalizada'
  - `subtotal` (decimal) - Basket subtotal, default 0
  - `total` (decimal) - Basket total, default 0
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 5. `basket_items`
  Items within each basket
  - `basket_item_id` (uuid, primary key)
  - `basket_id` (uuid, foreign key) - Parent basket
  - `product_id` (uuid, foreign key) - Product reference
  - `cantidad` (integer) - Quantity ordered
  - `precio_unitario_snapshot` (decimal) - Price at time of addition
  - `costo_unitario_snapshot` (decimal) - Cost at time of addition
  - `total_item` (decimal) - Line item total
  - `created_at` (timestamptz) - Record creation timestamp

  ### 6. `pedidos`
  Finalized orders from completed lives
  - `pedido_id` (uuid, primary key)
  - `cliente_id` (uuid, foreign key) - Customer
  - `live_id` (uuid, foreign key, optional) - Source live event
  - `estado` (text) - Order status: 'Pendiente', 'Confirmado', 'Pagado', 'Entregado', 'Cancelado'
  - `subtotal` (decimal) - Order subtotal
  - `impuestos` (decimal) - Taxes, default 0
  - `total` (decimal) - Order total
  - `empleado` (text) - Employee who created order
  - `notas` (text, optional) - Order notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 7. `pedido_items`
  Line items for finalized orders
  - `pedido_item_id` (uuid, primary key)
  - `pedido_id` (uuid, foreign key) - Parent order
  - `product_id` (uuid, foreign key) - Product reference
  - `cantidad` (integer) - Quantity ordered
  - `precio_unitario_snapshot` (decimal) - Price snapshot
  - `costo_unitario_snapshot` (decimal) - Cost snapshot
  - `total_item` (decimal) - Line item total

  ## Security
  - All tables have RLS enabled
  - Policies restrict access to authenticated users only
  - Read and write permissions granted to authenticated role

  ## Notes
  - Foreign keys ensure referential integrity
  - Timestamps track creation and modification
  - Default values prevent null issues
  - Indexes on foreign keys for query performance
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  product_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  categoria text NOT NULL,
  precio_unitario decimal(10,2) NOT NULL,
  costo_unitario decimal(10,2) NOT NULL,
  descripcion text,
  cantidad_en_stock integer NOT NULL DEFAULT 0,
  imagen_url text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clientes table
CREATE TABLE IF NOT EXISTS clientes (
  cliente_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  telefono_whatsapp text NOT NULL,
  email text,
  direccion text,
  tags text[] DEFAULT '{}',
  ltv decimal(10,2) DEFAULT 0,
  frecuencia integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lives table
CREATE TABLE IF NOT EXISTS lives (
  live_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text,
  fecha_hora timestamptz NOT NULL,
  estado text NOT NULL DEFAULT 'programado',
  notas text,
  created_at timestamptz DEFAULT now()
);

-- Create baskets table
CREATE TABLE IF NOT EXISTS baskets (
  basket_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  live_id uuid NOT NULL REFERENCES lives(live_id) ON DELETE CASCADE,
  cliente_id uuid NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
  estado text NOT NULL DEFAULT 'abierta',
  subtotal decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(live_id, cliente_id, estado)
);

-- Create basket_items table
CREATE TABLE IF NOT EXISTS basket_items (
  basket_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  basket_id uuid NOT NULL REFERENCES baskets(basket_id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  cantidad integer NOT NULL DEFAULT 1,
  precio_unitario_snapshot decimal(10,2) NOT NULL,
  costo_unitario_snapshot decimal(10,2) NOT NULL,
  total_item decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create pedidos table
CREATE TABLE IF NOT EXISTS pedidos (
  pedido_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
  live_id uuid REFERENCES lives(live_id) ON DELETE SET NULL,
  estado text NOT NULL DEFAULT 'Pendiente',
  subtotal decimal(10,2) NOT NULL,
  impuestos decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  empleado text NOT NULL,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pedido_items table
CREATE TABLE IF NOT EXISTS pedido_items (
  pedido_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES pedidos(pedido_id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  cantidad integer NOT NULL,
  precio_unitario_snapshot decimal(10,2) NOT NULL,
  costo_unitario_snapshot decimal(10,2) NOT NULL,
  total_item decimal(10,2) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_baskets_live_id ON baskets(live_id);
CREATE INDEX IF NOT EXISTS idx_baskets_cliente_id ON baskets(cliente_id);
CREATE INDEX IF NOT EXISTS idx_basket_items_basket_id ON basket_items(basket_id);
CREATE INDEX IF NOT EXISTS idx_basket_items_product_id ON basket_items(product_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_live_id ON pedidos(live_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido_id ON pedido_items(pedido_id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lives ENABLE ROW LEVEL SECURITY;
ALTER TABLE baskets ENABLE ROW LEVEL SECURITY;
ALTER TABLE basket_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
CREATE POLICY "Users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for clientes
CREATE POLICY "Users can view clientes"
  ON clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert clientes"
  ON clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update clientes"
  ON clientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete clientes"
  ON clientes FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for lives
CREATE POLICY "Users can view lives"
  ON lives FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert lives"
  ON lives FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update lives"
  ON lives FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete lives"
  ON lives FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for baskets
CREATE POLICY "Users can view baskets"
  ON baskets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert baskets"
  ON baskets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update baskets"
  ON baskets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete baskets"
  ON baskets FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for basket_items
CREATE POLICY "Users can view basket_items"
  ON basket_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert basket_items"
  ON basket_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update basket_items"
  ON basket_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete basket_items"
  ON basket_items FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for pedidos
CREATE POLICY "Users can view pedidos"
  ON pedidos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert pedidos"
  ON pedidos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update pedidos"
  ON pedidos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete pedidos"
  ON pedidos FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for pedido_items
CREATE POLICY "Users can view pedido_items"
  ON pedido_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert pedido_items"
  ON pedido_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update pedido_items"
  ON pedido_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete pedido_items"
  ON pedido_items FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_baskets_updated_at
  BEFORE UPDATE ON baskets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
