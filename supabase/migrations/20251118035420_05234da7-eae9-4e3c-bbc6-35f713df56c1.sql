-- Create a table to store page source code
CREATE TABLE public.page_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  page_slug TEXT NOT NULL UNIQUE,
  source_code TEXT NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'public',
  github_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_management ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view pages" 
ON public.page_management 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update pages" 
ON public.page_management 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_page_management_updated_at
BEFORE UPDATE ON public.page_management
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();