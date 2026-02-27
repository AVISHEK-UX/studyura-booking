
-- Add whatsapp_number and short_code to libraries
ALTER TABLE public.libraries 
  ADD COLUMN IF NOT EXISTS whatsapp_number text DEFAULT '' NOT NULL,
  ADD COLUMN IF NOT EXISTS short_code text DEFAULT '' NOT NULL;

-- Add new columns to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS booking_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'PENDING_PAYMENT' NOT NULL,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS library_id uuid REFERENCES public.libraries(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON public.bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_library_id ON public.bookings(library_id);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON public.bookings(preferred_date);
