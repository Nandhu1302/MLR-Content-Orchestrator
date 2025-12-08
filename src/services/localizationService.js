// ...existing code...
import { supabase } from "@/integrations/supabase/client";

export class LocalizationService {
  // Localization Projects Management
  async createLocalizationProject(projectData, brandId, userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // First assess content readiness
    const readinessScore = await this.assessContentReadiness(projectData);

    const projectPayload = {
      brand_id: brandId,
      project_name: projectData.project_name,
      description: projectData.description,
      source_content_type: projectData.source_content_type,
      source_content_id: projectData.source_content_id,
      target_markets: projectData.target_markets,
      target_languages: projectData.target_languages,
      priority_level: projectData.priority_level,
      total_budget: projectData.total_budget,
      estimated_timeline: projectData.desired_timeline,
      content_readiness_score: readinessScore.overall_score,
      regulatory_complexity: this.determineRegulatoryComplexity(projectData.target_markets),
      cultural_sensitivity_level: this.determineCulturalSensitivity(projectData.target_markets),
      created_by: userId,
      updated_by: userId
    };

    const { data, error } = await supabase
      .from('localization_projects')
      .insert([projectPayload])
      .select()
      .single();

    if (error) throw error;

    // Create initial workflows for each market/language combination
    await this.createInitialWorkflows(data.id, projectData.target_markets, projectData.target_languages, userId);

    return data;
  }

