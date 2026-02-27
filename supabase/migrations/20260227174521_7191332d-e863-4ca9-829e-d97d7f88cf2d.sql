
-- Allow admins to update bookings (for status changes, cancellations)
CREATE POLICY "Admins can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
