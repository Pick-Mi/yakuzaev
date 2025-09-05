-- Remove the dangerous public access policy that exposes all customer data
DROP POLICY IF EXISTS "Public can view all profiles for admin dashboard" ON public.profiles;

-- Ensure proper RLS policies are in place for secure access
-- Users can view their own profile
CREATE POLICY IF NOT EXISTS "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins and managers can view all profiles
CREATE POLICY IF NOT EXISTS "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));