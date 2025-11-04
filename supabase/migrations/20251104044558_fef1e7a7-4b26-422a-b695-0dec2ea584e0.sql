-- Add refund_details column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS refund_details jsonb DEFAULT NULL;