  async getLocalizationProjects(brandId) {
    const { data, error } = await supabase
      .from('localization_projects')
      .select('*')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data) || [];
  }

  async getLocalizationProject(projectId) {
    const { data, error } = await supabase
      .from('localization_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) return null;
    return data;
  }

  async updateLocalizationProject(projectId, updates, userId) {
    const { data, error } = await supabase
      .from('localization_projects')
      .update({ ...updates, updated_by: userId })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Content Readiness Assessment (AI-driven)
  async assessContentReadiness(projectData) {
    // This would integrate with AI service for actual assessment
    // For now, returning mock assessment based on project complexity
    const marketCount = projectData.target_markets.length;
    const languageCount = projectData.target_languages.length;
    
    const baseComplexity = Math.min(100, (marketCount * 10) + (languageCount * 5));
    const regulatoryComplexity = projectData.target_markets.reduce((acc, market) => {
      return acc + (market.regulatory_requirements.length * 5);
    }, 0);
    
    const overall_score = Math.max(0, 100 - baseComplexity - regulatoryComplexity);
    
    return {
      overall_score,
      regulatory_complexity_score: Math.max(0, 100 - regulatoryComplexity),
      cultural_sensitivity_score: Math.max(0, 100 - (marketCount * 8)),
      translation_complexity_score: Math.max(0, 100 - (languageCount * 6)),
      market_readiness_scores: projectData.target_markets.reduce((acc, market) => {
        acc[market.market] = Math.max(0, 90 - market.regulatory_requirements.length * 10);
        return acc;
      }, {}),
      recommendations: this.generateReadinessRecommendations(projectData),
      risk_factors: this.identifyRiskFactors(projectData),
      estimated_effort: this.calculateEstimatedEffort(projectData)
    };
  }

  // Translation Memory Management
  async searchTranslationMemory(
    sourceText, 
    sourceLanguage, 
    targetLanguage, 
    brandId
  ) {
    const { data, error } = await supabase
      .from('translation_memory')
      .select('*')
      .eq('brand_id', brandId)
      .eq('source_language', sourceLanguage)
      .eq('target_language', targetLanguage)
      .textSearch('source_text', sourceText)
      .limit(10);

    if (error) throw error;

    return (data || []).map(tm => ({
      translation_memory: tm,
      match_percentage: this.calculateMatchPercentage(sourceText, tm.source_text),
      leverage_potential: (tm.quality_score || 0) / 100,
      cost_savings: this.calculateCostSavings(tm.quality_score || 0)
    }));
  }

  async addTranslationMemory(memoryData, userId) {
    const { data, error } = await supabase
      .from('translation_memory')
      .insert([{ ...memoryData, created_by: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Agency Management
  async findOptimalAgencies(criteria, brandId) {
    const { data: agencies, error } = await supabase
      .from('localization_agencies')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true);

    if (error) throw error;

    return (agencies || []).map(agency => ({
      agency: agency,
      match_score: this.calculateAgencyMatch(agency, criteria),
      match_reasons: this.getMatchReasons(agency, criteria),
      estimated_cost: this.estimateAgencyCost(agency, criteria),
      estimated_timeline: this.estimateAgencyTimeline(agency, criteria),
      availability_status: this.checkAgencyAvailability(agency),
      recommendation_level: this.getRecommendationLevel(agency, criteria)
    })).sort((a, b) => b.match_score - a.match_score);
  }

  async getLocalizationAgencies(brandId) {
    const { data, error } = await supabase
      .from('localization_agencies')
      .select('*')
      .eq('brand_id', brandId)
      .order('performance_score', { ascending: false });

    if (error) throw error;
    return (data) || [];
  }

  async addLocalizationAgency(agencyData, userId) {
    const { data, error } = await supabase
      .from('localization_agencies')
      .insert([{ ...agencyData, created_by: userId, updated_by: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Workflow Management
  async getLocalizationWorkflows(projectId) {
    const { data, error } = await supabase
      .from('localization_workflows')
      .select('*')
      .eq('localization_project_id', projectId)
      .order('priority', { ascending: false });

    if (error) throw error;
    return (data) || [];
  }

  async updateWorkflowStatus(workflowId, status, userId) {
    const updates = { 
      workflow_status: status, 
      updated_by: userId 
    };

    if (status === 'in_progress' && !updates.started_at) {
      updates.started_at = new Date().toISOString();
    }
    
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('localization_workflows')
      .update(updates)
      .eq('id', workflowId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Dashboard Analytics
  async getDashboardData(brandId) {
    const [projects, workflows, analytics] = await Promise.all([
      this.getLocalizationProjects(brandId),
      this.getAllWorkflowsForBrand(brandId),
      this.getLocalizationAnalytics(brandId)
    ]);

    const active_projects = projects.filter(p => p.status === 'in_progress').length;
    const completed_projects = projects.filter(p => p.status === 'completed').length;
    
    // Calculate aggregated metrics
    const cost_savings = analytics
      .filter(a => a.metric_type === 'cost_savings')
      .reduce((sum, a) => sum + a.metric_value, 0);

    const timeline_reduction = analytics
      .filter(a => a.metric_type === 'timeline_performance')
      .reduce((sum, a) => sum + a.metric_value, 0) / 
      Math.max(1, analytics.filter(a => a.metric_type === 'timeline_performance').length);

    const memory_leverage = analytics
      .filter(a => a.metric_type === 'translation_memory_leverage')
      .reduce((sum, a) => sum + a.metric_value, 0) /
      Math.max(1, analytics.filter(a => a.metric_type === 'translation_memory_leverage').length);

    return {
      active_projects,
      completed_projects,
      projects_this_month: projects.filter(p => {
        const created = new Date(p.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
      total_cost_savings: cost_savings,
      avg_time_reduction: timeline_reduction || 0,
      avg_quality_score: workflows.reduce((acc, w) => acc + (w.quality_gates?.length || 0), 0) / Math.max(workflows.length, 1) * 20,
      on_time_delivery_rate: workflows.filter(w => w.workflow_status === 'completed').length / Math.max(workflows.length, 1) * 100,
      cost_efficiency_score: cost_savings > 0 ? 85 : 0,
      translation_memory_leverage: memory_leverage || 0,
      avg_translation_memory_leverage: memory_leverage || 0,
      active_workflows: workflows.filter(w => w.workflow_status === 'in_progress').slice(0, 5),
      recent_completions: projects.filter(p => p.status === 'completed').slice(0, 3),
      performance_metrics: {
        quality_scores: this.calculateQualityScores(workflows),
        on_time_delivery: this.calculateOnTimeDelivery(workflows),
        cost_efficiency: this.calculateCostEfficiency(workflows)
      },
      market_performance: this.calculateMarketPerformance(projects, workflows)
    };
  }

  // Helper methods
  async createInitialWorkflows(
    projectId, 
    markets, 
    languages, 
    userId
  ) {
    const workflows = [];
    
    for (const market of markets) {
      for (const language of languages) {
        workflows.push({
          localization_project_id: projectId,
          workflow_name: `${market.market_name} - ${language}`,
          market: market.market,
          language: language,
          workflow_type: 'translation',
          priority: market.priority === 'high' ? 8 : market.priority === 'medium' ? 5 : 3,
          quality_gates: [],
          dependencies: [],
          deliverables: [],
          feedback: [],
          compliance_checkpoints: [],
          cultural_adaptations: {},
          translation_memory_leverage: 0,
          risk_assessment: {},
          created_by: userId,
          updated_by: userId
        });
      }
    }

    if (workflows.length > 0) {
      const { error } = await supabase
        .from('localization_workflows')
        .insert(workflows);

      if (error) throw error;
    }
  }

  determineRegulatoryComplexity(markets) {
    const totalRequirements = markets.reduce((sum, market) => 
      sum + (market.regulatory_requirements?.length || 0), 0);
    
    if (totalRequirements > 20) return 'critical';
    if (totalRequirements > 10) return 'high';
    if (totalRequirements > 5) return 'standard';
    return 'low';
  }

  determineCulturalSensitivity(markets) {
    const culturalConsiderations = markets.reduce((sum, market) => 
      sum + (market.cultural_considerations?.length || 0), 0);
    
    if (culturalConsiderations > 15) return 'high';
    if (culturalConsiderations > 8) return 'medium';
    return 'low';
  }

  generateReadinessRecommendations(projectData) {
    const recommendations = [];
    
    if (projectData.target_markets.length > 5) {
      recommendations.push("Consider phased rollout for large number of target markets");
    }
    
    if (projectData.target_languages.length > 10) {
      recommendations.push("Prioritize core languages for initial phase");
    }
    
    return recommendations;
  }

  identifyRiskFactors(projectData) {
    const risks = [];
    
    const highRegMarkets = projectData.target_markets.filter(m => 
      m.regulatory_requirements.length > 10);
    
    if (highRegMarkets.length > 0) {
      risks.push(`High regulatory complexity in ${highRegMarkets.length} markets`);
    }
    
    return risks;
  }

  calculateEstimatedEffort(projectData) {
    return {
      translation_hours: projectData.target_languages.length * 40,
      review_hours: projectData.target_languages.length * 20,
      regulatory_hours: projectData.target_markets.length * 16
    };
  }

  calculateMatchPercentage(text1, text2) {
    // Simple Levenshtein distance-based matching
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;
    
    if (longer.length === 0) return 100;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return Math.round(((longer.length - distance) / longer.length) * 100);
  }

  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  calculateCostSavings(qualityScore) {
    return qualityScore * 0.8; // 80% of quality score as cost saving percentage
  }

  calculateAgencyMatch(agency, criteria) {
    let score = 0;
    
    // Language capability match
    const languageMatch = criteria.required_languages.every(lang => 
      agency.language_pairs.some(pair => pair.target === lang));
    if (languageMatch) score += 30;
    
    // Specialization match
    if (agency.specializations.includes(criteria.therapeutic_area)) score += 25;
    
    // Performance metrics
    score += (agency.performance_score * 0.2);
    score += (agency.quality_rating * 0.15);
    score += (agency.on_time_delivery_rate * 0.1);
    
    return Math.min(100, score);
  }

  getMatchReasons(agency, criteria) {
    const reasons = [];
    
    if (agency.specializations.includes(criteria.therapeutic_area)) {
      reasons.push(`Specializes in ${criteria.therapeutic_area}`);
    }
    
    if (agency.performance_score > 80) {
      reasons.push('High performance rating');
    }
    
    return reasons;
  }

  estimateAgencyCost(agency, criteria) {
    const baseCost = 1000;
    const qualityMultiplier = agency.quality_rating / 100;
    const urgencyMultiplier = criteria.timeline_urgency === 'high' ? 1.5 : 
                             criteria.timeline_urgency === 'medium' ? 1.2 : 1.0;
    
    return Math.round(baseCost * qualityMultiplier * urgencyMultiplier);
  }

  estimateAgencyTimeline(agency, criteria) {
    const baseTimeline = 14; // 2 weeks
    const capacityAdjustment = (100 - agency.capacity_rating) * 0.01;
    
    return Math.round(baseTimeline * (1 + capacityAdjustment));
  }

  checkAgencyAvailability(agency) {
    if (agency.capacity_rating > 70) return 'available';
    if (agency.capacity_rating > 30) return 'limited';
    return 'unavailable';
  }

  getRecommendationLevel(agency, criteria) {
    const matchScore = this.calculateAgencyMatch(agency, criteria);
    
    if (matchScore > 80) return 'recommended';
    if (matchScore > 60) return 'suitable';
    return 'backup';
  }

  async getAllWorkflowsForBrand(brandId) {
    const { data, error } = await supabase
      .from('localization_workflows')
      .select(`
        *,
        localization_projects!inner(brand_id)
      `)
      .eq('localization_projects.brand_id', brandId);

    if (error) throw error;
    return (data) || [];
  }

  async getLocalizationAnalytics(brandId) {
    const { data, error } = await supabase
      .from('localization_analytics')
      .select(`
        *,
        localization_projects!inner(brand_id)
      `)
      .eq('localization_projects.brand_id', brandId);

    if (error) throw error;
    return (data) || [];
  }

  calculateQualityScores(workflows) {
    const completedWorkflows = workflows.filter(w => w.workflow_status === 'completed');
    
    return {
      translation: 85, // Would calculate from actual quality gate results
      review: 92,
      cultural_adaptation: 88,
      regulatory: 95
    };
  }

  calculateOnTimeDelivery(workflows) {
    const completedWorkflows = workflows.filter(w => w.workflow_status === 'completed');
    if (completedWorkflows.length === 0) return 0;
    
    // Mock calculation - in reality would compare actual vs estimated completion dates
    return 87.5;
  }

  calculateCostEfficiency(workflows) {
    const completedWorkflows = workflows.filter(w => 
      w.workflow_status === 'completed' && w.estimated_cost && w.actual_cost
    );
    
    if (completedWorkflows.length === 0) return 0;
    
    const efficiency = completedWorkflows.reduce((sum, w) => {
      const saving = ((w.estimated_cost - w.actual_cost) / w.estimated_cost) * 100;
      return sum + Math.max(0, saving);
    }, 0);
    
    return efficiency / completedWorkflows.length;
  }

  calculateMarketPerformance(projects, workflows) {
    const marketData = {};
    
    projects.forEach(project => {
      project.target_markets.forEach(market => {
        if (!marketData[market.market]) {
          marketData[market.market] = {
            projects: 0,
            success_rate: 0,
            average_timeline: 0
          };
        }
        marketData[market.market].projects += 1;
      });
    });
    
    return marketData;
  }
}

export const localizationService = new LocalizationService();
