-- Create table for pre-approved dealer emails
CREATE TABLE public.approved_dealer_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.approved_dealer_emails ENABLE ROW LEVEL SECURITY;

-- Public can check if email exists (for validation)
CREATE POLICY "Anyone can check approved emails" 
ON public.approved_dealer_emails 
FOR SELECT 
USING (is_active = true);

-- Admins can manage approved emails
CREATE POLICY "Admins can manage approved emails" 
ON public.approved_dealer_emails 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_approved_dealer_emails_updated_at
BEFORE UPDATE ON public.approved_dealer_emails
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();