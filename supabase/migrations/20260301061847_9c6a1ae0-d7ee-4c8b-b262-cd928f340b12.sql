
ALTER TABLE public.libraries ADD COLUMN IF NOT EXISTS discount jsonb DEFAULT NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS base_amount integer;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS discount_applied jsonb DEFAULT NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS final_amount integer;
