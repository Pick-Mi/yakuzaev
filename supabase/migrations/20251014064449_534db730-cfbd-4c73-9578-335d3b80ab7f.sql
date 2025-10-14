-- Drop the existing check constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Recreate the constraint with all valid status values including 'pending' and 'packed'
ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'placed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'));