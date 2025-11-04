-- Add cancellation and reopen fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS cancellation_request jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS cancellation_status text DEFAULT NULL CHECK (cancellation_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS cancellation_reason text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS cancellation_requested_at timestamp with time zone DEFAULT NULL;