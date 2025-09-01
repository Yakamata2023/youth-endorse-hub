-- Fix function search_path issues
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;