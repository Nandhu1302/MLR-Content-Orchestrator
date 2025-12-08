// ============================================
// Content Modules Intelligence Service
// Handles MLR-approved content modules
// ============================================

import { supabase } from '@/integrations/supabase/client';

import { WORKSHOP_CONFIG } from '@/config/workshop';

export class ModulesService {
  static async fetchMatchingModules(
    brandId,
    intent
  ) {
    const { data, error } = await supabase
      .from('content_modules')
      .select('*')
      .eq('brand_id', brandId)
      .eq('mlr_approved', true)
      .limit(WORKSHOP_CONFIG.DEFAULT_MODULE_LIMIT);

    if (error) {
      console.error('Error fetching modules:', error);
      return [];
    }

    return (data || []).map((module, index) => ({
      id: module.id,
      module_text: module.module_text,
      module_type: module.module_type,
      relevance_score: 0.8 - (index * 0.08),
      mlr_approved: module.mlr_approved || false
    }));
  }
}