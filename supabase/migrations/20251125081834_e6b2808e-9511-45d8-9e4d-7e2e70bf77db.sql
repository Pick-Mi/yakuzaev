-- Add SEO fields to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN products.meta_title IS 'SEO meta title for the product page';
COMMENT ON COLUMN products.meta_description IS 'SEO meta description for the product page';
COMMENT ON COLUMN products.meta_keywords IS 'SEO meta keywords for the product page';
COMMENT ON COLUMN products.og_title IS 'Open Graph title for social media sharing';
COMMENT ON COLUMN products.og_description IS 'Open Graph description for social media sharing';
COMMENT ON COLUMN products.og_image IS 'Open Graph image URL for social media sharing';
COMMENT ON COLUMN products.canonical_url IS 'Canonical URL for the product page';