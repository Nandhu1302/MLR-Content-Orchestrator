-- Phase 1: Add new columns to web_analytics_raw
ALTER TABLE web_analytics_raw
ADD COLUMN IF NOT EXISTS scroll_depth integer,
ADD COLUMN IF NOT EXISTS time_on_page_seconds integer,
ADD COLUMN IF NOT EXISTS cta_clicks jsonb,
ADD COLUMN IF NOT EXISTS search_terms_used jsonb,
ADD COLUMN IF NOT EXISTS return_visitor boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS visit_count integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS days_since_last_visit integer,
ADD COLUMN IF NOT EXISTS campaign_source text,
ADD COLUMN IF NOT EXISTS campaign_medium text,
ADD COLUMN IF NOT EXISTS campaign_name text,
ADD COLUMN IF NOT EXISTS patient_journey_stage text,
ADD COLUMN IF NOT EXISTS form_submissions jsonb,
ADD COLUMN IF NOT EXISTS video_completion_rate integer,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS urban_rural text;

-- Phase 2: Fix HCP specialties - Remove Cardiology, add HIV-relevant specialties
-- Update Cardiology records to HIV Specialist
UPDATE web_analytics_raw
SET hcp_specialty = 'HIV Specialist'
WHERE hcp_specialty = 'Cardiology';

-- Redistribute some records to other HIV-relevant specialties
-- Update ~15% of HIV Specialist to Pharmacist
UPDATE web_analytics_raw
SET hcp_specialty = 'Pharmacist'
WHERE id IN (
  SELECT id FROM web_analytics_raw 
  WHERE hcp_specialty = 'HIV Specialist' 
  ORDER BY random() 
  LIMIT (SELECT COUNT(*) * 0.15 FROM web_analytics_raw WHERE hcp_specialty = 'HIV Specialist')::integer
);

-- Update ~12% of remaining HIV Specialist to Nurse-NP-PA
UPDATE web_analytics_raw
SET hcp_specialty = 'Nurse-NP-PA'
WHERE id IN (
  SELECT id FROM web_analytics_raw 
  WHERE hcp_specialty = 'HIV Specialist' 
  ORDER BY random() 
  LIMIT (SELECT COUNT(*) * 0.14 FROM web_analytics_raw WHERE hcp_specialty = 'HIV Specialist')::integer
);

-- Update ~8% to Nurse-RN
UPDATE web_analytics_raw
SET hcp_specialty = 'Nurse-RN'
WHERE id IN (
  SELECT id FROM web_analytics_raw 
  WHERE hcp_specialty = 'HIV Specialist' 
  ORDER BY random() 
  LIMIT (SELECT COUNT(*) * 0.10 FROM web_analytics_raw WHERE hcp_specialty = 'HIV Specialist')::integer
);

-- Phase 3: Add Patient and Caregiver visitor types
-- Convert ~40% of HCP records to Patient
UPDATE web_analytics_raw
SET visitor_type = 'Patient',
    hcp_specialty = NULL,
    patient_journey_stage = (ARRAY['Newly Diagnosed', 'Treatment Naive', 'Treatment Experienced', 'Switching Treatment', 'Long-term Stable', 'Adherence Challenges'])[floor(random() * 6 + 1)::integer]
WHERE id IN (
  SELECT id FROM web_analytics_raw 
  WHERE visitor_type = 'HCP' 
  ORDER BY random() 
  LIMIT (SELECT COUNT(*) * 0.40 FROM web_analytics_raw WHERE visitor_type = 'HCP')::integer
);

-- Convert ~8% of remaining HCP to Caregiver
UPDATE web_analytics_raw
SET visitor_type = 'Caregiver',
    hcp_specialty = NULL,
    patient_journey_stage = (ARRAY['Supporting Newly Diagnosed', 'Daily Care Support', 'Treatment Decision Support', 'Emotional Support'])[floor(random() * 4 + 1)::integer]
WHERE id IN (
  SELECT id FROM web_analytics_raw 
  WHERE visitor_type = 'HCP' 
  ORDER BY random() 
  LIMIT (SELECT COUNT(*) * 0.15 FROM web_analytics_raw WHERE visitor_type = 'HCP')::integer
);

-- Phase 4: Expand pages_visited with realistic HIV-branded URLs
-- HCP pages
UPDATE web_analytics_raw
SET pages_visited = (
  CASE 
    WHEN random() < 0.2 THEN '["\/hcp\/efficacy", "\/hcp\/clinical-data", "\/hcp\/dosing-administration", "\/hcp\/request-samples"]'
    WHEN random() < 0.4 THEN '["\/hcp\/mechanism-of-action", "\/hcp\/resistance-data", "\/hcp\/switch-data"]'
    WHEN random() < 0.6 THEN '["\/hcp\/safety-profile", "\/hcp\/drug-interactions", "\/hcp\/prescribing-info"]'
    WHEN random() < 0.8 THEN '["\/hcp\/patient-support", "\/hcp\/copay-program", "\/hcp\/adherence-resources"]'
    ELSE '["\/hcp\/clinical-trials", "\/hcp\/real-world-evidence", "\/hcp\/peer-perspectives", "\/hcp\/webinars"]'
  END
)::jsonb
WHERE visitor_type = 'HCP';

