
-- Drop the restrictive SELECT policies and recreate as permissive
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can read all bookings" ON public.bookings;

-- Recreate as permissive (default) so either condition is sufficient
CREATE POLICY "Users can read own bookings"
  ON public.bookings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings"
  ON public.bookings FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
