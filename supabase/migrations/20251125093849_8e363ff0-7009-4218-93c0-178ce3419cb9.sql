-- Add state_breakdown column to iqvia_rx_raw table
-- This column stores state-level Rx distribution within each region
ALTER TABLE iqvia_rx_raw 
ADD COLUMN IF NOT EXISTS state_breakdown jsonb DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN iqvia_rx_raw.state_breakdown IS 'State-level prescription count breakdown within the region (e.g., {"CA": 15000, "NY": 12000})';