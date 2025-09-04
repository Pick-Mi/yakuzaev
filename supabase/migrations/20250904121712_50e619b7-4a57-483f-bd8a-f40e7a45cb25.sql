-- Add policy to allow authenticated users to insert their own orders
CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Also add policy to allow users to insert orders even if customer_id is null (for guest checkouts)
CREATE POLICY "Allow order creation for authenticated users" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);