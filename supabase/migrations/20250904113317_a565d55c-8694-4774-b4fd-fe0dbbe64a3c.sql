-- Enhance profiles table to become a comprehensive customer management table
-- Add customer-specific fields for username, address, and payment details

-- Add username field
ALTER TABLE public.profiles 
ADD COLUMN username text UNIQUE;

-- Add customer address fields
ALTER TABLE public.profiles 
ADD COLUMN first_name text,
ADD COLUMN last_name text,
ADD COLUMN email text,
ADD COLUMN date_of_birth date,
ADD COLUMN gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

-- Add address fields
ALTER TABLE public.profiles 
ADD COLUMN street_address text,
ADD COLUMN apartment_unit text,
ADD COLUMN city text,
ADD COLUMN state_province text,
ADD COLUMN postal_code text,
ADD COLUMN country text DEFAULT 'India',
ADD COLUMN address_type text DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'billing', 'shipping'));

-- Add billing address (separate from main address)
ALTER TABLE public.profiles 
ADD COLUMN billing_street_address text,
ADD COLUMN billing_apartment_unit text,
ADD COLUMN billing_city text,
ADD COLUMN billing_state_province text,
ADD COLUMN billing_postal_code text,
ADD COLUMN billing_country text DEFAULT 'India';

-- Add payment and customer management fields
ALTER TABLE public.profiles 
ADD COLUMN customer_type text DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business')),
ADD COLUMN preferred_payment_method text CHECK (preferred_payment_method IN ('card', 'upi', 'netbanking', 'wallet', 'cod')),
ADD COLUMN stripe_customer_id text UNIQUE,
ADD COLUMN customer_notes text,
ADD COLUMN is_verified boolean DEFAULT false,
ADD COLUMN verification_date timestamp with time zone,
ADD COLUMN last_order_date timestamp with time zone,
ADD COLUMN total_orders integer DEFAULT 0,
ADD COLUMN total_spent numeric(10,2) DEFAULT 0.00,
ADD COLUMN loyalty_points integer DEFAULT 0,
ADD COLUMN customer_status text DEFAULT 'active' CHECK (customer_status IN ('active', 'inactive', 'blocked', 'pending_verification'));

-- Add marketing preferences
ALTER TABLE public.profiles 
ADD COLUMN email_notifications boolean DEFAULT true,
ADD COLUMN sms_notifications boolean DEFAULT true,
ADD COLUMN marketing_consent boolean DEFAULT false,
ADD COLUMN newsletter_subscription boolean DEFAULT false;

-- Add indexes for better performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_customer_status ON public.profiles(customer_status);
CREATE INDEX idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX idx_profiles_country ON public.profiles(country);
CREATE INDEX idx_profiles_customer_type ON public.profiles(customer_type);

-- Update the existing trigger function to handle new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    display_name, 
    first_name, 
    last_name, 
    email,
    phone
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email,
    NEW.phone
  );
  RETURN NEW;
END;
$$;

-- Add comment to table for documentation
COMMENT ON TABLE public.profiles IS 'Enhanced customer management table with comprehensive user information, addresses, payment details, and customer analytics';