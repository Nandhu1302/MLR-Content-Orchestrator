-- Add unique constraint for campaign_id to support upsert operations
ALTER TABLE sfmc_campaign_data 
ADD CONSTRAINT sfmc_campaign_data_campaign_id_key UNIQUE (campaign_id);