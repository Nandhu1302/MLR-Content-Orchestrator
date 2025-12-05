import { supabase } from '@/integrations/supabase/client';

export class OpportunityLearningService {
  /**
   * Track user action on an opportunity
   */
  static async trackAction(signal) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('learning_signals').insert({
      ...signal,
      user_id: user.id
    });
  }

  /**
   * Get user's learned preferences from their action history
   */
  static async getUserPreferences(brandId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return this.getDefaultPreferences();
    }

    // Get all learning signals for this user's opportunities on this brand
    const { data: signals } = await supabase
      .from('learning_signals')
      .select(`
        *,
        content_opportunities!inner(
          brand_id,
          opportunity_type,
          urgency_score,
          trend_data
        )
      `)
      .eq('user_id', user.id)
      .eq('content_opportunities.brand_id', brandId);

    if (!signals || signals.length === 0) {
      return this.getDefaultPreferences();
    }

    // Analyze action patterns
    const actedOn = signals.filter(s => s.action_taken === 'generated_content');
    const dismissed = signals.filter(s => s.action_taken === 'dismissed');

    // Extract preferred types (types user acted on)
    const preferredTypes = this.extractTopItems(
      actedOn.map(s => s.content_opportunities.opportunity_type)
    );

    // Extract dismissed types (types user consistently ignores)
    const dismissedTypes = this.extractTopItems(
      dismissed.map(s => s.content_opportunities.opportunity_type)
    );

    // Extract preferred topics from trend_data
    const preferredTopics = this.extractTopicsFromSignals(actedOn);

    // Calculate average urgency threshold (what urgency score do they typically act on?)
    const avgUrgencyThreshold = actedOn.length > 0
      ? actedOn.reduce((sum, s) => sum + (s.content_opportunities.urgency_score || 0), 0) / actedOn.length
      : 70;

    // Calculate success rate (acted on / total viewed)
    const successRate = signals.length > 0
      ? actedOn.length / signals.length
      : 0;

    return {
      preferredTypes,
      preferredTopics,
      dismissedTypes,
      avgUrgencyThreshold,
      successRate
    };
  }

  /**
   * Personalize opportunity scores based on user preferences
   */
  static personalizeOpportunityScore(
    opportunity,
    preferences
  ) {
    let adjustedScore = opportunity.urgency_score || 0;

    // Boost if it matches preferred type
    if (preferences.preferredTypes.includes(opportunity.opportunity_type)) {
      adjustedScore *= 1.2;
    }

    // Reduce if it matches dismissed type
    if (preferences.dismissedTypes.includes(opportunity.opportunity_type)) {
      adjustedScore *= 0.7;
    }

    // Boost if topics match preferences
    const opportunityTopics = this.extractTopicsFromTrendData(opportunity.trend_data);
    const topicMatch = opportunityTopics.some(topic =>
      preferences.preferredTopics.includes(topic)
    );
    if (topicMatch) {
      adjustedScore *= 1.15;
    }

    // Adjust based on urgency threshold (if below their typical threshold, reduce)
    if (opportunity.urgency_score < preferences.avgUrgencyThreshold * 0.8) {
      adjustedScore *= 0.85;
    }

    return Math.min(100, Math.max(0, adjustedScore));
  }

  /**
   * Get performance insights from past opportunities
   */
  static async getPerformanceInsights(brandId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get opportunities that were acted on with performance data
    const { data: performanceData } = await supabase
      .from('learning_signals')
      .select(`
        *,
        content_opportunities!inner(brand_id, opportunity_type)
      `)
      .eq('user_id', user.id)
      .eq('content_opportunities.brand_id', brandId)
      .eq('action_taken', 'generated_content')
      .not('content_performance', 'is', null);

    if (!performanceData || performanceData.length === 0) {
      return {
        totalActedOn: 0,
        avgPerformance: 0,
        topPerformingType: null,
        insights: []
      };
    }

    // Calculate average performance score
    const avgPerformance = performanceData.reduce((sum, signal) => {
      const perf = signal.content_performance;
      return sum + (perf?.engagement_rate || 0);
    }, 0) / performanceData.length;

    // Find top performing opportunity type
    const typePerformance = this.groupByType(performanceData);
    const topPerformingType = Object.entries(typePerformance)
      .sort(([, a], [, b]) => b.avgScore - a.avgScore)[0];

    return {
      totalActedOn: performanceData.length,
      avgPerformance: Math.round(avgPerformance * 100),
      topPerformingType: topPerformingType ? topPerformingType[0] : null,
      insights: this.generateInsights(performanceData, typePerformance)
    };
  }

  // Helper methods
  static getDefaultPreferences() {
    return {
      preferredTypes: [],
      preferredTopics: [],
      dismissedTypes: [],
      avgUrgencyThreshold: 70,
      successRate: 0
    };
  }

  static extractTopItems(items, topN = 3) {
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, topN)
      .map(([item]) => item);
  }

  static extractTopicsFromSignals(signals) {
    const topics = [];
    signals.forEach(s => {
      const trendData = s.content_opportunities.trend_data;
      topics.push(...this.extractTopicsFromTrendData(trendData));
    });
    return this.extractTopItems(topics, 5);
  }

  static extractTopicsFromTrendData(trendData) {
    if (!trendData) return [];
    const topics = [];
    if (trendData.topic) topics.push(trendData.topic);
    if (trendData.topics) topics.push(...trendData.topics);
    if (trendData.keywords) topics.push(...trendData.keywords);
    return topics;
  }

  static groupByType(signals) {
    return signals.reduce((acc, signal) => {
      const type = (signal.content_opportunities).opportunity_type;
      if (!acc[type]) {
        acc[type] = { count: 0, totalScore: 0, avgScore: 0 };
      }
      acc[type].count++;
      const perf = signal.content_performance;
      acc[type].totalScore += perf?.engagement_rate || 0;
      acc[type].avgScore = acc[type].totalScore / acc[type].count;
      return acc;
    }, {});
  }

  static generateInsights(performanceData, typePerformance) {
    const insights = [];

    // Insight 1: Best performing type
    const bestType = Object.entries(typePerformance)
      .sort(([, a], [, b]) => b.avgScore - a.avgScore)[0];
    if (bestType) {
      insights.push(`${bestType[0]} opportunities perform ${Math.round(bestType[1].avgScore * 100)}% better`);
    }

    // Insight 2: Action frequency
    if (performanceData.length >= 5) {
      insights.push(`You've acted on ${performanceData.length} opportunities this month`);
    }

    return insights;
  }
}