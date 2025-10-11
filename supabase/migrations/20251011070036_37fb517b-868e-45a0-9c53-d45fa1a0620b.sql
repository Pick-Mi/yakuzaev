-- Update the handle_new_user function to prevent duplicate profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert profile with ON CONFLICT to prevent duplicate key errors
  INSERT INTO public.profiles (
    user_id, 
    display_name, 
    first_name, 
    last_name, 
    email,
    phone,
    is_verified,
    verification_date
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'display_name',
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
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
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