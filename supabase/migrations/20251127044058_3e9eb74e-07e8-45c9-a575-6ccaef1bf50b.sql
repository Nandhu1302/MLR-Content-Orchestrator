-- Fix IQVIA HCP Decile Data - Update specialties to HIV-relevant
UPDATE iqvia_hcp_decile_raw 
SET specialty = CASE 
  WHEN random() < 0.35 THEN 'HIV Specialist'
  WHEN random() < 0.55 THEN 'Infectious Disease'
  WHEN random() < 0.70 THEN 'Pharmacist'
  WHEN random() < 0.85 THEN 'Nurse-NP-PA'
  ELSE 'Primary Care'
END,
practice_setting = CASE 
  WHEN random() < 0.30 THEN 'Academic Medical Center'
  WHEN random() < 0.55 THEN 'Community Practice'
  WHEN random() < 0.75 THEN 'Hospital'
  ELSE 'Ryan White Clinic'
END,
region = CASE 
  WHEN random() < 0.25 THEN 'Northeast'
  WHEN random() < 0.45 THEN 'Southeast'
  WHEN random() < 0.65 THEN 'West'
  WHEN random() < 0.85 THEN 'Midwest'
  ELSE 'Southwest'
END,
new_to_brand = (random() < 0.18)
WHERE specialty IN ('Endocrinology', 'Cardiology', 'Internal Medicine', 'Primary Care', 'Rheumatology');

-- Fix Veeva CRM Activity Data - Update specialties
UPDATE veeva_crm_activity_raw 
SET hcp_specialty = CASE 
  WHEN random() < 0.40 THEN 'HIV Specialist'
  WHEN random() < 0.60 THEN 'Infectious Disease'
  WHEN random() < 0.75 THEN 'Pharmacist'
  WHEN random() < 0.90 THEN 'Nurse-NP-PA'
  ELSE 'Primary Care'
END
WHERE hcp_specialty = 'Cardiology' OR hcp_specialty IS NULL;

-- Fix Veeva content_presented (JSONB type)
UPDATE veeva_crm_activity_raw 
SET content_presented = CASE 
  WHEN random() < 0.25 THEN '["Efficacy Deck", "Dosing Card"]'::jsonb
  WHEN random() < 0.50 THEN '["Patient Support Materials", "Copay Card Info"]'::jsonb
  WHEN random() < 0.75 THEN '["Clinical Study Summary", "Safety Profile"]'::jsonb
  ELSE '["Switching Guide", "Resistance Data"]'::jsonb
END
WHERE content_presented IS NULL OR content_presented = '{}'::jsonb OR content_presented = '[]'::jsonb;

-- Fix Veeva next_best_action
UPDATE veeva_crm_activity_raw 
SET next_best_action = CASE 
  WHEN random() < 0.30 THEN 'Schedule Follow-up Call'
  WHEN random() < 0.50 THEN 'Send Sample Request'
  WHEN random() < 0.70 THEN 'Invite to Speaker Program'
  WHEN random() < 0.85 THEN 'Share Clinical Data'
  ELSE 'Arrange Peer-to-Peer Meeting'
END
WHERE next_best_action IS NULL;

-- Fix Social Listening Data - basic fields
UPDATE social_listening_raw 
SET author_type = CASE 
  WHEN random() < 0.15 THEN 'HCP'
  WHEN random() < 0.55 THEN 'Patient'
  WHEN random() < 0.75 THEN 'Caregiver'
  ELSE 'Advocate'
END,
sentiment_score = (random() * 2 - 1)::numeric(3,2),
engagement_rate = (random() * 0.15)::numeric(4,3)
WHERE author_type IS NULL;

-- Fix Social topics (text[] array type)
UPDATE social_listening_raw 
SET topics = CASE 
  WHEN random() < 0.20 THEN ARRAY['adherence', 'daily routine']
  WHEN random() < 0.40 THEN ARRAY['side effects', 'tolerability']
  WHEN random() < 0.60 THEN ARRAY['copay assistance', 'insurance']
  WHEN random() < 0.80 THEN ARRAY['switching treatment', 'new diagnosis']
  ELSE ARRAY['viral suppression', 'undetectable']
END
WHERE topics IS NULL OR array_length(topics, 1) IS NULL;

-- Fix Social mentioned_brands (text[] array type)
UPDATE social_listening_raw 
SET mentioned_brands = CASE 
  WHEN random() < 0.40 THEN ARRAY['Biktarvy']
  WHEN random() < 0.60 THEN ARRAY['Biktarvy', 'Descovy']
  WHEN random() < 0.80 THEN ARRAY['Biktarvy', 'Triumeq']
  ELSE ARRAY['Biktarvy', 'Dovato']
END
WHERE mentioned_brands IS NULL OR array_length(mentioned_brands, 1) IS NULL;

-- Add more platforms to social listening
UPDATE social_listening_raw 
SET platform = CASE 
  WHEN random() < 0.25 THEN 'Twitter/X'
  WHEN random() < 0.45 THEN 'Facebook'
  WHEN random() < 0.60 THEN 'Reddit'
  WHEN random() < 0.75 THEN 'Instagram'
  WHEN random() < 0.90 THEN 'LinkedIn'
  ELSE 'Patient Forums'
END
WHERE platform IN ('Twitter', 'Facebook') OR platform IS NULL;

-- Fix SFMC Campaign Data - populate audience_segment
UPDATE sfmc_campaign_raw 
SET audience_segment = CASE 
  WHEN random() < 0.25 THEN 'HCP-Specialist'
  WHEN random() < 0.45 THEN 'HCP-Primary Care'
  WHEN random() < 0.65 THEN 'Patient-Newly Diagnosed'
  WHEN random() < 0.80 THEN 'Patient-Treatment Experienced'
  ELSE 'Caregiver'
END
WHERE audience_segment IS NULL;

-- Fix SFMC geography
UPDATE sfmc_campaign_raw 
SET geography = CASE 
  WHEN random() < 0.25 THEN 'Northeast'
  WHEN random() < 0.45 THEN 'Southeast'
  WHEN random() < 0.65 THEN 'West'
  WHEN random() < 0.85 THEN 'Midwest'
  ELSE 'Southwest'
END
WHERE geography IS NULL;