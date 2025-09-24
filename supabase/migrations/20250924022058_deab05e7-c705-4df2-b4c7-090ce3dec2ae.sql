-- Create audit table for tracking admin access to customer data
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action_type TEXT NOT NULL, -- 'view_profile', 'update_profile', 'export_data', etc.
  target_user_id UUID, -- The customer whose data was accessed
  target_table TEXT NOT NULL,
  accessed_columns TEXT[], -- Array of column names accessed
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  additional_metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super admins can view audit logs
CREATE POLICY "Only super admins can view audit logs" 
ON public.admin_audit_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

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

-- Create a secure function for admin profile access with logging
CREATE OR REPLACE FUNCTION public.get_customer_profile_admin(p_customer_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  -- Exclude highly sensitive fields by default
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  customer_status TEXT,
  total_orders INTEGER,
  total_spent NUMERIC
) AS $$
BEGIN
  -- Check if user has admin privileges
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Log the access
  PERFORM public.log_admin_access(
    'view_customer_profile', 
    p_customer_id, 
    'profiles',
    ARRAY['display_name', 'first_name', 'last_name', 'email', 'phone', 'customer_status', 'total_orders', 'total_spent']
  );
  
  -- Return limited profile data
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.first_name,
    p.last_name,
    p.email,
    p.phone,
    p.created_at,
    p.updated_at,
    p.customer_status,
    p.total_orders,
    p.total_spent
  FROM public.profiles p
  WHERE p.user_id = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a function for accessing sensitive customer data (requires explicit justification)
CREATE OR REPLACE FUNCTION public.get_customer_sensitive_data(
  p_customer_id UUID,
  p_justification TEXT,
  p_requested_fields TEXT[] DEFAULT ARRAY['street_address', 'billing_street_address']
)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{}'::jsonb;
  profile_record RECORD;
BEGIN
  -- Check if user has admin privileges
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required for sensitive data';
  END IF;
  
  -- Require justification for sensitive data access
  IF p_justification IS NULL OR LENGTH(TRIM(p_justification)) < 10 THEN
    RAISE EXCEPTION 'Justification required: Must provide reason for accessing sensitive customer data (minimum 10 characters)';
  END IF;
  
  -- Log the sensitive data access with justification
  PERFORM public.log_admin_access(
    'view_sensitive_data', 
    p_customer_id, 
    'profiles',
    p_requested_fields
  );
  
  -- Insert detailed log with justification
  INSERT INTO public.admin_audit_logs (
    admin_user_id,
    action_type,
    target_user_id,
    target_table,
    accessed_columns,
    additional_metadata
  ) VALUES (
    auth.uid(),
    'sensitive_data_access',
    p_customer_id,
    'profiles',
    p_requested_fields,
    jsonb_build_object('justification', p_justification, 'timestamp', now())
  );
  
  -- Get the profile
  SELECT * INTO profile_record FROM public.profiles WHERE user_id = p_customer_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Customer profile not found';
  END IF;
  
  -- Build response with only requested sensitive fields
  IF 'street_address' = ANY(p_requested_fields) THEN
    result := result || jsonb_build_object('street_address', profile_record.street_address);
  END IF;
  
  IF 'billing_street_address' = ANY(p_requested_fields) THEN
    result := result || jsonb_build_object('billing_street_address', profile_record.billing_street_address);
  END IF;
  
  IF 'stripe_customer_id' = ANY(p_requested_fields) THEN
    result := result || jsonb_build_object('stripe_customer_id', profile_record.stripe_customer_id);
  END IF;
  
  IF 'apartment_unit' = ANY(p_requested_fields) THEN
    result := result || jsonb_build_object('apartment_unit', profile_record.apartment_unit);
  END IF;
  
  IF 'billing_apartment_unit' = ANY(p_requested_fields) THEN
    result := result || jsonb_build_object('billing_apartment_unit', profile_record.billing_apartment_unit);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the existing admin policy to be more restrictive
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a new restrictive policy that requires using the audit functions
CREATE POLICY "Admins can view basic profile data only" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR -- Users can still view their own profiles
  (
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)) 
    AND FALSE -- Force admins to use the audit functions instead of direct access
  )
);

-- Create indexes for better performance on audit logs
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON public.admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_user_id ON public.admin_audit_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action_type ON public.admin_audit_logs(action_type);