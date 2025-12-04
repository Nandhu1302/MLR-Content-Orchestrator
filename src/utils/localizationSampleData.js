
import { supabase } from "@/integrations/supabase/client";

// Sample agencies data
const sampleAgencies = [
  {
    agency_name: "GlobalLingua Solutions",
    agency_type: "global",
    tier_level: "premium",
    specializations: ["pharmaceutical", "medical_device", "regulatory"],
    language_pairs: [
      { source: "en", target: "ja", capability: "expert" },
      { source: "en", target: "zh", capability: "expert" }
    ],
    regulatory_expertise: ["PMDA", "NMPA"],
    performance_score: 94,
    quality_rating: 4.8,
    on_time_delivery_rate: 97,
    cost_efficiency_rating: 4.2,
    capacity_rating: 85,
    cultural_expertise: {
      "asia": ["cultural_sensitivity", "local_compliance", "regulatory_nuances"]
    },
    contact_information: {
      email: "partnerships@globallingua.com",
      phone: "+1-555-0123",
      primary_contact: "Sarah Chen, Head of Pharma Services"
    },
    contract_terms: {
      minimum_project_size: 5000,
      standard_rate: 0.25,
      rush_multiplier: 1.5,
      preferred_payment_terms: "Net 30"
    },
    is_active: true
  },
  {
    agency_name: "Sino-Japanese Medical Translations",
    agency_type: "regional",
    tier_level: "premium",
    specializations: ["pharmaceutical", "clinical_trials", "patient_materials"],
    language_pairs: [
      { source: "en", target: "zh", capability: "expert" },
      { source: "en", target: "ja", capability: "expert" }
    ],
    regulatory_expertise: ["NMPA", "PMDA"],
    performance_score: 89,
    quality_rating: 4.6,
    on_time_delivery_rate: 94,
    cost_efficiency_rating: 4.3,
    capacity_rating: 70,
    cultural_expertise: {
      "asia": ["regulatory_compliance", "cultural_adaptation", "patient_communication", "hierarchical_respect"]
    },
    contact_information: {
      email: "projects@sino-japanese-med.com",
      phone: "+86-10-555-0456",
      primary_contact: "Dr. Li Wei, Project Manager"
    },
    contract_terms: {
      minimum_project_size: 3000,
      standard_rate: 0.26,
      rush_multiplier: 1.4,
      preferred_payment_terms: "Net 20"
    },
    is_active: true
  },
  {
    agency_name: "Asia Pacific Language Services",
    agency_type: "regional",
    tier_level: "premium",
    specializations: ["pharmaceutical", "regulatory", "marketing"],
    language_pairs: [
      { source: "en", target: "ja", capability: "expert" },
      { source: "en", target: "zh", capability: "expert" }
    ],
    regulatory_expertise: ["PMDA", "NMPA"],
    performance_score: 91,
    quality_rating: 4.7,
    on_time_delivery_rate: 95,
    cost_efficiency_rating: 4.0,
    capacity_rating: 75,
    cultural_expertise: {
      "asia": ["cultural_adaptation", "regulatory_nuances", "patient_education", "hierarchical_communication"]
    },
    contact_information: {
      email: "global@apls.com",
      phone: "+81-3-555-0789",
      primary_contact: "Yuki Tanaka, Regional Director"
    },
    contract_terms: {
      minimum_project_size: 3000,
      standard_rate: 0.28,
      rush_multiplier: 1.4,
      preferred_payment_terms: "Net 21"
    },
    is_active: true
  },
  {
    agency_name: "Greater China Medical Translations",
    agency_type: "local",
    tier_level: "standard",
    specializations: ["pharmaceutical", "patient_materials", "regulatory"],
    language_pairs: [
      { source: "en", target: "zh", capability: "expert" }
    ],
    regulatory_expertise: ["NMPA", "TFDA"],
    performance_score: 86,
    quality_rating: 4.4,
    on_time_delivery_rate: 91,
    cost_efficiency_rating: 4.7,
    capacity_rating: 55,
    cultural_expertise: {
      "china": ["patient_communication", "regulatory_compliance", "cultural_sensitivity", "traditional_medicine_context"]
    },
    contact_information: {
      email: "info@gcmedtrans.com",
      phone: "+86-21-555-0234",
      primary_contact: "Zhang Ming, Operations Manager"
    },
    contract_terms: {
      minimum_project_size: 2000,
      standard_rate: 0.20,
      rush_multiplier: 1.3,
      preferred_payment_terms: "Net 30"
    },
    is_active: true
  }
];

