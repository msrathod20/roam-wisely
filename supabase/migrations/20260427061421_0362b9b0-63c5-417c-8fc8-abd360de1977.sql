-- Replace the force-pending trigger function with an auto-approve version
CREATE OR REPLACE FUNCTION public.force_pending_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Auto-approve all new submissions (demo / FYP mode)
  NEW.status = 'approved';
  RETURN NEW;
END;
$function$;

-- Make sure the trigger is actually attached (it was missing in db-triggers list)
DROP TRIGGER IF EXISTS trg_force_pending_status ON public.user_gems;
CREATE TRIGGER trg_force_pending_status
BEFORE INSERT ON public.user_gems
FOR EACH ROW
EXECUTE FUNCTION public.force_pending_status();

-- Make sure validation trigger is attached too
DROP TRIGGER IF EXISTS trg_validate_user_gem ON public.user_gems;
CREATE TRIGGER trg_validate_user_gem
BEFORE INSERT OR UPDATE ON public.user_gems
FOR EACH ROW
EXECUTE FUNCTION public.validate_user_gem();

-- Approve any pending gems that already exist
UPDATE public.user_gems SET status = 'approved' WHERE status = 'pending';