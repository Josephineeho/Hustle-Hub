-- 002_submit_review.sql
-- Secure RPC to allow a payer to submit a review/rating for a provider
-- This function verifies the caller paid for the job and then updates the provider's
-- aggregated rating and review count. It runs as SECURITY DEFINER so it can update
-- the `profiles` table even with restrictive RLS, while still validating the caller.

CREATE OR REPLACE FUNCTION public.submit_review(
  p_job_id UUID,
  p_provider_id UUID,
  p_rating INTEGER,
  p_review_text TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller UUID := auth.uid();
  current_reviews INTEGER;
  current_rating NUMERIC;
  new_reviews INTEGER;
  new_rating NUMERIC;
BEGIN
  -- Basic validation
  IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Invalid rating value';
  END IF;

  -- Ensure the caller actually paid for the job to prevent fraudulent ratings
  IF NOT EXISTS (
    SELECT 1 FROM public.transactions
    WHERE job_id = p_job_id
      AND payer_id = caller
      AND payee_id = p_provider_id
      AND status = 'released'
  ) THEN
    RAISE EXCEPTION 'No completed payment found for this job by caller';
  END IF;

  -- Ensure provider profile exists
  PERFORM 1 FROM public.profiles WHERE id = p_provider_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Provider profile not found';
  END IF;

  -- Compute new aggregate rating safely
  SELECT coalesce(total_reviews,0), coalesce(rating,0)
    INTO current_reviews, current_rating
    FROM public.profiles
    WHERE id = p_provider_id;

  new_reviews := current_reviews + 1;
  new_rating := round(((current_rating * current_reviews + p_rating::numeric) / new_reviews)::numeric, 2);

  UPDATE public.profiles
  SET total_reviews = new_reviews,
      rating = new_rating,
      updated_at = now()
  WHERE id = p_provider_id;

  -- Optionally: store the textual review somewhere (not implemented here)
  RETURN;
END;
$$;

-- Grant execute to authenticated role (optional if using default public role)
GRANT EXECUTE ON FUNCTION public.submit_review(UUID, UUID, INTEGER, TEXT) TO authenticated;
