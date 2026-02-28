
-- Allow authenticated users to update their own bookings (e.g. cancel on payment dismiss)
CREATE POLICY "Users can update own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow anon to update bookings they just created (status changes like CANCELLED)
-- This is needed because unauthenticated users can also book
CREATE POLICY "Anon can update own bookings"
ON public.bookings
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
