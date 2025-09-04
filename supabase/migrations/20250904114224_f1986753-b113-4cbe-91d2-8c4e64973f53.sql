-- Update the trigger function to store phone number and set verification status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert profile with phone number and verification status
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
    -- Set verified to true if phone authentication was used (OTP)
    CASE 
      WHEN NEW.phone IS NOT NULL THEN true 
      ELSE false 
    END,
    -- Set verification date if phone authentication was used
    CASE 
      WHEN NEW.phone IS NOT NULL THEN now() 
      ELSE NULL 
    END
  );
  RETURN NEW;
END;
$$;

-- Create a function to update verification status when phone is confirmed
CREATE OR REPLACE FUNCTION public.update_phone_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update profile verification when phone is confirmed
  IF OLD.phone_confirmed_at IS NULL AND NEW.phone_confirmed_at IS NOT NULL THEN
    UPDATE public.profiles 
    SET 
      is_verified = true,
      verification_date = NEW.phone_confirmed_at,
      phone = NEW.phone
    WHERE user_id = NEW.id;
  END IF;
  
  -- Also update phone number if it changed
  IF OLD.phone != NEW.phone OR (OLD.phone IS NULL AND NEW.phone IS NOT NULL) THEN
    UPDATE public.profiles 
    SET phone = NEW.phone
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update verification when phone is confirmed
DROP TRIGGER IF EXISTS on_phone_confirmed ON auth.users;
CREATE TRIGGER on_phone_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_phone_verification();

-- Update existing profiles for users who have confirmed phone numbers
UPDATE public.profiles 
SET 
  is_verified = true,
  verification_date = auth_users.phone_confirmed_at,
  phone = auth_users.phone
FROM auth.users AS auth_users 
WHERE profiles.user_id = auth_users.id 
  AND auth_users.phone_confirmed_at IS NOT NULL 
  AND (profiles.is_verified = false OR profiles.phone IS NULL);