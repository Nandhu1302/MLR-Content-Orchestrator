import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  FileCheck,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simplified brand consistency analysis
const getBrandConsistencyScore = (asset) => {
  const baseScore = 75;
  let score = baseScore;

  if (asset.source_module === 'pre_mlr') score += 15;
  if (asset.type === 'email') score += 5;
  if (asset.type === 'sales_aid') score -= 5;

  const variation = Math.abs(asset.id?.charCodeAt(0) || 0) % 30;
  score += variation - 15;

  return Math.min(Math.max(score, 0), 100);
};

// Simplified MLR status
const getMLRStatus = (asset) => {
  const score = getBrandConsistencyScore(asset);
  const globalApproved = asset.source_module === 'pre_mlr';
  
  // Mock local market readiness
  const readyMarkets = globalApproved ? 5 : Math.floor(score / 20);
  const totalMarkets = 7;
  
  let status = 'Enhanced Review';
  let statusColor = 'bg-yellow-100 text-yellow-800';
  
  if (readyMarkets >= 6) {
    status = 'Standard Review';
    statusColor = 'bg-green-100 text-green-800';
  } else if (readyMarkets <= 2) {
    status = 'Complex Review';
    statusColor = 'bg-red-100 text-red-800';
  }

  return {
    status,
    statusColor,
    readyMarkets,
    totalMarkets,
    complianceScore: Math.round((readyMarkets / totalMarkets) * 100)
  };
};

// Simplified reusability calculation
const getReusabilityScore = (asset) => {
  let score = 70;

  if (asset.type === 'email') score += 20;
  if (asset.type === 'social_media') score += 15;
  if (asset.type === 'landing_page') score += 10;
  if (asset.type === 'sales_aid') score -= 10;

  if (asset.source_module === 'pre_mlr') score += 15;
  if (asset.source_module === 'design_studio') score -= 5;

  if (asset.status === 'approved') score += 10;
  if (asset.status === 'mlr_approved') score += 15;

  return Math.min(Math.max(score, 0), 100);
};

const getReusabilityLevel = (score) => {
  if (score >= 80) return { level: 'High', color: 'text-green-600' };
  if (score >= 60) return { level: 'Medium', color: 'text-yellow-600' };
  return { level: 'Low', color: 'text-red-600' };
};

export const SimplifiedAssetIndicators = ({
  asset,
  className
}) => {
  const brandScore = getBrandConsistencyScore(asset);
  const mlrStatus = getMLRStatus(asset);
  const reusabilityScore = getReusabilityScore(asset);
  const reusability = getReusabilityLevel(reusabilityScore);

  const getBrandIcon = (score) => {
    if (score >= 85) return CheckCircle;
    if (score >= 70) return AlertTriangle;
    return XCircle;
  };

  const getBrandColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const BrandIcon = getBrandIcon(brandScore);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Brand Consistency - Single Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Brand Consistency</span>
        </div>
        <div className="flex items-center gap-1">
          <BrandIcon className={cn("h-3 w-3", getBrandColor(brandScore))} />
          <span className={cn("text-xs font-medium", getBrandColor(brandScore))}>
            {brandScore}%
          </span>
        </div>
      </div>

      {/* MLR Status - Single Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Regulatory Readiness</span>
        </div>
        <Badge className={cn("text-xs h-5", mlrStatus.statusColor)} variant="outline">
          {mlrStatus.status}
        </Badge>
      </div>

      {/* Reusability - Single Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Reusability</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-medium", reusability.color)}>
            {reusability.level}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {reusabilityScore}%
          </span>
        </div>
      </div>
    </div>
  );
};