-- Add site_title column to site_settings table
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS site_title text;