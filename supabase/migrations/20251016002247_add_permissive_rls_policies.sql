/*
  # Agregar Políticas RLS Permisivas para Desarrollo

  ## Descripción
  Esta migración agrega políticas de Row Level Security (RLS) permisivas para 
  permitir todas las operaciones CRUD en las tablas principales durante el desarrollo.

  ## Cambios
  
  ### Políticas para Products
  - SELECT: Permite leer todos los productos activos
  - INSERT: Permite insertar nuevos productos
  - UPDATE: Permite actualizar productos existentes
  - DELETE: Permite eliminar productos (soft delete)

  ### Políticas para Clientes
  - SELECT: Permite leer todos los clientes
  - INSERT: Permite crear nuevos clientes
  - UPDATE: Permite actualizar información de clientes
  - DELETE: Permite eliminar clientes

  ### Políticas para Lives
  - SELECT: Permite leer todos los lives
  - INSERT: Permite crear nuevos lives
  - UPDATE: Permite actualizar lives existentes
  - DELETE: Permite eliminar lives

  ### Políticas para Pedidos y Pedido Items
  - SELECT: Permite leer todos los pedidos
  - INSERT: Permite crear nuevos pedidos
  - UPDATE: Permite actualizar pedidos
  - DELETE: Permite eliminar pedidos

  ### Políticas para Baskets y Basket Items
  - SELECT: Permite leer todas las baskets
  - INSERT: Permite crear nuevas baskets
  - UPDATE: Permite actualizar baskets
  - DELETE: Permite eliminar baskets

  ## Notas Importantes
  - Estas políticas son permisivas para facilitar el desarrollo
  - En producción se deben restringir según roles y permisos específicos
  - Todas las políticas están configuradas para usuarios autenticados
*/

-- ============================================================================
-- PRODUCTS TABLE POLICIES
-- ============================================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read access to products" ON products;
DROP POLICY IF EXISTS "Allow insert access to products" ON products;
DROP POLICY IF EXISTS "Allow update access to products" ON products;
DROP POLICY IF EXISTS "Allow delete access to products" ON products;

-- Create new policies
CREATE POLICY "Allow read access to products"
ON products FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to products"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to products"
ON products FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CLIENTES TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow read access to clientes" ON clientes;
DROP POLICY IF EXISTS "Allow insert access to clientes" ON clientes;
DROP POLICY IF EXISTS "Allow update access to clientes" ON clientes;
DROP POLICY IF EXISTS "Allow delete access to clientes" ON clientes;

CREATE POLICY "Allow read access to clientes"
ON clientes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to clientes"
ON clientes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to clientes"
ON clientes FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to clientes"
ON clientes FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- LIVES TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow read access to lives" ON lives;
DROP POLICY IF EXISTS "Allow insert access to lives" ON lives;
DROP POLICY IF EXISTS "Allow update access to lives" ON lives;
DROP POLICY IF EXISTS "Allow delete access to lives" ON lives;

CREATE POLICY "Allow read access to lives"
ON lives FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to lives"
ON lives FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to lives"
ON lives FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to lives"
ON lives FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- PEDIDOS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow read access to pedidos" ON pedidos;
DROP POLICY IF EXISTS "Allow insert access to pedidos" ON pedidos;
DROP POLICY IF EXISTS "Allow update access to pedidos" ON pedidos;
DROP POLICY IF EXISTS "Allow delete access to pedidos" ON pedidos;

CREATE POLICY "Allow read access to pedidos"
ON pedidos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to pedidos"
ON pedidos FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to pedidos"
ON pedidos FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to pedidos"
ON pedidos FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- PEDIDO_ITEMS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow read access to pedido_items" ON pedido_items;
DROP POLICY IF EXISTS "Allow insert access to pedido_items" ON pedido_items;
DROP POLICY IF EXISTS "Allow update access to pedido_items" ON pedido_items;
DROP POLICY IF EXISTS "Allow delete access to pedido_items" ON pedido_items;

CREATE POLICY "Allow read access to pedido_items"
ON pedido_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to pedido_items"
ON pedido_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to pedido_items"
ON pedido_items FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to pedido_items"
ON pedido_items FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- BASKETS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow read access to baskets" ON baskets;
DROP POLICY IF EXISTS "Allow insert access to baskets" ON baskets;
DROP POLICY IF EXISTS "Allow update access to baskets" ON baskets;
DROP POLICY IF EXISTS "Allow delete access to baskets" ON baskets;

CREATE POLICY "Allow read access to baskets"
ON baskets FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to baskets"
ON baskets FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to baskets"
ON baskets FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to baskets"
ON baskets FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- BASKET_ITEMS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Allow read access to basket_items" ON basket_items;
DROP POLICY IF EXISTS "Allow insert access to basket_items" ON basket_items;
DROP POLICY IF EXISTS "Allow update access to basket_items" ON basket_items;
DROP POLICY IF EXISTS "Allow delete access to basket_items" ON basket_items;

CREATE POLICY "Allow read access to basket_items"
ON basket_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to basket_items"
ON basket_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow update access to basket_items"
ON basket_items FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete access to basket_items"
ON basket_items FOR DELETE
TO authenticated
USING (true);
