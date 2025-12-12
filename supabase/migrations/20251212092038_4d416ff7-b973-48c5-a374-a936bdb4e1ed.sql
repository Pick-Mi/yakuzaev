-- Add policies to allow users to read their own draft applications by email
CREATE POLICY "Anyone can view their own drafts by email"
ON public.dealer_enquiries
FOR SELECT
USING (status = 'draft');

-- Add policy to allow updating drafts
CREATE POLICY "Anyone can update their own drafts"
ON public.dealer_enquiries
FOR UPDATE
USING (status = 'draft')
WITH CHECK (status = 'draft');