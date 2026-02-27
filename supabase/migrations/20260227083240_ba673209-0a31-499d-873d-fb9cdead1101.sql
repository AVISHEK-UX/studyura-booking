
-- Fix libraries policies: drop RESTRICTIVE, recreate as PERMISSIVE
DROP POLICY IF EXISTS "Public can read active libraries" ON public.libraries;
DROP POLICY IF EXISTS "Admins can select all libraries" ON public.libraries;
DROP POLICY IF EXISTS "Admins can insert libraries" ON public.libraries;
DROP POLICY IF EXISTS "Admins can update libraries" ON public.libraries;
DROP POLICY IF EXISTS "Admins can delete libraries" ON public.libraries;

CREATE POLICY "Public can read active libraries" ON public.libraries FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can select all libraries" ON public.libraries FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert libraries" ON public.libraries FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update libraries" ON public.libraries FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete libraries" ON public.libraries FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix app_config policies
DROP POLICY IF EXISTS "Public can read app_config" ON public.app_config;
DROP POLICY IF EXISTS "Admins can update app_config" ON public.app_config;

CREATE POLICY "Public can read app_config" ON public.app_config FOR SELECT USING (true);
CREATE POLICY "Admins can update app_config" ON public.app_config FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix bookings policies
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can read bookings" ON public.bookings;

CREATE POLICY "Public can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can read bookings" ON public.bookings FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles policies
DROP POLICY IF EXISTS "Admins can read user_roles" ON public.user_roles;

CREATE POLICY "Admins can read user_roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix storage policies
DROP POLICY IF EXISTS "Public can read library photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload library photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete library photos" ON storage.objects;

CREATE POLICY "Public can read library photos" ON storage.objects FOR SELECT USING (bucket_id = 'library-photos');
CREATE POLICY "Admins can upload library photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'library-photos' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete library photos" ON storage.objects FOR DELETE USING (bucket_id = 'library-photos' AND has_role(auth.uid(), 'admin'::app_role));
