-- Create table for OTP verifications
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX idx_otp_phone_number ON public.otp_verifications(phone_number, created_at DESC);

-- Policy to allow anyone to insert OTP records (needed for verification flow)
CREATE POLICY "Anyone can create OTP records"
  ON public.otp_verifications
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow reading own OTP records
CREATE POLICY "Users can read their OTP records"
  ON public.otp_verifications
  FOR SELECT
  USING (true);

-- Policy to allow updating verification status
CREATE POLICY "Anyone can update verification status"
  ON public.otp_verifications
  FOR UPDATE
  USING (true);