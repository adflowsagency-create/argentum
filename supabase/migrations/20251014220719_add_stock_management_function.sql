/*
  # Add Stock Management Function

  ## Summary
  Creates a database function to safely update product stock levels during
  basket operations and order finalization.

  ## New Functions

  ### `update_product_stock`
  Updates product stock quantity with validation
  - Parameters:
    - p_product_id (uuid) - Product to update
    - p_quantity (integer) - Quantity to add/subtract (negative for sales)
  - Returns: void
  - Validates: Stock cannot go negative
  - Updates: cantidad_en_stock and updated_at fields

  ## Security
  - Function is accessible to authenticated users
  - Includes stock validation to prevent negative inventory

  ## Notes
  - Used when finalizing live sales to deduct sold items from inventory
  - Can be used for restocking by passing positive quantities
*/

-- Create function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock(
  p_product_id uuid,
  p_quantity integer
)
RETURNS void AS $$
DECLARE
  current_stock integer;
BEGIN
  -- Get current stock
  SELECT cantidad_en_stock INTO current_stock
  FROM products
  WHERE product_id = p_product_id;

  -- Validate stock won't go negative
  IF current_stock + p_quantity < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente para el producto %', p_product_id;
  END IF;

  -- Update stock
  UPDATE products
  SET cantidad_en_stock = cantidad_en_stock + p_quantity,
      updated_at = now()
  WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_product_stock(uuid, integer) TO authenticated;
