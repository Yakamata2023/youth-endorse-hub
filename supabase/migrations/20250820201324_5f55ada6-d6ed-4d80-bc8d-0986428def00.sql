-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  date_of_birth DATE,
  age_range TEXT CHECK (age_range IN ('18-25', '26-35', '36-45')),
  national_id_type TEXT CHECK (national_id_type IN ('NIN', 'BVN', 'Passport', 'Drivers_License', 'Voters_Card')),
  national_id_number TEXT,
  is_diaspora BOOLEAN NOT NULL DEFAULT FALSE,
  country TEXT,
  state TEXT,
  lga TEXT, -- Local Government Area
  address TEXT,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create endorsement applications table
CREATE TABLE public.endorsement_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  business_description TEXT NOT NULL,
  business_sector TEXT NOT NULL,
  registration_number TEXT,
  years_in_operation INTEGER,
  number_of_employees TEXT CHECK (number_of_employees IN ('1-5', '6-20', '21-50', '51-100', '100+')),
  annual_revenue_range TEXT CHECK (annual_revenue_range IN ('Under 1M', '1M-5M', '5M-25M', '25M-100M', '100M+')),
  business_address TEXT NOT NULL,
  business_state TEXT NOT NULL,
  business_lga TEXT NOT NULL,
  website_url TEXT,
  social_media_links JSONB DEFAULT '{}',
  cac_document_url TEXT,
  business_plan_url TEXT,
  financial_statements_url TEXT,
  other_documents JSONB DEFAULT '[]',
  application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'under_review', 'approved', 'rejected')),
  nnypa_score INTEGER CHECK (nnypa_score >= 0 AND nnypa_score <= 100),
  nnypa_analysis TEXT,
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on endorsement applications
ALTER TABLE public.endorsement_applications ENABLE ROW LEVEL SECURITY;

-- Endorsement applications policies
CREATE POLICY "Users can view their own applications"
ON public.endorsement_applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications"
ON public.endorsement_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending applications"
ON public.endorsement_applications FOR UPDATE
USING (auth.uid() = user_id AND application_status = 'pending');

-- Create admin users table for admin access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_role TEXT DEFAULT 'admin' CHECK (admin_role IN ('admin', 'super_admin')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin policies - only super admins can manage admins
CREATE POLICY "Admins can view admin users"
ON public.admin_users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid()
  )
);

-- Admin access to all endorsement applications
CREATE POLICY "Admins can view all applications"
ON public.endorsement_applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update all applications"
ON public.endorsement_applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid()
  )
);

-- Admin access to all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_endorsement_applications_updated_at
  BEFORE UPDATE ON public.endorsement_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();