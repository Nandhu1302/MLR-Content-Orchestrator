-- Mark key visual assets as MLR approved
-- These are the most commonly used efficacy and safety tables

UPDATE visual_assets
SET mlr_approved = true
WHERE title IN (
  'Table 14: Virologic Outcomes at Week 144',
  'Table 1: Adverse Reactions',
  'Table 15: Virologic Outcomes for Switch patients',
  'Table 2: Treatment-Emergent Resistance',
  'Table 3: Laboratory Abnormalities',
  'Figure 1: Virologic Response Through Week 48',
  'Table 6: Drug Interactions',
  'Table 4: Recommended Dosage',
  'Chart 1: Safety Profile Comparison',
  'Table 8: Patient Demographics and Baseline Characteristics'
);