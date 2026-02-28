
-- Replace the overly permissive anon update policy with a restricted one
DROP POLICY IF EXISTS "Anon can update own bookings" ON public.bookings;

-- Anon users can only update status to CANCELLED (for payment dismissals)
CREATE POLICY "Anon can cancel bookings"
ON public.bookings
FOR UPDATE
TO anon
USING (status = 'PENDING_PAYMENT')
WITH CHECK (status = 'CANCELLED');
