export class ContentProgressCalculator {
  static calculateProgress(asset, variations, versions) {
    // Add defensive null checks
    if (!asset) {
      return this.getDefaultMetrics();
    }
    
    // Handle both new structured content and migrated data
    const content = asset.primary_content || {};
    
    // Add logging for debugging
    if (Object.keys(content).length === 0) {
      console.warn('[ContentProgressCalculator] Asset has no primary_content:', asset.id);
    }
    
    // For migrated data, check if it has basic structure
    const hasBasicContent = Object.keys(content).length > 0;
    const hasCompleteContent = hasBasicContent && (
      content.headline || content.subject_line || content.page_title || 
      content.body || content.content || content.primary_content ||
      content.assets // For migrated campaign data
    );
    
    // Calculate creation score based on available content - more lenient thresholds
    // Check _original_structure first for most accurate field detection
    const originalStructure = content._original_structure;
    
    const creationScore = this.calculateCreationScore({
      hasHeadline: !!(
        content.headline || content.subject_line || content.subject || content.page_title ||
        originalStructure?.headline || originalStructure?.subject
      ),
      hasBodyContent: !!(
        content.body || content.content || content.primary_content || hasCompleteContent ||
        originalStructure?.body
      ),
      hasCallToAction: !!(
        content.callToAction || content.call_to_action || content.cta ||
        originalStructure?.cta
      ),
      hasKeyMessages: !!(
        content.keyMessage || content.key_messages || content.sections ||
        originalStructure?.keyMessage
      ),
      hasTargetAudience: !!(asset.target_audience || content.primaryAudience || content.audienceSegment),
      aiAnalysisComplete: Object.keys(asset.ai_analysis || {}).length > 0
    });

    // Calculate review score
    const reviewScore = this.calculateReviewScore({
      creationComplete: creationScore > 70,
      hasVariations: (variations?.length || 0) > 0,
      reviewSubmitted: ['in_review', 'approved', 'design_ready', 'completed'].includes(asset.status),
      medicalReviewDone: asset.ai_analysis?.compliance_score > 80,
      legalReviewDone: asset.status === 'completed'
    });

    // Calculate design score  
    const designScore = this.calculateDesignScore({
      reviewComplete: reviewScore > 70,
      designHandoffCreated: asset.status === 'completed' || asset.status === 'design_ready',
      visualAssetsReady: !!(asset.channel_specifications && Object.keys(asset.channel_specifications).length > 0),
      brandComplianceApproved: asset.ai_analysis?.compliance_score > 85
    });

    const overall = Math.round((creationScore + reviewScore + designScore) / 3);

    return {
      overall,
      creation: creationScore,
      review: reviewScore, 
      design: designScore,
      
      // Detailed flags based on migrated/new data structure
      // Check _original_structure first for most accurate field detection
      hasHeadline: !!(
        content.headline || content.subject_line || content.subject || content.page_title ||
        content._original_structure?.headline || content._original_structure?.subject
      ),
      hasBodyContent: !!(
        hasCompleteContent ||
        content._original_structure?.body
      ),
      hasCallToAction: !!(
        content.callToAction || content.call_to_action || content.cta ||
        content._original_structure?.cta
      ),
      hasKeyMessages: !!(
        content.keyMessage || content.key_messages || content.sections ||
        content._original_structure?.keyMessage
      ),
      hasTargetAudience: !!(asset.target_audience || content.primaryAudience),
      aiAnalysisComplete: Object.keys(asset.ai_analysis || {}).length > 0,
      hasVariations: (variations?.length || 0) > 0,
      reviewSubmitted: ['in_review', 'approved', 'design_ready', 'completed'].includes(asset.status),
      medicalReviewDone: asset.ai_analysis?.compliance_score > 80,
      legalReviewDone: asset.status === 'completed',
      designHandoffCreated: ['completed', 'design_ready'].includes(asset.status),
      visualAssetsReady: !!(asset.channel_specifications && Object.keys(asset.channel_specifications).length > 0),
      brandComplianceApproved: asset.ai_analysis?.compliance_score > 85
    };
  }

