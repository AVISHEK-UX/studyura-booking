
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_id TEXT,
  ADD COLUMN IF NOT EXISTS order_id TEXT,
  ADD COLUMN IF NOT EXISTS amount INTEGER,
  ADD COLUMN IF NOT EXISTS plan TEXT;

CREATE POLICY "Users can read own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
