-- Create storage policies for nnypapublic bucket (profile pictures)
CREATE POLICY "Users can upload their own profile pictures" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'nnypapublic' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own profile pictures" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'nnypapublic' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile pictures" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'nnypapublic' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile pictures" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'nnypapublic' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile pictures are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'nnypapublic');

-- Create storage policies for nnypadocuments bucket (private documents)
CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'nnypadocuments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'nnypadocuments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'nnypadocuments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'nnypadocuments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create security definer function to check admin status (to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Admin policies for accessing all documents in nnypadocuments
CREATE POLICY "Admins can view all documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'nnypadocuments' AND public.is_admin_user());

CREATE POLICY "Admins can download all documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'nnypadocuments' AND public.is_admin_user());

-- Update profiles table to include profile picture URL
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Add additional fields that might be needed for comprehensive applications
ALTER TABLE public.endorsement_applications 
ADD COLUMN IF NOT EXISTS applicant_id_document_url TEXT,
ADD COLUMN IF NOT EXISTS additional_certifications JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS business_goals TEXT,
ADD COLUMN IF NOT EXISTS expected_impact TEXT,
ADD COLUMN IF NOT EXISTS funding_requirements TEXT,
ADD COLUMN IF NOT EXISTS employment_plan TEXT;

-- Create a function to get file download URL for admins
CREATE OR REPLACE FUNCTION public.admin_get_file_url(
  bucket_name TEXT,
  file_path TEXT
)
RETURNS TEXT AS $$
DECLARE
  file_url TEXT;
BEGIN
  -- Only allow admins to use this function
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Return the public URL or signed URL for the file
  SELECT CONCAT('https://lfpaugarolblhuimgmdn.supabase.co/storage/v1/object/public/', bucket_name, '/', file_path)
  INTO file_url;
  
  RETURN file_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;