
-- Create user_gems table for community-contributed places
CREATE TABLE public.user_gems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'hidden_gem',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  user_id UUID,
  submitter_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  likes_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Validation trigger (avoid CHECK constraints for flexibility)
CREATE OR REPLACE FUNCTION public.validate_user_gem()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status: %', NEW.status;
  END IF;
  IF NEW.category NOT IN ('hidden_gem', 'food_spot', 'sunset_point', 'local_favorite') THEN
    RAISE EXCEPTION 'Invalid category: %', NEW.category;
  END IF;
  IF NEW.latitude < -90 OR NEW.latitude > 90 THEN
    RAISE EXCEPTION 'Invalid latitude';
  END IF;
  IF NEW.longitude < -180 OR NEW.longitude > 180 THEN
    RAISE EXCEPTION 'Invalid longitude';
  END IF;
  IF length(trim(NEW.name)) < 2 OR length(NEW.name) > 120 THEN
    RAISE EXCEPTION 'Name must be 2-120 characters';
  END IF;
  IF length(trim(NEW.description)) < 10 OR length(NEW.description) > 600 THEN
    RAISE EXCEPTION 'Description must be 10-600 characters';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_user_gem_trigger
BEFORE INSERT OR UPDATE ON public.user_gems
FOR EACH ROW EXECUTE FUNCTION public.validate_user_gem();

-- Force pending status on insert (cannot self-approve)
CREATE OR REPLACE FUNCTION public.force_pending_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.status = 'pending';
  RETURN NEW;
END;
$$;

CREATE TRIGGER force_pending_status_trigger
BEFORE INSERT ON public.user_gems
FOR EACH ROW EXECUTE FUNCTION public.force_pending_status();

-- Enable RLS
ALTER TABLE public.user_gems ENABLE ROW LEVEL SECURITY;

-- Anyone can view APPROVED gems only (moderation enforced at DB level)
CREATE POLICY "Approved gems are viewable by everyone"
ON public.user_gems
FOR SELECT
USING (status = 'approved');

-- Anyone (including anon) can submit a gem; trigger forces status='pending'
CREATE POLICY "Anyone can submit a gem"
ON public.user_gems
FOR INSERT
WITH CHECK (true);

-- Index for performance
CREATE INDEX idx_user_gems_status_location ON public.user_gems (status, latitude, longitude);
CREATE INDEX idx_user_gems_created_at ON public.user_gems (created_at DESC);

-- Storage bucket for gem images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gem-images', 'gem-images', true);

-- Public read of gem images
CREATE POLICY "Gem images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gem-images');

-- Anyone can upload to gem-images (size limit handled in client)
CREATE POLICY "Anyone can upload gem images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'gem-images');
