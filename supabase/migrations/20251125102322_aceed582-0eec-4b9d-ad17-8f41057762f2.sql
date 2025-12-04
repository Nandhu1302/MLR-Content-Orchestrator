-- Add RLS policies for demo users to insert into aggregation tables

-- Market Intelligence Analytics
CREATE POLICY "Demo users can insert market analytics" 
ON market_intelligence_analytics FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND is_demo_user = true
  )
);

-- HCP Engagement Analytics
CREATE POLICY "Demo users can insert hcp analytics"
ON hcp_engagement_analytics FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND is_demo_user = true
  )
);

-- Social Intelligence Analytics
CREATE POLICY "Demo users can insert social analytics"
ON social_intelligence_analytics FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND is_demo_user = true
  )
);