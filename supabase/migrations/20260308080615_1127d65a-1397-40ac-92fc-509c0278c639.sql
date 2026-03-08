INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true);

CREATE POLICY "Authenticated users can read receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'receipts');

CREATE POLICY "Service role can upload receipts"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Service role can update receipts"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'receipts');