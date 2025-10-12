-- Update specification_titles to match actual variant data keys (motor, battery, etc.)
UPDATE products 
SET specification_titles = '[
  {"label": "Price", "key": "pricing"},
  {"label": "Colour", "key": "colors"},
  {"label": "Motor Range", "key": "motor"},
  {"label": "Battery", "key": "battery"},
  {"label": "Battery Warranty", "key": "battery_warranty"},
  {"label": "Peak Power", "key": "peak_power"}
]'::jsonb
WHERE id = 'e1b1c722-e76b-4ad0-888f-a75b57d82543';