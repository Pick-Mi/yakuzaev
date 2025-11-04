-- Allow users to update cancellation fields on their own orders
CREATE POLICY "Users can request order cancellation"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);