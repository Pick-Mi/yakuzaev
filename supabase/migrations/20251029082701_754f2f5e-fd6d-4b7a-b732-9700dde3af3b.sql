-- Add missing columns to dealer_enquiries table
ALTER TABLE public.dealer_enquiries
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT,
ADD COLUMN IF NOT EXISTS area_type TEXT,
ADD COLUMN IF NOT EXISTS preferred_location TEXT,
ADD COLUMN IF NOT EXISTS space_ownership TEXT,
ADD COLUMN IF NOT EXISTS space_available TEXT,
ADD COLUMN IF NOT EXISTS investment_capacity TEXT,
ADD COLUMN IF NOT EXISTS has_existing_business TEXT,
ADD COLUMN IF NOT EXISTS years_in_business TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS site_photos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Update the name column to be nullable since we're using first_name and last_name
ALTER TABLE public.dealer_enquiries
ALTER COLUMN name DROP NOT NULL;

-- Add a comment to describe the table
COMMENT ON TABLE public.dealer_enquiries IS 'Stores dealer application form submissions with all required details';