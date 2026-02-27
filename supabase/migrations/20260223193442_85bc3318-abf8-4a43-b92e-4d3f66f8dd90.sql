
-- Drop restrictive policies and recreate as permissive
DROP POLICY "Public can read active libraries" ON public.libraries;
DROP POLICY "Admins can do everything with libraries" ON public.libraries;
DROP POLICY "Public can read app_config" ON public.app_config;
DROP POLICY "Admins can update app_config" ON public.app_config;
DROP POLICY "Admins can read user_roles" ON public.user_roles;

-- Libraries: permissive policies
CREATE POLICY "Public can read active libraries" ON public.libraries
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can insert libraries" ON public.libraries
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update libraries" ON public.libraries
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete libraries" ON public.libraries
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can select all libraries" ON public.libraries
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- App config: permissive
CREATE POLICY "Public can read app_config" ON public.app_config
  FOR SELECT USING (true);

CREATE POLICY "Admins can update app_config" ON public.app_config
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles: permissive
CREATE POLICY "Admins can read user_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
