-- Fix the RLS policy issue by creating proper policies for admin_audit_logs table

-- Add INSERT policy for audit logs (only admins can create logs)
CREATE POLICY "Admins can create audit logs" 
ON public.admin_audit_logs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Add UPDATE and DELETE policies (only super admins)
CREATE POLICY "Only super admins can modify audit logs" 
ON public.admin_audit_logs 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only super admins can delete audit logs" 
ON public.admin_audit_logs 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));