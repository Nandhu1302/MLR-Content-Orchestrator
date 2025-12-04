-- Update claim_id_display with sequential values for all claims
WITH numbered_claims AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM public.clinical_claims
)
UPDATE public.clinical_claims c
SET claim_id_display = 'CML-' || LPAD(nc.rn::text, 4, '0')
FROM numbered_claims nc
WHERE c.id = nc.id;