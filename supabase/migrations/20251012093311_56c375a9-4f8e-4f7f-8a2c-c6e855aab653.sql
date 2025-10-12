-- Add specification_titles field to products table for variant comparison specs
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS specification_titles jsonb DEFAULT '[
  {"label": "Price", "key": "price"},
  {"label": "Colour", "key": "colors"},
  {"label": "Range", "key": "range"},
  {"label": "Kerb Weight", "key": "kerbWeight"},
  {"label": "Battery Warranty", "key": "batteryWarranty"},
  {"label": "Peak Power", "key": "peakPower"}
]'::jsonb;

COMMENT ON COLUMN public.products.specification_titles IS 'Array of specification row titles to display in variant comparison table. Each item should have label (display name) and key (data field name).';