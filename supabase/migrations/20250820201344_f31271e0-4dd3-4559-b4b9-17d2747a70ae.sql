-- Fix security issues from linter

-- 1. Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

-- 2. Add basic policy for nnypadatabase table (if it has no specific use case, allow authenticated users)
CREATE POLICY "Authenticated users can view nnypadatabase"
ON public.nnypadatabase FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert nnypadatabase"
ON public.nnypadatabase FOR INSERT
TO authenticated
WITH CHECK (true);