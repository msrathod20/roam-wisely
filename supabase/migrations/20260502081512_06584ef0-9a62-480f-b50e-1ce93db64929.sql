ALTER TABLE public.saved_places
ADD CONSTRAINT saved_places_user_place_unique UNIQUE (user_id, place_id);