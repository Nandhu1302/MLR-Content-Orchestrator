
import { FileText, Megaphone, Shield, TrendingUp, Palette, AlertTriangle, File } from "lucide-react";

// Removed TypeScript interface and type annotations

export const DOCUMENT_CATEGORIES = {
  'clinical': {
    icon: FileText,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
    label: 'Clinical',
    description: 'Clinical studies, efficacy data, and prescribing information'
  },
  'marketing': {
    icon: Megaphone,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
    label: 'Marketing',
    description: 'Marketing materials, campaigns, and promotional content'
  },
  'regulatory': {
    icon: Shield,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800',
    label: 'Regulatory',
    description: 'Regulatory submissions, compliance documents'
  },
  'competitive-intelligence': {
    icon: TrendingUp,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    borderColor: 'border-orange-200 dark:border-orange-800',
    label: 'Competitive Intel',
    description: 'Competitive analysis and market intelligence'
  },
  'brand-guidelines': {
    icon: Palette,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
    borderColor: 'border-pink-200 dark:border-pink-800',
    label: 'Brand Guidelines',
    description: 'Brand standards, style guides, and visual identity'
  },
  'safety-information': {
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950',
    borderColor: 'border-red-200 dark:border-red-800',
    label: 'Safety Info',
    description: 'Important safety information and adverse events'
  },
  'other': {
    icon: File,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
    borderColor: 'border-gray-200 dark:border-gray-800',
    label: 'Other',
    description: 'Miscellaneous brand documents'
  }
};

export const getCategoryConfig = (category) => {
  return DOCUMENT_CATEGORIES[category] || DOCUMENT_CATEGORIES['other'];
};
