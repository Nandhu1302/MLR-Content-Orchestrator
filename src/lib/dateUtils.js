/**
 * Parse time range string to date cutoff for database queries
 * Supports both UI format ("Last X Days") and shorthand format ("Xd")
 */
export function parseDateCutoff(timeRange) {
  if (!timeRange || timeRange === 'All' || timeRange === 'All Time') {
    return null;
  }

  const now = new Date();
  let days = 90; // Default

  // Normalize to lowercase for case-insensitive matching
  const normalized = timeRange.toLowerCase();

  // Handle "Last X Days/Months" format
  if (normalized.includes('last 7 days')) {
    days = 7;
  } else if (normalized.includes('last 30 days')) {
    days = 30;
  } else if (normalized.includes('last 90 days')) {
    days = 90;
  } else if (normalized.includes('last 12 months') || normalized.includes('last year')) {
    days = 365;
  }
  // Handle shorthand format (7d, 30d, etc.)
  else if (normalized === '7d' || normalized === '7 days') {
    days = 7;
  } else if (normalized === '30d' || normalized === '30 days') {
    days = 30;
  } else if (normalized === '90d' || normalized === '90 days') {
    days = 90;
  } else if (normalized === '180d' || normalized === '180 days') {
    days = 180;
  } else if (normalized === '1y' || normalized === '1 year') {
    days = 365;
  }

  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return cutoff.toISOString();
}