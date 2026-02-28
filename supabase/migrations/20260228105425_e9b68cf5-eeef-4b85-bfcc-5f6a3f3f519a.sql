
-- Drop ALL existing restrictive policies on bookings
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can read all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anon can cancel pending bookings" ON public.bookings;

-- Recreate as PERMISSIVE (default) policies

CREATE POLICY "Anyone can insert bookings"
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can read own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update own bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anon can cancel pending bookings"
ON public.bookings FOR UPDATE
TO anon
USING (status = 'PENDING_PAYMENT')
WITH CHECK (status = 'CANCELLED');
