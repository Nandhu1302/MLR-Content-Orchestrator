
import React from 'react';
import { EnhancedGlobalAssetContextCapture } from './EnhancedGlobalAssetContextCapture';
import {
  Building2,
  FileText,
  Globe,
  ArrowRight,
  Search,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Target,
  BarChart3,
  Users,
  Calendar,
  Upload,
  Plus,
  Filter,
} from 'lucide-react';
import { SmartAssetDiscoveryHub } from '../SmartAssetDiscoveryHub';
import { AssetMetadataPreservationService } from '@/services/AssetMetadataPreservationService';
import { LocalizationBreadcrumb } from '../LocalizationBreadcrumb';
import { RichPhase1Interface } from '../RichPhase1Interface';
import { useToast } from '@/hooks/use-toast';
import { useBrand } from '@/contexts/BrandContext';

export const GlobalAssetContextCapture = (props) => {
  // Use the enhanced version for all functionality
  return <EnhancedGlobalAssetContextCapture {...props} />;
};
