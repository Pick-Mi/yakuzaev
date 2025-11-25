-- Add customer activity tracking column to profiles table
ALTER TABLE public.profiles
ADD COLUMN activity_log JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.profiles.activity_log IS 'Stores customer activities like cart items, abandoned checkouts, incomplete orders, and other engagement data';
