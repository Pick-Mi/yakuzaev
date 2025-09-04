-- Add comprehensive columns to orders table for complete order information
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_items_data JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_summary JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tax_amount NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_charge NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_source TEXT DEFAULT 'web';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_date TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'regular';

-- Add comments to explain what each column stores
COMMENT ON COLUMN public.orders.order_items_data IS 'Complete product details including name, price, quantity, variants, images';
COMMENT ON COLUMN public.orders.customer_details IS 'Customer information like name, phone, email, preferences';
COMMENT ON COLUMN public.orders.payment_details IS 'Payment method details, transaction info, gateway details';
COMMENT ON COLUMN public.orders.delivery_address IS 'Complete delivery address with all details';
COMMENT ON COLUMN public.orders.order_summary IS 'Order totals, discounts, taxes, item counts, etc';
COMMENT ON COLUMN public.orders.discount_amount IS 'Total discount applied to the order';
COMMENT ON COLUMN public.orders.tax_amount IS 'Tax amount for the order';
COMMENT ON COLUMN public.orders.shipping_charge IS 'Shipping/delivery charges';
COMMENT ON COLUMN public.orders.order_source IS 'Source of order: web, mobile, app, etc';
COMMENT ON COLUMN public.orders.delivery_instructions IS 'Special delivery instructions from customer';
COMMENT ON COLUMN public.orders.estimated_delivery_date IS 'Expected delivery date';
COMMENT ON COLUMN public.orders.payment_status IS 'Payment status: pending, paid, failed, refunded';
COMMENT ON COLUMN public.orders.order_type IS 'Type of order: regular, express, bulk, etc';