// Sample translation memory entries
const sampleTranslationMemory = [
  {
    source_text: "Adverse events should be reported immediately to your healthcare provider.",
    target_text: "不良事件应立即报告给您的医疗保健提供者。",
    source_language: "en",
    target_language: "zh",
    match_type: "exact",
    domain_context: "patient_safety",
    quality_score: 98,
    confidence_level: 95,
    cultural_adaptations: {
      "formality": "formal_medical_context",
      "tone": "professional_authoritative"
    },
    usage_count: 15,
    last_used: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    source_text: "Take with food to reduce stomach upset.",
    target_text: "与食物一起服用以减少胃部不适。",
    source_language: "en",
    target_language: "zh",
    match_type: "fuzzy",
    domain_context: "patient_instructions",
    quality_score: 92,
    confidence_level: 88,
    cultural_adaptations: {
      "dietary_context": "chinese_meal_patterns",
      "medical_terminology": "patient_friendly"
    },
    usage_count: 23,
    last_used: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    source_text: "Consult your physician before discontinuing treatment.",
    target_text: "治療を中止する前に医師にご相談ください。",
    source_language: "en",
    target_language: "ja",
    match_type: "exact",
    domain_context: "treatment_guidance",
    quality_score: 96,
    confidence_level: 94,
    cultural_adaptations: {
      "respect_level": "highly_formal",
      "patient_physician_relationship": "hierarchical_respect"
    },
    usage_count: 8,
    last_used: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    source_text: "Store in a cool, dry place away from direct sunlight.",
    target_text: "存放在阴凉干燥处，避免阳光直射。",
    source_language: "en",
    target_language: "zh",
    match_type: "exact",
    domain_context: "storage_instructions",
    quality_score: 94,
    confidence_level: 92,
    cultural_adaptations: {
      "climate_considerations": "humid_climate_awareness"
    },
    usage_count: 31,
    last_used: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    source_text: "Clinical studies have demonstrated efficacy in reducing symptoms.",
    target_text: "臨床研究により症状軽減における有効性が実証されています。",
    source_language: "en",
    target_language: "ja",
    match_type: "contextual",
    domain_context: "clinical_evidence",
    quality_score: 97,
    confidence_level: 96,
    cultural_adaptations: {
      "evidence_presentation": "scientific_authority",
      "regulatory_context": "pmda_compliance"
    },
    usage_count: 12,
    last_used: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export class LocalizationSampleDataService {
  static async initializeSampleData(brandId, userId) {
    try {
      // Check if agencies already exist for this brand
      const { data: existingAgencies } = await supabase
        .from('localization_agencies')
        .select('id')
        .eq('brand_id', brandId)
        .limit(1);

      if (!existingAgencies || existingAgencies.length === 0) {
        // Insert sample agencies
        const agenciesToInsert = sampleAgencies.map(agency => ({
          ...agency,
          brand_id: brandId,
          created_by: userId,
          updated_by: userId,
          specializations: JSON.stringify(agency.specializations),
          language_pairs: JSON.stringify(agency.language_pairs),
          regulatory_expertise: JSON.stringify(agency.regulatory_expertise),
          cultural_expertise: JSON.stringify(agency.cultural_expertise),
          contact_information: JSON.stringify(agency.contact_information),
          contract_terms: JSON.stringify(agency.contract_terms)
        }));

        const { error: agencyError } = await supabase
          .from('localization_agencies')
          .insert(agenciesToInsert);

        if (agencyError) throw agencyError;
      }

      // Check if translation memory exists for this brand
      const { data: existingTM } = await supabase
        .from('translation_memory')
        .select('id')
        .eq('brand_id', brandId)
        .limit(1);

      if (!existingTM || existingTM.length === 0) {
        // Insert sample translation memory
        const tmToInsert = sampleTranslationMemory.map(tm => ({
          ...tm,
          brand_id: brandId,
          created_by: userId,
          updated_by: userId,
          cultural_adaptations: JSON.stringify(tm.cultural_adaptations)
        }));

        const { error: tmError } = await supabase
          .from('translation_memory')
          .insert(tmToInsert);

        if (tmError) throw tmError;
      }

      console.log('Sample localization data initialized successfully');
    } catch (error) {
      console.error('Error initializing sample localization data:', error);
      throw error;
    }
  }

  static async createSampleProject(brandId, userId, sourceProjectId) {
    try {
      // Create a sample localization project
      const projectData = {
        project_name: `Global Launch Localization - ${new Date().getFullYear()}`,
        description: "Multi-market localization for new therapeutic indication launch",
        brand_id: brandId,
        source_content_type: sourceProjectId ? "content_studio" : "uploaded",
        source_content_id: sourceProjectId,
        target_languages: JSON.stringify([
          { code: "zh", name: "Chinese", market: "China" },
          { code: "ja", name: "Japanese", market: "Japan" }
        ]),
        target_markets: JSON.stringify([
          {
            market_name: "China",
            regulatory_requirements: ["NMPA approval", "CDE submission", "Local clinical data"],
            cultural_considerations: ["Traditional medicine integration", "Multi-tier healthcare system", "Patient education materials"],
            priority_level: "high",
            timeline_requirements: "Q2 2025 launch"
          },
          {
            market_name: "Japan",
            regulatory_requirements: ["PMDA approval", "J-GCP compliance"],
            cultural_considerations: ["Hierarchical communication", "Formal patient materials"],
            priority_level: "high",
            timeline_requirements: "Q3 2025 launch"
          }
        ]),
        status: "active",
        priority_level: "high",
        cultural_sensitivity_level: "high",
        regulatory_complexity: "high",
        estimated_timeline: 90,
        total_budget: 45000,
        content_readiness_score: 85,
        business_impact_score: 92,
        created_by: userId,
        updated_by: userId,
        metadata: JSON.stringify({
          therapeutic_area: "oncology",
          indication: "advanced_breast_cancer",
          launch_tier: "tier_1_markets"
        })
      };

      const { data: project, error } = await supabase
        .from('localization_projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;

      // Create sample workflows for this project
      const workflows = [
        {
          workflow_name: "Chinese Translation & Review",
          localization_project_id: project.id,
          language: "zh",
          market: "China",
          workflow_type: "translation_review",
          workflow_status: "in_progress",
          priority: 8,
          estimated_hours: 140,
          estimated_cost: 14000,
          translation_memory_leverage: 30,
          created_by: userId,
          updated_by: userId,
          started_at: new Date().toISOString()
        },
        {
          workflow_name: "Japanese Cultural Adaptation",
          localization_project_id: project.id,
          language: "ja",
          market: "Japan",
          workflow_type: "cultural_adaptation",
          workflow_status: "pending",
          priority: 9,
          estimated_hours: 180,
          estimated_cost: 22000,
          translation_memory_leverage: 15,
          created_by: userId,
          updated_by: userId
        }
      ];

      const { error: workflowError } = await supabase
        .from('localization_workflows')
        .insert(workflows);

      if (workflowError) throw workflowError;

      return project.id;
    } catch (error) {
      console.error('Error creating sample localization project:', error);
      throw error;
    }
  }
}