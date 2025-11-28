-- Drop and recreate job_applications table with clean structure matching the form

DROP TABLE IF EXISTS public.job_applications CASCADE;

CREATE TABLE public.job_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id text NOT NULL,
  job_title text NOT NULL,
  
  -- Personal Details
  salutation text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  country_code text NOT NULL DEFAULT '+91',
  mobile_number text NOT NULL,
  gender text NOT NULL,
  
  -- Resume
  resume_url text,
  
  -- Job Information
  experience_years text NOT NULL,
  current_employer text,
  current_ctc text,
  expected_ctc text,
  notice_period text,
  skill_set text,
  how_found_vacancy text,
  current_location text,
  preferred_location text,
  
  -- Status and metadata
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create their own applications"
  ON public.job_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
  ON public.job_applications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.job_applications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
  ON public.job_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::app_role
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();