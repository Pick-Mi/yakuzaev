-- Create email_otp_verifications table for dealer application email verification
CREATE TABLE public.email_otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_email_otp_email ON public.email_otp_verifications(email);
CREATE INDEX idx_email_otp_expires ON public.email_otp_verifications(expires_at);

-- Enable RLS
ALTER TABLE public.email_otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow public access for OTP operations (handled by edge functions with service role)
-- No direct access policies needed as edge functions use service role key