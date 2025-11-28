-- Relax RLS policy to allow anyone to insert job applications
DROP POLICY IF EXISTS "Authenticated users can create applications" ON public.job_applications;

CREATE POLICY "Anyone can create applications"
ON public.job_applications
FOR INSERT
TO public
WITH CHECK (true);