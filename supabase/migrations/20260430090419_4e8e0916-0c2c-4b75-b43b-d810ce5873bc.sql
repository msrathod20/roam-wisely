ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1);
ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS is_eco_friendly BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS why_famous TEXT;
ALTER TABLE public.saved_places ADD COLUMN IF NOT EXISTS things_to_try TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1);
ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS is_eco_friendly BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS why_famous TEXT;
ALTER TABLE public.user_favorites ADD COLUMN IF NOT EXISTS things_to_try TEXT[] NOT NULL DEFAULT '{}';

NOTIFY pgrst, 'reload schema';