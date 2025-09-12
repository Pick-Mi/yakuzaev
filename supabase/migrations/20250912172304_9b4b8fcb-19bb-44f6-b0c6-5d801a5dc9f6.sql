-- Remove the dangerous policy that exposes all customer personal information to public
DROP POLICY IF EXISTS "Public can view all profiles for admin dashboard" ON public.profiles;