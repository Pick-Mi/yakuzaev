-- Drop the restrictive update policy
DROP POLICY IF EXISTS "Anyone can update their own drafts" ON public.dealer_enquiries;

-- Create a new policy that allows updating drafts AND changing their status to pending
CREATE POLICY "Anyone can update their own draft applications" 
ON public.dealer_enquiries 
FOR UPDATE 
USING (status = 'draft')
WITH CHECK (status IN ('draft', 'pending'));