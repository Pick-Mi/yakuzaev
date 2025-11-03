-- Create storage bucket for ID documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'id-documents',
  'id-documents',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for id-documents bucket
CREATE POLICY "Users can upload their own ID documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'id-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own ID documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'id-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own ID documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'id-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own ID documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'id-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can view all ID documents
CREATE POLICY "Admins can view all ID documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'id-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);