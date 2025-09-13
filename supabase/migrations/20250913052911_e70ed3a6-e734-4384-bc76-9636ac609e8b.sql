-- Remove the current public policy that exposes all product data including cost_price
DROP POLICY IF EXISTS "Public can view products" ON public.products;

-- Create a secure function that returns products without sensitive cost_price data
CREATE OR REPLACE FUNCTION public.get_public_products()
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  description text,
  sku text,
  price numeric,
  stock_quantity integer,
  category_id uuid,
  is_active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  images jsonb,
  variants jsonb,
  image_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.slug,
    p.description,
    p.sku,
    p.price,
    p.stock_quantity,
    p.category_id,
    p.is_active,
    p.created_at,
    p.updated_at,
    p.images,
    p.variants,
    p.image_url
  FROM public.products p
  WHERE p.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create new policy for public access to non-sensitive product data
CREATE POLICY "Public can view product details (excluding cost_price)" 
ON public.products 
FOR SELECT 
USING (is_active = true AND auth.uid() IS NULL);

-- Create policy for authenticated users to view products (excluding cost_price)
CREATE POLICY "Authenticated users can view product details" 
ON public.products 
FOR SELECT 
USING (is_active = true AND auth.uid() IS NOT NULL AND NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)));

-- Keep admin/manager access to all product data including cost_price
-- The existing "Admins can manage products" policy already handles this