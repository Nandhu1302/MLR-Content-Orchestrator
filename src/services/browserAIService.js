import { env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = true;

/*
 Interfaces removed (TypeScript -> JS). Kept as documentation:

 SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  scores: { positive:number, negative:number, neutral:number }
 }

 ToneAnalysis {
  tone: string;
  confidence: number;
  characteristics: string[];
  brand_alignment: number;
 }

 MedicalTerminologyCheck {
  medical_terms: string[];
  clinical_language_score: number;
  regulatory_flags: string[];
  suggested_alternatives: { [key: string]: string };
 }

 BrandVoiceCheck {
  voice_consistency: number;
  detected_attributes: string[];
  missing_attributes: string[];
  recommendations: string[];
 }

 ContentSemantics {
  key_concepts: string[];
  semantic_similarity: number;
  content_categories: string[];
  readability_score: number;
 }

 AIAnalysisResult {
  sentiment: SentimentAnalysis;
  tone: ToneAnalysis;
  medical_terminology: MedicalTerminologyCheck;
  brand_voice: BrandVoiceCheck;
  semantics: ContentSemantics;
  overall_ai_score: number;
  processing_time: number;
 }
*/

export class BrowserAIService {
  static sentimentPipeline = null;
  static classificationPipeline = null;
  static initialized = false;

  /**
  * Initialize AI models (lazy loading)
  */
  static async initialize() {
   if (this.initialized) return;

   try {
    console.log('Initializing browser AI models...');
    
    // Mock initialization for stable fallback
    this.sentimentPipeline = {
      analyze: (text) => ({ label: 'POSITIVE', score: 0.85 })
    };
    
    this.classificationPipeline = {
      classify: (text) => ({ label: 'medical', score: 0.75 })
    };

    this.initialized = true;
    console.log('Browser AI models initialized with fallback service');
    
    // Attempt to load real HuggingFace models asynchronously
    this.initializeHuggingFaceModels().catch(error => {
      console.warn('HuggingFace models failed to load, using fallback:', error);
    });
    
   } catch (error) {
    console.warn('AI initialization failed, using fallback service:', error);
    this.initialized = true;
   }
  }

  /**
  * Attempt to initialize real HuggingFace models (optional)
  */
  static async initializeHuggingFaceModels() {
   try {
    const { pipeline } = await import('@huggingface/transformers');
    
    // Try to load with WebGPU first
    this.sentimentPipeline = await pipeline(
      'sentiment-analysis',
      'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      { device: 'webgpu' }
    );

    this.classificationPipeline = await pipeline(
      'text-classification',
      'Xenova/distilbert-base-uncased',
      { device: 'webgpu' }
    );
    
    console.log('Real HuggingFace models loaded successfully');
   } catch (error) {
    // If WebGPU fails, try CPU
    try {
      const { pipeline } = await import('@huggingface/transformers');
      
      this.sentimentPipeline = await pipeline(
       'sentiment-analysis',
       'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );

      this.classificationPipeline = await pipeline(
       'text-classification',
       'Xenova/distilbert-base-uncased'
      );
      
      console.log('HuggingFace models loaded with CPU fallback');
    } catch (cpuError) {
      console.warn('Failed to load HuggingFace models, keeping fallback service');
    }
   }
  }

  /**
  * Perform comprehensive AI analysis on content
  */
  static async analyzeContent(
   content,
   brandContext
  ) {
   const startTime = Date.now();
   
   await this.initialize();

   try {
    // Run all analysis in parallel
    const [
      sentiment,
      tone,
      medicalTerminology,
      brandVoice,
      semantics
    ] = await Promise.all([
      this.analyzeSentiment(content),
      this.analyzeTone(content, brandContext?.target_tone),
      this.checkMedicalTerminology(content, brandContext?.medical_context),
      this.checkBrandVoice(content, brandContext?.brand_voice),
      this.analyzeSemantics(content)
    ]);

    // Calculate overall AI score
    const overallScore = this.calculateOverallAIScore({
      sentiment,
      tone,
      medical_terminology: medicalTerminology,
      brand_voice: brandVoice,
      semantics
    });

    return {
      sentiment,
      tone,
      medical_terminology: medicalTerminology,
      brand_voice: brandVoice,
      semantics,
      overall_ai_score: overallScore,
      processing_time: Date.now() - startTime
    };
   } catch (error) {
    console.error('AI analysis failed:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
   }
  }

  /**
  * Analyze sentiment using AI service with robust fallback
  */
  static async analyzeSentiment(content) {
   try {
    await this.initialize();
    
    // Try real analysis first
    if (typeof this.sentimentPipeline === 'function') {
      const result = await this.sentimentPipeline(content);
      
      const sentiment = result[0].label.toLowerCase() === 'positive' ? 'positive' : 
                 result[0].label.toLowerCase() === 'negative' ? 'negative' : 'neutral';
      
      return {
       sentiment,
       confidence: result[0].score,
       scores: {
        positive: sentiment === 'positive' ? result[0].score : 1 - result[0].score,
        negative: sentiment === 'negative' ? result[0].score : 1 - result[0].score,
        neutral: sentiment === 'neutral' ? result[0].score : 0.5
       }
      };
    }
    
    // Fallback to rule-based analysis
    return this.analyzeSentimentFallback(content);
    
   } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return this.analyzeSentimentFallback(content);
   }
  }

  /**
  * Fallback sentiment analysis using keyword-based approach
  */
  static analyzeSentimentFallback(content) {
   const positiveWords = [
    'effective', 'beneficial', 'improved', 'successful', 'positive', 'excellent',
    'significant', 'favorable', 'optimal', 'superior', 'advancement', 'progress'
   ];
   
   const negativeWords = [
    'adverse', 'risk', 'concern', 'limitation', 'failure', 'negative',
    'contraindication', 'warning', 'caution', 'problem', 'issue'
   ];
   
   const words = content.toLowerCase().split(/\s+/);
   const positiveScore = positiveWords.filter(word => 
    words.some(w => w.includes(word))
   ).length;
   const negativeScore = negativeWords.filter(word => 
    words.some(w => w.includes(word))
   ).length;
   
   let sentiment = 'neutral';
   let confidence = 0.7;
   
   if (positiveScore > negativeScore) {
    sentiment = 'positive';
    confidence = Math.min(0.9, 0.6 + (positiveScore * 0.1));
   } else if (negativeScore > positiveScore) {
    sentiment = 'negative';  
    confidence = Math.min(0.9, 0.6 + (negativeScore * 0.1));
   }
   
   return {
    sentiment,
    confidence,
    scores: {
      positive: sentiment === 'positive' ? confidence : 1 - confidence,
      negative: sentiment === 'negative' ? confidence : 1 - confidence,
      neutral: sentiment === 'neutral' ? confidence : 0.5
    }
   };
  }

  /**
  * Analyze tone and style
  */
  static async analyzeTone(content, targetTone) {
   // Rule-based tone analysis with AI enhancement
   const toneIndicators = {
    professional: ['expertise', 'evidence', 'clinical', 'study', 'research', 'proven'],
    friendly: ['you', 'your', 'we', 'together', 'help', 'support'],
    authoritative: ['must', 'should', 'important', 'critical', 'necessary', 'required'],
    empathetic: ['understand', 'feel', 'experience', 'care', 'support', 'compassion'],
    urgent: ['now', 'immediately', 'urgent', 'quickly', 'asap', 'don\'t wait'],
    confident: ['proven', 'effective', 'guaranteed', 'results', 'success', 'works']
   };

   const detectedTones = {};
   const characteristics = [];

   // Analyze tone indicators
   const words = content.toLowerCase().split(/\s+/);
   
   for (const [tone, indicators] of Object.entries(toneIndicators)) {
    const matches = indicators.filter(indicator => 
      words.some(word => word.includes(indicator))
    ).length;
    
    if (matches > 0) {
      detectedTones[tone] = matches / indicators.length;
      characteristics.push(tone);
    }
   }

   // Determine primary tone with safety check
   const toneKeys = Object.keys(detectedTones);
   const primaryTone = toneKeys.length > 0 
    ? toneKeys.reduce((a, b) => detectedTones[a] > detectedTones[b] ? a : b)
    : 'neutral';

   // Calculate brand alignment if target tone is provided
   let brandAlignment = 80; // Default
   if (targetTone && detectedTones[targetTone.toLowerCase()]) {
    brandAlignment = Math.round(detectedTones[targetTone.toLowerCase()] * 100);
   }

   return {
    tone: primaryTone,
    confidence: detectedTones[primaryTone] || 0.5,
    characteristics,
    brand_alignment: brandAlignment
   };
  }

  /**
  * Check for medical terminology and regulatory compliance
  */
  static async checkMedicalTerminology(content, medicalContext = false) {
   // Medical terminology dictionary
   const medicalTerms = [
    'efficacy', 'adverse', 'contraindication', 'indication', 'dosage', 'clinical',
    'therapeutic', 'pharmacology', 'bioavailability', 'metabolism', 'clearance',
    'half-life', 'receptor', 'mechanism', 'pathway', 'biomarker', 'endpoint',
    'placebo', 'double-blind', 'randomized', 'controlled', 'trial', 'study'
   ];

   const regulatoryFlags = [
    'cure', 'treat', 'prevent', 'diagnose', 'guarantee', 'promise',
    'miracle', 'breakthrough', 'revolutionary', 'amazing results'
   ];

   const suggestedAlternatives = {
    'cure': 'may help manage',
    'treat': 'indicated for',
    'prevent': 'may reduce risk of',
    'guarantee': 'clinical studies suggest',
    'amazing results': 'clinically proven benefits'
   };

   const words = content.toLowerCase().split(/\s+/);
   
   const foundMedicalTerms = medicalTerms.filter(term => 
    words.some(word => word.includes(term))
   );

   const foundFlags = regulatoryFlags.filter(flag => 
    words.some(word => word.includes(flag))
   );

   const clinicalScore = medicalContext ? 
    Math.min(100, (foundMedicalTerms.length / medicalTerms.length) * 100) :
    Math.max(0, 100 - (foundMedicalTerms.length * 10));

   return {
    medical_terms: foundMedicalTerms,
    clinical_language_score: Math.round(clinicalScore),
    regulatory_flags: foundFlags,
    suggested_alternatives: Object.fromEntries(
      foundFlags.map(flag => [flag, suggestedAlternatives[flag] || 'consider alternative phrasing'])
    )
   };
  }

  /**
  * Check brand voice consistency
  */
  static async checkBrandVoice(content, brandVoice) {
   if (!brandVoice || brandVoice.length === 0) {
    return {
      voice_consistency: 80,
      detected_attributes: [],
      missing_attributes: [],
      recommendations: ['Define brand voice attributes for better analysis']
    };
   }

   const voiceAttributes = {
    'professional': ['expertise', 'professional', 'clinical', 'evidence-based'],
    'warm': ['caring', 'compassionate', 'understanding', 'supportive'],
    'innovative': ['advanced', 'cutting-edge', 'breakthrough', 'novel'],
    'trustworthy': ['reliable', 'proven', 'trusted', 'established'],
    'accessible': ['simple', 'clear', 'easy', 'straightforward'],
    'scientific': ['research', 'study', 'clinical', 'data', 'evidence']
   };

   const words = content.toLowerCase().split(/\s+/);
   const detectedAttributes = [];
   const missingAttributes = [];

   for (const attribute of brandVoice) {
    const attributeWords = voiceAttributes[attribute.toLowerCase()] || [];
    const hasAttribute = attributeWords.some(word => 
      words.some(contentWord => contentWord.includes(word))
    );

    if (hasAttribute) {
      detectedAttributes.push(attribute);
    } else {
      missingAttributes.push(attribute);
    }
   }

   const consistency = Math.round((detectedAttributes.length / brandVoice.length) * 100);

   const recommendations = missingAttributes.map(attr => 
    `Consider adding ${attr} language to strengthen brand voice`
   );

   return {
    voice_consistency: consistency,
    detected_attributes: detectedAttributes,
    missing_attributes: missingAttributes,
    recommendations
   };
  }

  /**
  * Analyze content semantics and structure
  */
  static async analyzeSemantics(content) {
   // Extract key concepts using simple NLP techniques
   const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);

   // Common stop words to filter out
   const stopWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'between', 'among', 'this', 'that', 'these',
    'those', 'they', 'them', 'their', 'what', 'which', 'who', 'when',
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'only', 'own', 'same', 'than', 'too',
    'very', 'will', 'just'
   ]);

   const meaningfulWords = words.filter(word => !stopWords.has(word));

   // Calculate word frequency
   const wordFreq = {};
   meaningfulWords.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
   });

   // Get key concepts (top frequent words)
   const keyConcepts = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

   // Categorize content
   const categories = this.categorizeContent(content);

   // Calculate readability score (simplified Flesch formula)
   const sentences = content.split(/[.!?]+/).length - 1;
   const totalWords = words.length;
   const avgWordsPerSentence = sentences > 0 ? totalWords / sentences : 0;
   const readabilityScore = Math.max(0, Math.min(100, 
    206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (meaningfulWords.length / totalWords))
   ));

   return {
    key_concepts: keyConcepts,
    semantic_similarity: 75, // Placeholder - would need embeddings for real similarity
    content_categories: categories,
    readability_score: Math.round(readabilityScore)
   };
  }

  /**
  * Categorize content based on keywords
  */
  static categorizeContent(content) {
   const categories = {
    'medical': ['treatment', 'therapy', 'clinical', 'patient', 'healthcare', 'medical'],
    'marketing': ['brand', 'product', 'campaign', 'audience', 'market', 'customer'],
    'regulatory': ['compliance', 'fda', 'approval', 'regulation', 'guideline', 'policy'],
    'educational': ['learn', 'understand', 'information', 'education', 'knowledge', 'guide'],
    'promotional': ['new', 'launch', 'offer', 'special', 'limited', 'exclusive']
   };

   const detected = [];
   const lowerContent = content.toLowerCase();

   for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      detected.push(category);
    }
   }

   return detected.length > 0 ? detected : ['general'];
  }

  /**
  * Calculate overall AI score
  */
  static calculateOverallAIScore(analysis) {
   const weights = {
    sentiment: 0.2,
    tone: 0.25,
    medical: 0.2,
    brandVoice: 0.25,
    semantics: 0.1
   };

   const scores = {
    sentiment: analysis.sentiment.confidence * 100,
    tone: analysis.tone.brand_alignment,
    medical: analysis.medical_terminology.clinical_language_score,
    brandVoice: analysis.brand_voice.voice_consistency,
    semantics: analysis.semantics.readability_score
   };

   const weightedScore = Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (scores[key] * weight);
   }, 0);

   return Math.round(weightedScore);
  }
}