-- Patient pages
UPDATE web_analytics_raw
SET pages_visited = (
  CASE 
    WHEN random() < 0.2 THEN '["\/patient\/about-biktarvy", "\/patient\/how-it-works", "\/patient\/starting-treatment"]'
    WHEN random() < 0.4 THEN '["\/patient\/side-effects", "\/patient\/what-to-expect", "\/patient\/taking-biktarvy"]'
    WHEN random() < 0.6 THEN '["\/patient\/copay-savings", "\/patient\/patient-support", "\/patient\/financial-assistance"]'
    WHEN random() < 0.8 THEN '["\/patient\/real-stories", "\/patient\/community", "\/patient\/living-with-hiv"]'
    ELSE '["\/patient\/resources", "\/patient\/faqs", "\/patient\/contact-support", "\/patient\/download-guide"]'
  END
)::jsonb
WHERE visitor_type = 'Patient';

-- Caregiver pages
UPDATE web_analytics_raw
SET pages_visited = (
  CASE 
    WHEN random() < 0.25 THEN '["\/caregiver\/supporting-loved-one", "\/caregiver\/understanding-hiv", "\/caregiver\/treatment-basics"]'
    WHEN random() < 0.5 THEN '["\/caregiver\/medication-management", "\/caregiver\/adherence-tips", "\/caregiver\/appointment-prep"]'
    WHEN random() < 0.75 THEN '["\/caregiver\/emotional-support", "\/caregiver\/resources", "\/caregiver\/community"]'
    ELSE '["\/caregiver\/self-care", "\/caregiver\/faqs", "\/caregiver\/connect-with-others"]'
  END
)::jsonb
WHERE visitor_type = 'Caregiver';

-- Phase 5: Populate geography fields
UPDATE web_analytics_raw
SET state = (ARRAY['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Georgia', 'Pennsylvania', 'Arizona', 'North Carolina', 'New Jersey', 'Washington', 'Massachusetts', 'Colorado', 'Maryland', 'Nevada', 'Louisiana', 'Tennessee', 'Ohio', 'Michigan', 'Virginia'])[floor(random() * 20 + 1)::integer],
    region = (ARRAY['West', 'South', 'Northeast', 'Midwest', 'Southwest'])[floor(random() * 5 + 1)::integer],
    urban_rural = (ARRAY['Urban', 'Suburban', 'Rural'])[floor(random() * 3 + 1)::integer];

-- Phase 6: Populate engagement metrics
-- Scroll depth (0-100)
UPDATE web_analytics_raw
SET scroll_depth = CASE 
  WHEN bounce = true THEN floor(random() * 30)::integer
  ELSE floor(random() * 70 + 30)::integer
END;

-- Time on page (seconds)
UPDATE web_analytics_raw
SET time_on_page_seconds = CASE 
  WHEN bounce = true THEN floor(random() * 30 + 5)::integer
  WHEN visitor_type = 'HCP' THEN floor(random() * 180 + 60)::integer
  WHEN visitor_type = 'Patient' THEN floor(random() * 240 + 90)::integer
  ELSE floor(random() * 150 + 45)::integer
END;

-- Return visitor and visit count
UPDATE web_analytics_raw
SET return_visitor = random() < 0.35,
    visit_count = CASE 
      WHEN random() < 0.35 THEN floor(random() * 8 + 2)::integer
      ELSE 1
    END;

-- Days since last visit (only for return visitors)
UPDATE web_analytics_raw
SET days_since_last_visit = floor(random() * 60 + 1)::integer
WHERE return_visitor = true;

-- Video completion rate
UPDATE web_analytics_raw
SET video_completion_rate = CASE 
  WHEN random() < 0.3 THEN floor(random() * 100)::integer
  ELSE NULL
END;

-- CTA clicks (JSONB array)
UPDATE web_analytics_raw
SET cta_clicks = CASE 
  WHEN visitor_type = 'HCP' AND random() < 0.4 THEN 
    (ARRAY['["request-samples"]', '["download-pi", "request-samples"]', '["schedule-rep-visit"]', '["view-clinical-data", "download-pi"]', '["watch-moa-video"]'])[floor(random() * 5 + 1)::integer]::jsonb
  WHEN visitor_type = 'Patient' AND random() < 0.5 THEN 
    (ARRAY['["get-copay-card"]', '["find-doctor", "get-copay-card"]', '["download-guide"]', '["watch-patient-story"]', '["sign-up-support"]'])[floor(random() * 5 + 1)::integer]::jsonb
  WHEN visitor_type = 'Caregiver' AND random() < 0.35 THEN 
    (ARRAY['["download-caregiver-guide"]', '["find-support-group"]', '["get-resources"]'])[floor(random() * 3 + 1)::integer]::jsonb
  ELSE NULL
