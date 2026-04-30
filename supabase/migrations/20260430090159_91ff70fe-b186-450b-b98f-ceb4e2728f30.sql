-- Ensure community gem table has every field the app writes/reads
CREATE TABLE IF NOT EXISTS public.user_gems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'hidden_gem',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  user_id UUID,
  submitter_name TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  likes_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'hidden_gem';
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS submitter_name TEXT;
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved';
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS likes_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) NOT NULL DEFAULT 4.5;
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE public.user_gems ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

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
  IF NEW.latitude IS NULL OR NEW.latitude < -90 OR NEW.latitude > 90 THEN
    RAISE EXCEPTION 'Invalid latitude';
  END IF;
  IF NEW.longitude IS NULL OR NEW.longitude < -180 OR NEW.longitude > 180 THEN
    RAISE EXCEPTION 'Invalid longitude';
  END IF;
  IF NEW.name IS NULL OR length(trim(NEW.name)) < 2 OR length(NEW.name) > 120 THEN
    RAISE EXCEPTION 'Name must be 2-120 characters';
  END IF;
  IF NEW.description IS NULL OR length(trim(NEW.description)) < 10 OR length(NEW.description) > 600 THEN
    RAISE EXCEPTION 'Description must be 10-600 characters';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.force_pending_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.status = 'approved';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_user_gem_trigger ON public.user_gems;
DROP TRIGGER IF EXISTS trg_validate_user_gem ON public.user_gems;
CREATE TRIGGER trg_validate_user_gem
BEFORE INSERT OR UPDATE ON public.user_gems
FOR EACH ROW EXECUTE FUNCTION public.validate_user_gem();

DROP TRIGGER IF EXISTS force_pending_status_trigger ON public.user_gems;
DROP TRIGGER IF EXISTS trg_force_pending_status ON public.user_gems;
CREATE TRIGGER trg_force_pending_status
BEFORE INSERT ON public.user_gems
FOR EACH ROW EXECUTE FUNCTION public.force_pending_status();

ALTER TABLE public.user_gems ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Approved gems are viewable by everyone" ON public.user_gems;
DROP POLICY IF EXISTS "Anyone can submit a gem" ON public.user_gems;
CREATE POLICY "Approved gems are viewable by everyone"
ON public.user_gems
FOR SELECT
USING (status = 'approved');
CREATE POLICY "Anyone can submit a gem"
ON public.user_gems
FOR INSERT
WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_user_gems_status_location ON public.user_gems (status, latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_user_gems_created_at ON public.user_gems (created_at DESC);

-- Canonical saved places table used by the app
CREATE TABLE IF NOT EXISTS public.saved_places (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  place_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, place_id)
);

ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own saved places" ON public.saved_places;
DROP POLICY IF EXISTS "Users can save places" ON public.saved_places;
DROP POLICY IF EXISTS "Users can remove their own saved places" ON public.saved_places;
CREATE POLICY "Users can view their own saved places"
ON public.saved_places
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
CREATE POLICY "Users can save places"
ON public.saved_places
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own saved places"
ON public.saved_places
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_user ON public.saved_places(user_id);

-- Keep previous table name available for older code paths
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  place_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, place_id)
);
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can add their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can remove their own favorites" ON public.user_favorites;
CREATE POLICY "Users can view their own favorites"
ON public.user_favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
CREATE POLICY "Users can add their own favorites"
ON public.user_favorites
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own favorites"
ON public.user_favorites
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON public.user_favorites(user_id);

-- Profile table for signup details
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON public.profiles(user_id);

NOTIFY pgrst, 'reload schema';