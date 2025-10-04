-- Add order_number column to orders table with auto-increment starting from 1
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_number INTEGER;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS orders_order_number_seq START WITH 1;

-- Update existing orders to have sequential order numbers based on creation date
DO $$
DECLARE
  order_record RECORD;
  counter INTEGER := 1;
BEGIN
  FOR order_record IN 
    SELECT id FROM public.orders ORDER BY created_at ASC
  LOOP
    UPDATE public.orders 
    SET order_number = counter 
    WHERE id = order_record.id;
    counter := counter + 1;
  END LOOP;
  
  -- Set the sequence to the next available number
  PERFORM setval('orders_order_number_seq', counter);
END $$;

-- Set default value for new orders
ALTER TABLE public.orders 
ALTER COLUMN order_number SET DEFAULT nextval('orders_order_number_seq');

-- Make order_number NOT NULL after populating existing records
ALTER TABLE public.orders 
ALTER COLUMN order_number SET NOT NULL;

-- Create unique index on order_number
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);