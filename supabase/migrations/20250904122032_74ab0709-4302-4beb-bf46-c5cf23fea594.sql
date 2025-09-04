-- Add policy to allow order item creation for authenticated users
CREATE POLICY "Users can create order items for their orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_id = auth.uid()
  )
);

-- Also add a more permissive policy for authenticated users
CREATE POLICY "Authenticated users can create order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);