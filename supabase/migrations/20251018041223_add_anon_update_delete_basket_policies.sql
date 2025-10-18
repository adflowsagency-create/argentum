/*
  # Agregar Políticas RLS para UPDATE y DELETE en Baskets (Usuarios Anónimos)

  ## Descripción
  Esta migración agrega políticas de Row Level Security (RLS) que permiten a usuarios 
  anónimos realizar operaciones UPDATE y DELETE en las tablas `basket_items` y `baskets`.
  Esto es necesario para permitir la actualización de cantidades y eliminación de productos
  durante los lives activos.

  ## Cambios

  ### Políticas para basket_items
  - UPDATE: Permite a usuarios anónimos actualizar cantidades y totales de items
  - DELETE: Permite a usuarios anónimos eliminar items de las canastas

  ### Políticas para baskets
  - UPDATE: Permite a usuarios anónimos actualizar subtotales y totales de canastas

  ## Notas Importantes
  - Estas políticas complementan las políticas existentes para usuarios autenticados
  - Son necesarias porque la aplicación opera en modo anónimo durante desarrollo
  - Las políticas son permisivas para facilitar las operaciones de canastas en tiempo real
*/

-- ============================================================================
-- BASKET_ITEMS TABLE POLICIES (ANONYMOUS USERS)
-- ============================================================================

-- Allow anonymous users to update basket items (for updating quantities)
CREATE POLICY "Allow anonymous update for basket_items"
  ON basket_items
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete basket items (for removing products)
CREATE POLICY "Allow anonymous delete for basket_items"
  ON basket_items
  FOR DELETE
  TO anon
  USING (true);

-- ============================================================================
-- BASKETS TABLE POLICIES (ANONYMOUS USERS)
-- ============================================================================

-- Allow anonymous users to update baskets (for updating totals)
CREATE POLICY "Allow anonymous update for baskets"
  ON baskets
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete baskets (for cleanup operations)
CREATE POLICY "Allow anonymous delete for baskets"
  ON baskets
  FOR DELETE
  TO anon
  USING (true);
