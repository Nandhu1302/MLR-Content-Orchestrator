-- Update all clinical_claims to have proper sequential display IDs where NULL
WITH numbered_claims AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) + 
    COALESCE((SELECT MAX(CAST(SUBSTRING(claim_id_display FROM 5) AS INTEGER)) 
              FROM clinical_claims 
              WHERE claim_id_display IS NOT NULL AND claim_id_display ~ '^CML-\d+$'), 0) as seq_num
  FROM clinical_claims
  WHERE claim_id_display IS NULL
)
UPDATE clinical_claims c
SET claim_id_display = 'CML-' || LPAD(nc.seq_num::TEXT, 4, '0')
FROM numbered_claims nc
WHERE c.id = nc.id;