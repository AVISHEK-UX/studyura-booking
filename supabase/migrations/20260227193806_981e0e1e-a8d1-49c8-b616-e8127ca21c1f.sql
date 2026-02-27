
-- Drop the restrictive insert policy and recreate as permissive
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;

CREATE POLICY "Public can insert bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (true);

-- Also fix SELECT policies to be permissive so users can read their own bookings
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;

CREATE POLICY "Users can read own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can read bookings" ON public.bookings;

CREATE POLICY "Admins can read bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;

CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
