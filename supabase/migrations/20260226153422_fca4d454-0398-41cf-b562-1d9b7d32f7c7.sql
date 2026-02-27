
-- Add city column to libraries for location-based filtering
ALTER TABLE public.libraries ADD COLUMN city TEXT;

-- Create index for faster filtering
CREATE INDEX idx_libraries_city ON public.libraries(city);
