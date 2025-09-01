-- Fix infinite recursion in admin_users policies by creating security definer function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  );
END;
$function$;

-- Update admin_users policies to use the function
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (public.is_admin_user());

-- Update other policies that might reference admin_users
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can view all applications" ON public.endorsement_applications;
CREATE POLICY "Admins can view all applications" 
ON public.endorsement_applications 
FOR SELECT 
TO authenticated
USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can update all applications" ON public.endorsement_applications;
CREATE POLICY "Admins can update all applications" 
ON public.endorsement_applications 
FOR UPDATE 
TO authenticated
USING (public.is_admin_user());