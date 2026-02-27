
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  library_name text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  preferred_date date NOT NULL,
  preferred_shift text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a booking (public form)
CREATE POLICY "Public can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Only admins can read bookings
CREATE POLICY "Admins can read bookings" ON public.bookings
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