  static getProgressStatus(progress) {
    if (progress >= 90) {
      return { status: 'Ready to Publish', phase: 'complete', color: 'green' };
    } else if (progress >= 70) {
      return { status: 'In Review', phase: 'review', color: 'blue' };
    } else if (progress >= 25) {
      return { status: 'In Creation', phase: 'creation', color: 'orange' };
    } else {
      return { status: 'Draft', phase: 'creation', color: 'gray' };
    }
  }

  static getNextSteps(progress) {
    const steps = [];
    
    // Creation phase next steps
    if (!progress.hasHeadline) {
      steps.push('Add a compelling headline or subject line');
    }
    if (!progress.hasBodyContent) {
      steps.push('Write the main content body');
    }
    if (!progress.hasCallToAction && progress.hasBodyContent) {
      steps.push('Add a clear call-to-action');
    }
    if (!progress.hasKeyMessages && progress.hasBodyContent) {
      steps.push('Define key messaging points');
    }
    if (!progress.aiAnalysisComplete && progress.hasBodyContent) {
      steps.push('Run AI analysis for content insights');
    }
    
    // Review phase next steps
    if (progress.creation >= 70 && !progress.hasVariations) {
      steps.push('Generate content variations for different audiences');
    }
    if (progress.creation >= 70 && !progress.reviewSubmitted) {
      steps.push('Submit content for medical/legal review');
    }
    
    // Design phase next steps
    if (progress.review >= 70 && !progress.designHandoffCreated) {
      steps.push('Hand off to Design Studio');
    }
    
    // If no specific steps, provide general guidance
    if (steps.length === 0) {
      if (progress.overall >= 90) {
        steps.push('Content is ready for publication');
      } else {
        steps.push('Continue refining and optimizing content');
      }
    }
    
    return steps;
  }

  // Helper methods for score calculation
  static calculateCreationScore(flags) {
    let score = 20; // Base score to ensure visibility
    
    // More lenient scoring - any content should show as "in progress"
    if (flags.hasBodyContent) score += 50; // Most important
    if (flags.hasHeadline) score += 15;
    if (flags.hasCallToAction) score += 5;
    if (flags.hasTargetAudience) score += 5;
    if (flags.hasKeyMessages) score += 3;
    if (flags.aiAnalysisComplete) score += 2;
    
    return Math.min(score, 100);
  }

  static calculateReviewScore(flags) {
    if (!flags.creationComplete) return 20; // Base score even without creation complete
    
    let score = 50; // Lower base from creation
    
    if (flags.hasVariations) score += 10;
    if (flags.reviewSubmitted) score += 20;
    if (flags.medicalReviewDone) score += 10;
    if (flags.legalReviewDone) score += 10;
    
    return Math.min(score, 100);
  }

  static calculateDesignScore(flags) {
    if (!flags.reviewComplete) return 10; // Base score even without review complete
    
    let score = 60; // Lower base from review
    
    if (flags.designHandoffCreated) score += 25;
    if (flags.visualAssetsReady) score += 10;
    if (flags.brandComplianceApproved) score += 5;
    
    return Math.min(score, 100);
  }

  static getDefaultMetrics() {
    return {
      overall: 0,
      creation: 0,
      review: 0,
      design: 0,
      hasHeadline: false,
      hasBodyContent: false,
      hasCallToAction: false,
      hasKeyMessages: false,
      hasTargetAudience: false,
      aiAnalysisComplete: false,
      hasVariations: false,
      reviewSubmitted: false,
      medicalReviewDone: false,
      legalReviewDone: false,
      designHandoffCreated: false,
      visualAssetsReady: false,
      brandComplianceApproved: false
    };
  }
}