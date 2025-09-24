-- Drop existing policies and recreate with better security
DROP POLICY IF EXISTS "Only super admins can view audit logs" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create audit table for tracking admin access to customer data (if not exists)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_user_id UUID,
  target_table TEXT NOT NULL,
  accessed_columns TEXT[],
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  additional_metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs (more secure)
CREATE POLICY "Admins can view audit logs" 
ON public.admin_audit_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Restrict admin access to profiles - force them to use audit functions
CREATE POLICY "Users can view own profiles and admins blocked from direct access" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Function to log admin access to customer data
CREATE OR REPLACE FUNCTION public.log_admin_access(
  p_action_type TEXT,
  p_target_user_id UUID DEFAULT NULL,
  p_target_table TEXT DEFAULT 'profiles',
  p_accessed_columns TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  -- Only log if current user is admin/manager
  IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) THEN
    INSERT INTO public.admin_audit_logs (
      admin_user_id,
      action_type,
      target_user_id,
      target_table,
      accessed_columns
    ) VALUES (
      auth.uid(),
      p_action_type,
      p_target_user_id,
      p_target_table,
      p_accessed_columns
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Secure function for admin customer access (basic data only)
CREATE OR REPLACE FUNCTION public.get_customer_profile_admin(p_customer_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  customer_status TEXT,
  total_orders INTEGER,
  total_spent NUMERIC
) AS $$
BEGIN
  -- Check admin privileges
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Log access
  PERFORM public.log_admin_access(
    'view_customer_profile', 
    p_customer_id, 
    'profiles',
    ARRAY['display_name', 'first_name', 'last_name', 'email', 'phone', 'customer_status']
  );
  
  -- Return limited data
  RETURN QUERY
  SELECT 
    p.id, p.user_id, p.display_name, p.first_name, p.last_name, 
    p.email, p.phone, p.created_at, p.updated_at, 
    p.customer_status, p.total_orders, p.total_spent
  FROM public.profiles p
  WHERE p.user_id = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;