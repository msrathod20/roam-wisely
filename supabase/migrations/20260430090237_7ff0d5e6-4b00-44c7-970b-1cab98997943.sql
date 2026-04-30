DROP POLICY IF EXISTS "Anyone can submit a gem" ON public.user_gems;
CREATE POLICY "Signed-in users can submit gems"
ON public.user_gems
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can upload gem images" ON storage.objects;
CREATE POLICY "Signed-in users can upload gem images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gem-images');

DROP POLICY IF EXISTS "Gem images are publicly accessible" ON storage.objects;

NOTIFY pgrst, 'reload schema';