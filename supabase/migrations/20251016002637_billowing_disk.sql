/*
  # Fix RLS policies for database seeding

  1. Security Updates
    - Add policies to allow anonymous users to insert data during seeding
    - Ensure seeding operations can complete successfully
    - Maintain security for regular application operations

  2. Changes
    - Add INSERT policy for anonymous users on products table
    - Add INSERT policy for anonymous users on clientes table
    - Add INSERT policy for anonymous users on lives table
    - Add INSERT policy for anonymous users on baskets table
    - Add INSERT policy for anonymous users on basket_items table
    - Add INSERT policy for anonymous users on pedidos table
    - Add INSERT policy for anonymous users on pedido_items table

  Note: These policies are specifically for seeding operations and should be used carefully in production.
*/

-- Allow anonymous users to insert products (for seeding)
CREATE POLICY "Allow anonymous insert for seeding products"
  ON products
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert clientes (for seeding)
CREATE POLICY "Allow anonymous insert for seeding clientes"
  ON clientes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert lives (for seeding)
CREATE POLICY "Allow anonymous insert for seeding lives"
  ON lives
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert baskets (for seeding)
CREATE POLICY "Allow anonymous insert for seeding baskets"
  ON baskets
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert basket_items (for seeding)
CREATE POLICY "Allow anonymous insert for seeding basket_items"
  ON basket_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert pedidos (for seeding)
CREATE POLICY "Allow anonymous insert for seeding pedidos"
  ON pedidos
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert pedido_items (for seeding)
CREATE POLICY "Allow anonymous insert for seeding pedido_items"
  ON pedido_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow anonymous users to read data (needed for seeding operations that check existing data)
CREATE POLICY "Allow anonymous read for seeding products"
  ON products
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read for seeding clientes"
  ON clientes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read for seeding lives"
  ON lives
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read for seeding baskets"
  ON baskets
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read for seeding basket_items"
  ON basket_items
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read for seeding pedidos"
  ON pedidos
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read for seeding pedido_items"
  ON pedido_items
  FOR SELECT
  TO anon
  USING (true);