-- Create Site Page Management table
CREATE TABLE public.site_page_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  page_slug TEXT NOT NULL UNIQUE,
  source_code TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  github_url TEXT,
  github_branch TEXT DEFAULT 'main',
  last_synced_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create index on page_slug for faster lookups
CREATE INDEX idx_site_page_management_slug ON public.site_page_management(page_slug);

-- Create index on is_active for filtering
CREATE INDEX idx_site_page_management_active ON public.site_page_management(is_active);

-- Enable Row Level Security
ALTER TABLE public.site_page_management ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage all pages
CREATE POLICY "Admins can manage all site pages"
ON public.site_page_management
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Policy: Public can view active pages
CREATE POLICY "Public can view active site pages"
ON public.site_page_management
FOR SELECT
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_page_management_updated_at
BEFORE UPDATE ON public.site_page_management
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.site_page_management IS 'Stores page source code with version control and GitHub integration';
COMMENT ON COLUMN public.site_page_management.page_name IS 'Display name of the page (e.g., Home Page, About Us)';
COMMENT ON COLUMN public.site_page_management.page_slug IS 'URL slug for the page (e.g., home, about-us)';
COMMENT ON COLUMN public.site_page_management.source_code IS 'The actual source code/content of the page';
COMMENT ON COLUMN public.site_page_management.version IS 'Version number for tracking changes';
COMMENT ON COLUMN public.site_page_management.github_url IS 'GitHub repository URL or file path';
COMMENT ON COLUMN public.site_page_management.metadata IS 'Additional metadata like component dependencies, props, etc.';