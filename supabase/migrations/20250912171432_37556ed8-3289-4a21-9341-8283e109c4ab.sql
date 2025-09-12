-- Remove the dangerous public access policy that exposes all customer order data
DROP POLICY IF EXISTS "Public can view all orders for admin dashboard" ON public.orders;

-- Remove overly permissive product access policy
DROP POLICY IF EXISTS "Allow public access to products" ON public.products;

-- Create secure policies for orders table
-- Customers can view their own orders
CREATE POLICY IF NOT EXISTS "Customers can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = customer_id);

-- Admins and managers can view all orders
CREATE POLICY IF NOT EXISTS "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Users can create their own orders
CREATE POLICY IF NOT EXISTS "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Admins can manage orders
CREATE POLICY IF NOT EXISTS "Admins can manage orders" 
ON public.orders 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Create secure policies for products table
-- Public can read products (for browsing)
CREATE POLICY "Public can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- Only admins can create, update, or delete products
CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));