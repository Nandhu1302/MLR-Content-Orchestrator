-- Backfill reference_id_display for all existing references
-- Assign sequential IDs based on creation timestamp (oldest = REF-0001)

WITH numbered_references AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) as row_num
  FROM clinical_references
  WHERE reference_id_display IS NULL
)
UPDATE clinical_references
SET reference_id_display = 'REF-' || LPAD(numbered_references.row_num::TEXT, 4, '0')
FROM numbered_references
WHERE clinical_references.id = numbered_references.id;