-- Fix RLS policy for job applications to allow authenticated users to submit
DROP POLICY IF EXISTS "Users can create their own applications" ON public.job_applications;

-- Create a more permissive INSERT policy for authenticated users
CREATE POLICY "Authenticated users can create applications"
ON public.job_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);