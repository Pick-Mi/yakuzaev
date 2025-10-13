-- Add notification CTA columns to site_settings table
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS notification_cta_text text,
ADD COLUMN IF NOT EXISTS notification_cta_url text;