-- Fix handle_new_user function to remove non-existent display_name column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert profile without display_name column which doesn't exist
  INSERT INTO public.profiles (
    user_id, 
    first_name, 
    last_name, 
    email,
    phone,
    is_verified,
    verification_date
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email,
    NEW.phone,
    CASE 
      WHEN NEW.phone IS NOT NULL THEN true 
      ELSE false 
    END,
    CASE 
      WHEN NEW.phone IS NOT NULL THEN now() 
      ELSE NULL 
    END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    is_verified = EXCLUDED.is_verified,
    verification_date = EXCLUDED.verification_date,
    updated_at = now();
    
  RETURN NEW;
END;
$$;