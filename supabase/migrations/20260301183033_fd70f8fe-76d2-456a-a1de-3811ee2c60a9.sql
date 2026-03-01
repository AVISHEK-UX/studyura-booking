
-- Add customer_email column
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_email text;

-- Drop restrictive SELECT policies and recreate as permissive
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can read all bookings" ON public.bookings;

CREATE POLICY "Users can read own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
