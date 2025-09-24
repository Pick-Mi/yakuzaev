-- Add RLS policies for the kv_store_eecafcd0 table
-- This table appears to be a key-value store, restrict access to admins only

CREATE POLICY "Only admins can view kv store" 
ON public.kv_store_eecafcd0 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert into kv store" 
ON public.kv_store_eecafcd0 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update kv store" 
ON public.kv_store_eecafcd0 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete from kv store" 
ON public.kv_store_eecafcd0 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));