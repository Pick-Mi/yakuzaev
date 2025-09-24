-- Clean up duplicate policies on profiles
DROP POLICY IF EXISTS "Admins can view basic profile data only" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profiles and admins blocked from direct acce" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create single, secure policy for profiles
CREATE POLICY "Users can only view their own profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create function for sensitive data access with justification requirement
CREATE OR REPLACE FUNCTION public.get_customer_sensitive_data(
  p_customer_id UUID,
  p_justification TEXT,
  p_requested_fields TEXT[] DEFAULT ARRAY['street_address']
)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{}'::jsonb;
  profile_record RECORD;
BEGIN
  -- Check admin privileges
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required for sensitive data';
  END IF;
  
  -- Require justification
  IF p_justification IS NULL OR LENGTH(TRIM(p_justification)) < 10 THEN
    RAISE EXCEPTION 'Justification required: Must provide reason for accessing sensitive customer data (minimum 10 characters)';
  END IF;
  
  -- Log the access
  PERFORM public.log_admin_access(
    'view_sensitive_data', 
    p_customer_id, 
    'profiles',
    p_requested_fields
  );
  
  -- Insert detailed audit log
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
  
  -- Get profile using SECURITY DEFINER (bypasses RLS)
  SELECT * INTO profile_record FROM public.profiles WHERE user_id = p_customer_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Customer profile not found';
  END IF;
  
  -- Return only requested sensitive fields
  IF 'street_address' = ANY(p_requested_fields) AND profile_record.street_address IS NOT NULL THEN
    result := result || jsonb_build_object('street_address', profile_record.street_address);
  END IF;
  
  IF 'billing_street_address' = ANY(p_requested_fields) AND profile_record.billing_street_address IS NOT NULL THEN
    result := result || jsonb_build_object('billing_street_address', profile_record.billing_street_address);
  END IF;
  
  IF 'stripe_customer_id' = ANY(p_requested_fields) AND profile_record.stripe_customer_id IS NOT NULL THEN
    result := result || jsonb_build_object('stripe_customer_id', profile_record.stripe_customer_id);
  END IF;
  
  IF 'apartment_unit' = ANY(p_requested_fields) AND profile_record.apartment_unit IS NOT NULL THEN
    result := result || jsonb_build_object('apartment_unit', profile_record.apartment_unit);
  END IF;
  
  IF 'billing_apartment_unit' = ANY(p_requested_fields) AND profile_record.billing_apartment_unit IS NOT NULL THEN
    result := result || jsonb_build_object('billing_apartment_unit', profile_record.billing_apartment_unit);
  END IF;
  
  IF 'postal_code' = ANY(p_requested_fields) AND profile_record.postal_code IS NOT NULL THEN
    result := result || jsonb_build_object('postal_code', profile_record.postal_code);
  END IF;
  
  IF 'billing_postal_code' = ANY(p_requested_fields) AND profile_record.billing_postal_code IS NOT NULL THEN
    result := result || jsonb_build_object('billing_postal_code', profile_record.billing_postal_code);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create indexes for audit logs performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON public.admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_user_id ON public.admin_audit_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action_type ON public.admin_audit_logs(action_type);