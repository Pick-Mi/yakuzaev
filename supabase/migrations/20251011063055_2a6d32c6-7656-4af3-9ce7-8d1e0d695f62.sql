-- Add ID verification fields to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS document_type TEXT,
ADD COLUMN IF NOT EXISTS document_number TEXT,
ADD COLUMN IF NOT EXISTS document_file_url TEXT,
ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS address_matches_id BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.document_type IS 'Type of ID document (aadhaar, pan, passport, driving_license)';
COMMENT ON COLUMN public.profiles.document_number IS 'ID document number (e.g., Aadhaar number)';
COMMENT ON COLUMN public.profiles.document_file_url IS 'URL to uploaded ID document in storage';
COMMENT ON COLUMN public.profiles.consent_given IS 'User consent for data processing';
COMMENT ON COLUMN public.profiles.address_matches_id IS 'Whether delivery address matches ID address';