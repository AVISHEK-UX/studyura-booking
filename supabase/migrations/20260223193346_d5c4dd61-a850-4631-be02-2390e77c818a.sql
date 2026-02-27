
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create libraries table
CREATE TABLE public.libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  pricing JSONB NOT NULL DEFAULT '{}',
  shifts JSONB NOT NULL DEFAULT '[]',
  amenities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  google_maps_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.libraries ENABLE ROW LEVEL SECURITY;

-- Create app_config table (singleton)
CREATE TABLE public.app_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  whatsapp_number TEXT NOT NULL DEFAULT '',
  whatsapp_template TEXT NOT NULL DEFAULT 'Hi, I''m {name}. I''d like to enquire about booking at {library} on {date} for the {shift} shift. Please confirm availability.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Insert default config
INSERT INTO public.app_config (id, whatsapp_number, whatsapp_template) 
VALUES ('main', '', 'Hi, I''m {name}. I''d like to enquire about booking at {library} on {date} for the {shift} shift. Please confirm availability.');

-- Security definer function for role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: user_roles - only admins can read
CREATE POLICY "Admins can read user_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS: libraries - public can read active
CREATE POLICY "Public can read active libraries" ON public.libraries
  FOR SELECT USING (is_active = true);

-- RLS: libraries - admin full access
CREATE POLICY "Admins can do everything with libraries" ON public.libraries
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: app_config - public can read
CREATE POLICY "Public can read app_config" ON public.app_config
  FOR SELECT USING (true);

-- RLS: app_config - admin can update
CREATE POLICY "Admins can update app_config" ON public.app_config
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for library photos
INSERT INTO storage.buckets (id, name, public) VALUES ('library-photos', 'library-photos', true);

-- Storage RLS: public read
CREATE POLICY "Public can read library photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'library-photos');

-- Storage RLS: admin upload
CREATE POLICY "Admins can upload library photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'library-photos' AND public.has_role(auth.uid(), 'admin'));

-- Storage RLS: admin delete
CREATE POLICY "Admins can delete library photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'library-photos' AND public.has_role(auth.uid(), 'admin'));

-- Index for public listing
CREATE INDEX idx_libraries_active_sort ON public.libraries (is_active, sort_order);
