// ...existing code...
import { supabase } from '@/integrations/supabase/client';

export class EnhancedGuardrailsService {
  /**
   * Get comprehensive brand vision data
   */
  static async getBrandVision(brandId) {
    const { data, error } = await supabase
      .from('brand_vision')
      .select('*')
      .eq('brand_id', brandId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching brand vision:', error);
      return null;
    }

    return data;
  }

  /**
   * Get comprehensive competitive intelligence
   */
  static async getCompetitiveIntelligence(brandId) {
    const { data, error } = await supabase
      .from('competitive_intelligence')
      .select('*')
      .eq('brand_id', brandId)
      .order('threat_level', { ascending: false })
      .order('market_share_percent', { ascending: false });

    if (error) {
      console.error('Error fetching competitive intelligence:', error);
      return [];
    }

    return (data || []);
  }

  /**
   * Get regulatory framework for specific market
   */
  static async getRegulatoryFramework(brandId, market = 'US') {
    const { data, error } = await supabase
      .from('regulatory_framework')
      .select('*')
      .eq('brand_id', brandId)
      .eq('market', market)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching regulatory framework:', error);
      return null;
    }

    return data;
  }

  /**
   * Get audience segments for targeting
   */
  static async getAudienceSegments(brandId, segmentType) {
    let query = supabase
      .from('audience_segments')
      .select('*')
      .eq('brand_id', brandId);

    if (segmentType) {
      query = query.eq('segment_type', segmentType);
    }

    const { data, error } = await query.order('segment_name');

    if (error) {
      console.error('Error fetching audience segments:', error);
      return [];
    }

    return (data || []);
  }

  /**
   * Get market positioning data
   */
  static async getMarketPositioning(brandId, market = 'US') {
    const { data, error } = await supabase
      .from('market_positioning')
      .select('*')
      .eq('brand_id', brandId)
      .eq('market', market)
      .maybeSingle();

    if (error) {
      console.error('Error fetching market positioning:', error);
      return null;
    }

    return data;
  }

  /**
   * Enhanced content compliance check with comprehensive analysis
   */
  static async checkEnhancedContentCompliance(
    content,
    brandId,
    context = {}
  ) {
    // Fetch all comprehensive data
    const [brandVision, competitiveIntel, regulatoryFramework, audienceSegments, marketPositioning] = await Promise.all([
      this.getBrandVision(brandId),
      this.getCompetitiveIntelligence(brandId),
      this.getRegulatoryFramework(brandId, context.market || 'US'),
      this.getAudienceSegments(brandId, context.audience_type),
      this.getMarketPositioning(brandId, context.market || 'US')
    ]);

    const contentLower = content.toLowerCase();
    const suggestions = [];
    const warnings = [];
    let overallScore = 100;

    // 1. Brand Vision Alignment Analysis
    let brandVisionScore = 100;
    if (brandVision) {
      // Check core values alignment
      const coreValues = brandVision.core_values || [];
      const valuesMatch = coreValues.some(value =>
        contentLower.includes(value.toLowerCase().split(' ')[0])
      );
      if (!valuesMatch && coreValues.length > 0) {
        brandVisionScore -= 20;
        suggestions.push(`Consider incorporating brand values: ${coreValues.slice(0, 3).join(', ')}`);
      }

      // Check brand personality alignment
      const personality = brandVision.brand_personality;
      if (personality && personality.primary_traits) {
        const traitsMatch = personality.primary_traits.some(trait =>
          contentLower.includes(trait.toLowerCase())
        );
        if (!traitsMatch) {
          brandVisionScore -= 15;
          suggestions.push(`Align content with brand personality traits: ${personality.primary_traits.slice(0, 3).join(', ')}`);
        }
      }

      // Check emotional connection alignment
      const emotions = brandVision.emotional_connection;
      if (context.audience_type && emotions) {
        const audienceEmotions = emotions[`${context.audience_type}_emotions`] || [];
        const emotionMatch = audienceEmotions.some(emotion =>
          contentLower.includes(emotion.toLowerCase())
        );
        if (!emotionMatch && audienceEmotions.length > 0) {
          brandVisionScore -= 10;
          suggestions.push(`Connect emotionally with ${context.audience_type}s through: ${audienceEmotions.slice(0, 2).join(', ')}`);
        }
      }
    }

    // 2. Competitive Positioning Analysis
    let competitiveScore = 100;
    if (competitiveIntel.length > 0) {
      const highThreatCompetitors = competitiveIntel.filter(c => c.threat_level === 'high' || c.threat_level === 'critical');

      // Check for competitive advantages utilization
      const allAdvantages = competitiveIntel.flatMap(c => c.competitive_advantages || []);
      const advantageMatch = allAdvantages.some(advantage =>
        contentLower.includes((advantage || '').toLowerCase().split(' ')[0])
      );
      if (!advantageMatch && allAdvantages.length > 0) {
        competitiveScore -= 20;
        suggestions.push(`Highlight competitive advantages: ${allAdvantages.slice(0, 3).join(', ')}`);
      }

      // Check for inadvertent competitor promotion
      highThreatCompetitors.forEach(competitor => {
        if (competitor.competitor_name && contentLower.includes(competitor.competitor_name.toLowerCase()) ||
            (competitor.competitor_brand && contentLower.includes(competitor.competitor_brand.toLowerCase()))) {
          competitiveScore -= 25;
          warnings.push(`Content mentions high-threat competitor: ${competitor.competitor_name}. Consider alternative messaging.`);
        }
      });

      // Check response strategy alignment
      const responseStrategies = competitiveIntel
        .filter(c => c.response_strategy)
        .map(c => (c.response_strategy && c.response_strategy.differentiation) || '')
        .filter(Boolean);

      if (responseStrategies.length > 0) {
        const strategyMatch = responseStrategies.some(strategy =>
          contentLower.includes(strategy.toLowerCase().split(' ')[0])
        );
        if (!strategyMatch) {
          competitiveScore -= 15;
          suggestions.push('Consider incorporating competitive differentiation strategies');
        }
      }
    }

    // 3. Regulatory Compliance Analysis
    let regulatoryScore = 100;
    if (regulatoryFramework) {
      // Check required disclaimers
      const requiredDisclaimers = regulatoryFramework.required_disclaimers || [];
      const disclaimerMatch = requiredDisclaimers.some(disclaimer => {
        const disclaimerText = typeof disclaimer === 'string' ? disclaimer : (disclaimer.content || disclaimer.type || '');
        return contentLower.includes((disclaimerText || '').toLowerCase().split(' ')[0]);
      });
      if (!disclaimerMatch && requiredDisclaimers.length > 0) {
        regulatoryScore -= 30;
        const disclaimerTexts = requiredDisclaimers.slice(0, 2).map(d =>
          typeof d === 'string' ? d : (d.title || d.content || d.type || '')
        );
        warnings.push(`Missing required disclaimers. Include: ${disclaimerTexts.join(', ')}`);
      }

      // Check promotional restrictions
      const restrictions = regulatoryFramework.promotional_restrictions || [];
      const restrictionViolation = restrictions.some(restriction => {
        const restrictionText = typeof restriction === 'string' ? restriction : (restriction.content || restriction.type || '');
        return contentLower.includes(restrictionText.toLowerCase());
      });
      if (restrictionViolation) {
        regulatoryScore -= 40;
        warnings.push('Content may violate promotional restrictions');
      }

      // Check fair balance requirements for claims
      const fairBalance = regulatoryFramework.fair_balance_requirements;
      if (fairBalance && fairBalance.efficacy_claims && (contentLower.includes('proven') || contentLower.includes('effective'))) {
        const hasBalancedInfo = contentLower.includes('risk') || contentLower.includes('side effect') || contentLower.includes('warning');
        if (!hasBalancedInfo) {
          regulatoryScore -= 25;
          warnings.push('Efficacy claims require balanced safety information');
        }
      }
    }

    // 4. Audience Targeting Analysis
    let audienceScore = 100;
    if (audienceSegments.length > 0 && context.audience_type) {
      const relevantSegment = audienceSegments.find(s => s.segment_type === context.audience_type);
      if (relevantSegment) {
        // Check communication preferences
        const commPrefs = relevantSegment.communication_preferences;
        if (commPrefs && commPrefs.tone) {
          const preferredTone = commPrefs.tone.toLowerCase();
          const toneMatch = contentLower.includes(preferredTone) ||
                           (preferredTone === 'scientific' && (contentLower.includes('study') || contentLower.includes('data'))) ||
                           (preferredTone === 'empathetic' && (contentLower.includes('understand') || contentLower.includes('support')));
          if (!toneMatch) {
            audienceScore -= 20;
            suggestions.push(`Adapt tone for ${context.audience_type} audience: ${preferredTone}`);
          }
        }

        // Check trust factors
        const trustFactors = relevantSegment.trust_factors || [];
        const trustMatch = trustFactors.some(factor =>
          contentLower.includes((factor || '').toLowerCase().split(' ')[0])
        );
        if (!trustMatch && trustFactors.length > 0) {
          audienceScore -= 15;
          suggestions.push(`Build trust with ${context.audience_type}s through: ${trustFactors.slice(0, 2).join(', ')}`);
        }

        // Check motivations alignment
        const motivations = relevantSegment.motivations || [];
        const motivationMatch = motivations.some(motivation =>
          contentLower.includes((motivation || '').toLowerCase().split(' ')[0])
        );
        if (!motivationMatch && motivations.length > 0) {
          audienceScore -= 10;
          suggestions.push(`Address key motivations: ${motivations.slice(0, 2).join(', ')}`);
        }
      }
    }

    // 5. Market Positioning Analysis
    let positioningScore = 100;
    if (marketPositioning) {
      // Check positioning statement alignment
      const positioningWords = (marketPositioning.positioning_statement || '').toLowerCase().split(' ');
      const positioningMatch = positioningWords.some(word =>
        word.length > 4 && contentLower.includes(word)
      );
      if (!positioningMatch) {
        positioningScore -= 20;
        suggestions.push('Align with brand positioning statement');
      }

      // Check proof points utilization
      const proofPoints = marketPositioning.proof_points || [];
      const proofMatch = proofPoints.some(point =>
        contentLower.includes((point || '').toLowerCase().split(' ')[0])
      );
      if (!proofMatch && proofPoints.length > 0) {
        positioningScore -= 15;
        suggestions.push(`Include key proof points: ${proofPoints.slice(0, 2).join(', ')}`);
      }

      // Check messaging hierarchy
      const hierarchy = marketPositioning.messaging_hierarchy || [];
      const hierarchyMatch = hierarchy.some(message =>
        contentLower.includes((message || '').toLowerCase().split(' ')[0])
      );
      if (!hierarchyMatch && hierarchy.length > 0) {
        positioningScore -= 10;
        suggestions.push(`Consider priority messages: ${hierarchy.slice(0, 2).join(', ')}`);
      }
    }

    // 6. Therapeutic Area Appropriateness
    let therapeuticScore = 100;
    if (context.therapeutic_area) {
      // Basic therapeutic area terminology check
      const therapeuticTerms = {
        'cardiovascular': ['heart', 'cardiac', 'cardiovascular', 'cv', 'stroke', 'blood pressure'],
        'diabetes': ['diabetes', 'glucose', 'blood sugar', 'insulin', 'diabetic', 'glycemic'],
        'respiratory': ['lung', 'respiratory', 'breathing', 'pulmonary', 'fibrosis', 'copd'],
        'anticoagulation': ['blood clot', 'stroke', 'anticoagulation', 'bleeding', 'coagulation']
      };

      const relevantTerms = therapeuticTerms[context.therapeutic_area.toLowerCase()] || [];
      const therapeuticMatch = relevantTerms.some(term => contentLower.includes(term));
      if (!therapeuticMatch && relevantTerms.length > 0) {
        therapeuticScore -= 15;
        suggestions.push(`Include relevant ${context.therapeutic_area} terminology`);
      }
    }

    // Calculate overall score
    const scores = [brandVisionScore, competitiveScore, regulatoryScore, audienceScore, positioningScore, therapeuticScore];
    overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

    return {
      guideline_adherence: Math.max(0, overallScore),
      tone_match: brandVisionScore > 80,
      key_message_alignment: positioningScore > 80,
      competitive_positioning: competitiveScore > 80,
      regulatory_compliance: regulatoryScore > 80,
      suggestions,
      warnings,

      // Enhanced scoring
      brand_vision_alignment: Math.max(0, brandVisionScore),
      competitive_positioning_score: Math.max(0, competitiveScore),
      regulatory_compliance_score: Math.max(0, regulatoryScore),
      audience_targeting_score: Math.max(0, audienceScore),
      market_positioning_alignment: Math.max(0, positioningScore),
      therapeutic_area_appropriateness: Math.max(0, therapeuticScore),

      // Detailed recommendations
      detailed_recommendations: {
        brand_voice_suggestions: suggestions.filter(s => s.includes('brand') || s.includes('personality') || s.includes('values')),
        competitive_messaging_tips: suggestions.filter(s => s.includes('competitive') || s.includes('advantage') || s.includes('differentiation')),
        regulatory_compliance_actions: warnings.filter(w => w.includes('disclaimer') || w.includes('restriction') || w.includes('balance')),
        audience_optimization_tips: suggestions.filter(s => s.includes('audience') || s.includes('tone') || s.includes('trust') || s.includes('motivations')),
        positioning_enhancements: suggestions.filter(s => s.includes('positioning') || s.includes('proof') || s.includes('message'))
      }
    };
  }

  /**
   * Get competitive intelligence insights for guardrails
   */
  static async getCompetitiveGuidance(brandId) {
    const competitiveIntel = await this.getCompetitiveIntelligence(brandId);

    const topThreats = competitiveIntel
      .filter(c => c.threat_level === 'high' || c.threat_level === 'critical')
      .slice(0, 3);

    const messagingOpportunities = competitiveIntel
      .flatMap(c => c.competitive_weaknesses || [])
      .slice(0, 5);

    const avoidanceStrategies = topThreats
      .map(threat => `Avoid mentioning ${threat.competitor_name} or ${threat.competitor_brand}`)
      .concat(topThreats.map(threat => (threat.response_strategy && threat.response_strategy.positioning) || ''))
      .filter(Boolean);

    const differentiationPoints = competitiveIntel
      .flatMap(c => c.competitive_advantages || [])
      .slice(0, 10);

    return {
      topThreats,
      messagingOpportunities,
      avoidanceStrategies,
      differentiationPoints
    };
  }

  /**
   * Log audit trail for compliance
   */
  static async logAuditAction(
    action,
    tableName,
    recordId,
    oldData,
    newData,
    brandId
  ) {
    try {
      await supabase.from('audit_logs').insert({
        action_type: action,
        table_name: tableName,
        record_id: recordId,
        old_data: oldData,
        new_data: newData,
        brand_id: brandId,
        ip_address: null, // Would be populated by edge function in real implementation
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
      });
    } catch (error) {
      console.error('Error logging audit action:', error);
    }
  }
}