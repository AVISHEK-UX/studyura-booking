
-- Clean slate: drop ALL existing bookings policies
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can read bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anon can cancel bookings" ON public.bookings;

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 1. Anyone (anon or authenticated) can INSERT bookings
CREATE POLICY "Anyone can insert bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Authenticated users can read their own bookings
CREATE POLICY "Users can read own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 3. Admins can read all bookings
CREATE POLICY "Admins can read all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Admins can update any booking
CREATE POLICY "Admins can update all bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. Authenticated users can update their own bookings
CREATE POLICY "Users can update own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6. Anon can cancel pending bookings (payment dismissed)
CREATE POLICY "Anon can cancel pending bookings"
ON public.bookings
FOR UPDATE
TO anon
USING (status = 'PENDING_PAYMENT')
WITH CHECK (status = 'CANCELLED');
