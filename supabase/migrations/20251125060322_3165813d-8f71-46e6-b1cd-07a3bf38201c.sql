-- Create cart activity logs table
CREATE TABLE IF NOT EXISTS public.cart_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('add', 'remove', 'update_quantity', 'clear')),
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC,
  quantity INTEGER,
  variant_details JSONB,
  total_cart_value NUMERIC,
  total_cart_items INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_cart_logs_user_id ON public.cart_activity_logs(user_id);
CREATE INDEX idx_cart_logs_session_id ON public.cart_activity_logs(session_id);
CREATE INDEX idx_cart_logs_created_at ON public.cart_activity_logs(created_at DESC);
CREATE INDEX idx_cart_logs_action_type ON public.cart_activity_logs(action_type);

-- Enable RLS
ALTER TABLE public.cart_activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own cart logs
CREATE POLICY "Users can view their own cart logs"
ON public.cart_activity_logs
FOR SELECT
USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- Anyone can insert cart logs (for tracking guest users too)
CREATE POLICY "Anyone can create cart logs"
ON public.cart_activity_logs
FOR INSERT
WITH CHECK (true);

-- Admins can view all cart logs
CREATE POLICY "Admins can view all cart logs"
ON public.cart_activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Add comment
COMMENT ON TABLE public.cart_activity_logs IS 'Tracks all cart activities including add, remove, update, and clear actions for analytics and user behavior tracking';