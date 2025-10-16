/*
  # Add fecha_alta column to clientes table

  1. Changes
    - Add `fecha_alta` column to `clientes` table
    - Set default value to `now()` for new records
    - Update existing records to use `created_at` value as `fecha_alta`

  2. Security
    - No changes to RLS policies needed
*/

-- Add the fecha_alta column with default value
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS fecha_alta timestamptz DEFAULT now();

-- Update existing records to set fecha_alta to created_at value
UPDATE clientes 
SET fecha_alta = created_at 
WHERE fecha_alta IS NULL;