END;

-- Search terms used
UPDATE web_analytics_raw
SET search_terms_used = CASE 
  WHEN random() < 0.25 AND visitor_type = 'HCP' THEN 
    (ARRAY['["resistance data"]', '["drug interactions"]', '["switch study"]', '["dosing"]', '["efficacy data"]'])[floor(random() * 5 + 1)::integer]::jsonb
  WHEN random() < 0.3 AND visitor_type = 'Patient' THEN 
    (ARRAY['["side effects"]', '["how to take"]', '["cost"]', '["copay card"]', '["food requirements"]'])[floor(random() * 5 + 1)::integer]::jsonb
  ELSE NULL
END;

-- Resources downloaded
UPDATE web_analytics_raw
SET resources_downloaded = CASE 
  WHEN visitor_type = 'HCP' AND random() < 0.35 THEN 
    (ARRAY['["prescribing-information.pdf"]', '["dosing-guide.pdf", "drug-interactions-chart.pdf"]', '["clinical-study-summary.pdf"]', '["patient-enrollment-form.pdf"]', '["resistance-data-sheet.pdf"]'])[floor(random() * 5 + 1)::integer]::jsonb
  WHEN visitor_type = 'Patient' AND random() < 0.4 THEN 
    (ARRAY['["patient-brochure.pdf"]', '["medication-guide.pdf"]', '["copay-card.pdf"]', '["daily-reminder-tips.pdf"]', '["what-to-expect.pdf"]'])[floor(random() * 5 + 1)::integer]::jsonb
  WHEN visitor_type = 'Caregiver' AND random() < 0.3 THEN 
    (ARRAY['["caregiver-guide.pdf"]', '["support-resources.pdf"]', '["medication-tracker.pdf"]'])[floor(random() * 3 + 1)::integer]::jsonb
  ELSE NULL
END;

-- Videos watched
UPDATE web_analytics_raw
SET videos_watched = CASE 
  WHEN visitor_type = 'HCP' AND random() < 0.25 THEN 
    (ARRAY['["mechanism-of-action"]', '["clinical-expert-discussion"]', '["resistance-barrier-explained"]'])[floor(random() * 3 + 1)::integer]::jsonb
  WHEN visitor_type = 'Patient' AND random() < 0.35 THEN 
    (ARRAY['["patient-story-marcus"]', '["patient-story-sarah"]', '["how-biktarvy-works"]', '["starting-treatment-journey"]'])[floor(random() * 4 + 1)::integer]::jsonb
  WHEN visitor_type = 'Caregiver' AND random() < 0.25 THEN 
    (ARRAY['["supporting-your-loved-one"]', '["understanding-hiv-treatment"]'])[floor(random() * 2 + 1)::integer]::jsonb
  ELSE NULL
END;

-- Form submissions
UPDATE web_analytics_raw
SET form_submissions = CASE 
  WHEN visitor_type = 'HCP' AND random() < 0.2 THEN 
    (ARRAY['{"type": "sample-request", "completed": true}', '{"type": "rep-visit-request", "completed": true}', '{"type": "webinar-registration", "completed": true}'])[floor(random() * 3 + 1)::integer]::jsonb
  WHEN visitor_type = 'Patient' AND random() < 0.25 THEN 
    (ARRAY['{"type": "copay-enrollment", "completed": true}', '{"type": "support-program", "completed": true}', '{"type": "newsletter-signup", "completed": true}'])[floor(random() * 3 + 1)::integer]::jsonb
  WHEN visitor_type = 'Caregiver' AND random() < 0.15 THEN 
    '{"type": "resource-request", "completed": true}'::jsonb
  ELSE NULL
END;

-- Campaign attribution (for ~30% of traffic)
UPDATE web_analytics_raw
SET campaign_source = (ARRAY['google', 'facebook', 'linkedin', 'email', 'direct', 'medscape', 'doximity', 'webmd'])[floor(random() * 8 + 1)::integer],
    campaign_medium = (ARRAY['cpc', 'organic', 'social', 'email', 'referral', 'display'])[floor(random() * 6 + 1)::integer],
    campaign_name = CASE 
      WHEN visitor_type = 'HCP' THEN (ARRAY['hcp-awareness-q4', 'switch-campaign-2024', 'clinical-data-promo', 'sample-request-drive', 'resistance-education'])[floor(random() * 5 + 1)::integer]
      WHEN visitor_type = 'Patient' THEN (ARRAY['patient-awareness-q4', 'copay-promo-2024', 'adherence-support', 'community-outreach', 'new-patient-welcome'])[floor(random() * 5 + 1)::integer]
      ELSE (ARRAY['caregiver-support-q4', 'family-resources', 'caregiver-community'])[floor(random() * 3 + 1)::integer]
    END
WHERE random() < 0.30;