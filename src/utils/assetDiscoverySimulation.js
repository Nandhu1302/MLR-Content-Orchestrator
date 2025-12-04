
import { supabase } from '@/integrations/supabase/client';

// Rich simulation data for Asset Discovery
export class AssetDiscoverySimulation {
  static async populateDiscoveryAssets(brandId, userId) {
    try {
      console.log('🚀 Populating comprehensive multi-brand Asset Discovery data...');

      // Generate valid UUID for demo user if needed
      const validUserId = userId === 'demo-user' || !userId ? crypto.randomUUID() : userId;
      console.log(`Using userId: ${validUserId}`);

      // Get all brands from database
      const { data: brands, error: brandsError } = await supabase
        .from('brand_profiles')
        .select('id, brand_name, company, therapeutic_area');

      if (brandsError) {
        console.error('Error fetching brands:', brandsError);
        throw new Error(`Failed to fetch brands: ${brandsError.message}`);
      }

      if (!brands || brands.length === 0) {
        console.warn('No brands found in database');
        return;
      }

      console.log(`🏢 Creating comprehensive asset libraries for ${brands.length} brands...`);

      // Track success/failure per brand
      const brandResults = {};

      // Create comprehensive data for all brands
      for (const brand of brands) {
        console.log(`\n🔄 Processing ${brand.company} - ${brand.brand_name} (${brand.therapeutic_area})...`);
        try {
          // 1. Create approved content projects for this brand
          const projects = await this.createContentProjectsForBrand(brand, validUserId);
          console.log(` ✅ Created ${projects.length} projects for ${brand.brand_name}`);

          // 2. Create approved content assets with rich metadata (ensure we have projects)
          const assetCount = await this.createContentAssetsForBrand(brand, validUserId, projects);
          console.log(` ✅ Created ${assetCount} assets for ${brand.brand_name}`);

          // 3. Create localization projects
          const localizationCount = await this.createLocalizationProjectsForBrand(brand, validUserId);
          console.log(` ✅ Created ${localizationCount} localization projects for ${brand.brand_name}`);

          // 4. Add MLR compliance history
          await this.createMLRHistoryForBrand(brand, validUserId);

          // 5. Add performance analytics
          await this.createPerformanceDataForBrand(brand, validUserId);

          brandResults[brand.brand_name] = {
            success: true,
            projects: projects.length,
            assets: assetCount,
            localization: localizationCount
          };
        } catch (brandError) {
          console.error(`❌ Error processing ${brand.brand_name}:`, brandError);
          brandResults[brand.brand_name] = {
            success: false,
            error: brandError.message,
            assets: 0
          };

          // Create minimal fallback data to ensure brand has some assets
          await this.createFallbackAssets(brand, validUserId);
        }
      }

      // Log final results
      console.log('\n📊 Final Results:');
      Object.entries(brandResults).forEach(([brandName, result]) => {
        if (result.success) {
          console.log(` ✅ ${brandName}: ${result.assets} assets, ${result.projects} projects, ${result.localization} localization projects`);
        } else {
          console.log(` ❌ ${brandName}: FAILED - ${result.error}`);
        }
      });

      const totalSuccess = Object.values(brandResults).filter(r => r.success).length;
      console.log(`\n🎉 Successfully populated ${totalSuccess}/${brands.length} brands with comprehensive Asset Discovery data`);
    } catch (error) {
      console.error('💥 Critical error populating Asset Discovery data:', error);
      throw error;
    }
  }

  static async createContentProjectsForBrand(brand, userId) {
    try {
      const projectTemplates = this.getProjectTemplatesByTherapeuticArea(brand.therapeutic_area, brand);

      // Validate all required fields before insertion
      const projects = projectTemplates.map(template => {
        // Ensure all UUIDs are properly formatted
        if (!brand.id || typeof brand.id !== 'string') {
          throw new Error(`Invalid brand ID for ${brand.brand_name}: ${brand.id}`);
        }
        if (!userId || typeof userId !== 'string') {
          throw new Error(`Invalid user ID: ${userId}`);
        }
        return {
          ...template,
          brand_id: brand.id,
          created_by: userId,
          updated_by: userId,
          id: crypto.randomUUID() // Ensure unique ID
        };
      });

      const { data, error } = await supabase
        .from('content_projects')
        .insert(projects)
        .select();

      if (error) {
        console.error(`❌ Error creating projects for ${brand.brand_name}:`, error);
        console.error('Project data that failed:', projects);
        throw new Error(`Failed to create projects: ${error.message}`);
      }

      console.log(` 📁 Created ${data?.length || 0} projects for ${brand.brand_name}`);
      return data || [];
    } catch (error) {
      console.error(`❌ Critical error in createContentProjectsForBrand for ${brand.brand_name}:`, error);
      throw error;
    }
  }

  static getProjectTemplatesByTherapeuticArea(therapeuticArea, brand) {
    const baseProjects = {
      "Oncology": [
        {
          project_name: `${brand.brand_name} Global HCP Education Campaign 2024`,
          description: "Multi-market educational campaign for oncology treatment",
          therapeutic_area: "Oncology",
          market: ["US", "EU", "Japan", "China"],
          channels: ["Email", "Digital Sales Aid", "Website"],
          status: "completed",
          project_type: "campaign",
          compliance_level: "high",
          indication: brand.brand_name.toLowerCase().includes('tagrisso') ? 'nsclc' : 'advanced_cancer',
          target_audience: { primary: "HCP", segments: ["Oncologists", "Nurses"] },
          project_metadata: {
            launch_date: "2024-01-15",
            performance_score: Math.floor(Math.random() * 15) + 85,
            markets_launched: Math.floor(Math.random() * 5) + 6,
            total_reach: Math.floor(Math.random() * 30000) + 35000
          }
        },
        {
          project_name: `${brand.brand_name} Patient Journey Materials`,
          description: "Patient-focused educational materials and support resources",
          therapeutic_area: "Oncology",
          market: ["US", "EU", "Canada"],
          channels: ["Patient Brochure", "Website", "Video"],
          status: "approved",
          project_type: "patient_education",
          compliance_level: "standard",
          indication: brand.brand_name.toLowerCase().includes('tagrisso') ? 'nsclc' : 'cancer_patient_support',
          target_audience: { primary: "Patient", segments: ["Cancer Patients", "Caregivers"] },
          project_metadata: {
            launch_date: "2024-02-01",
            performance_score: Math.floor(Math.random() * 12) + 83,
            patient_satisfaction: Math.floor(Math.random() * 15) + 85
          }
        }
      ],
      "Cardiovascular": [
        {
          project_name: `${brand.brand_name} CV Risk Management Initiative`,
          description: "HCP tools and patient materials for cardiovascular risk management",
          therapeutic_area: "Cardiovascular",
          market: ["US", "EU", "Canada", "Australia"],
          channels: ["Digital Tool", "Print Material", "Email"],
          status: "approved",
          project_type: "clinical_tools",
          compliance_level: "standard",
          indication:
            brand.brand_name.toLowerCase().includes('xarelto') ? 'stroke_prevention' :
            brand.brand_name.toLowerCase().includes('jardiance') ? 'diabetes_cv_outcomes' :
            brand.brand_name.toLowerCase().includes('pradaxa') ? 'afib_stroke_prevention' : 'heart_failure',
          target_audience: { primary: "HCP", segments: ["Cardiologists", "Primary Care"] },
          project_metadata: {
            launch_date: "2024-03-15",
            performance_score: Math.floor(Math.random() * 15) + 85,
            clinical_adoption_rate: Math.floor(Math.random() * 20) + 70
          }
        },
        {
          project_name: `${brand.brand_name} Patient Education Campaign`,
          description: "Patient education materials for cardiovascular disease management",
          therapeutic_area: "Cardiovascular",
          market: ["US", "Germany", "UK", "France"],
          channels: ["Landing Page", "Patient Brochure", "Video"],
          status: "completed",
          project_type: "patient_education",
          compliance_level: "standard",
          indication:
            brand.brand_name.toLowerCase().includes('xarelto') ? 'stroke_prevention' :
            brand.brand_name.toLowerCase().includes('jardiance') ? 'diabetes_management' :
            brand.brand_name.toLowerCase().includes('pradaxa') ? 'afib_management' : 'heart_failure_management',
          target_audience: { primary: "Patient", segments: ["CV Patients", "Caregivers"] },
          project_metadata: {
            launch_date: "2024-04-01",
            performance_score: Math.floor(Math.random() * 12) + 88,
            patient_engagement: Math.floor(Math.random() * 15) + 82
          }
        }
      ],
      "Respiratory": [
        {
          project_name: `${brand.brand_name} IPF Patient Journey Initiative`,
          description: "Comprehensive IPF patient education and disease awareness materials",
          therapeutic_area: "Respiratory",
          market: ["US", "Germany", "UK", "France"],
          channels: ["Landing Page", "Patient Brochure", "Video"],
          status: "approved",
          project_type: "disease_awareness",
          compliance_level: "standard",
          indication: "IPF",
          target_audience: { primary: "Patient", segments: ["IPF Patients", "Caregivers"] },
          project_metadata: {
            launch_date: "2024-03-01",
            performance_score: Math.floor(Math.random() * 15) + 82,
            patient_engagement_score: Math.floor(Math.random() * 12) + 88
          }
        },
        {
          project_name: `${brand.brand_name} HCP Clinical Evidence Package`,
          description: "Clinical data presentation and treatment guidance for pulmonary specialists",
          therapeutic_area: "Respiratory",
          market: ["US", "EU", "Japan"],
          channels: ["Digital Sales Aid", "Presentation", "Clinical Data Package"],
          status: "completed",
          project_type: "clinical_education",
          compliance_level: "high",
          indication: "IPF",
          target_audience: { primary: "HCP", segments: ["Pulmonologists", "Respiratory Specialists"] },
          project_metadata: {
            launch_date: "2024-02-15",
            performance_score: Math.floor(Math.random() * 15) + 87,
            clinical_adoption: Math.floor(Math.random() * 20) + 75
          }
        }
      ]
    };

    return baseProjects[therapeuticArea] || baseProjects["Cardiovascular"];
  }

  static async createContentAssetsForBrand(brand, userId, projects) {
    try {
      // Ensure we have at least one project, create a default if needed
      if (!projects || projects.length === 0) {
        console.warn(`⚠️ No projects found for ${brand.brand_name}, creating default project...`);
        projects = await this.createDefaultProject(brand, userId);
      }

      const assetTemplates = this.getAssetTemplatesByBrand(brand, projects, userId);
      if (assetTemplates.length === 0) {
        console.warn(`⚠️ No asset templates generated for ${brand.brand_name}`);
        return 0;
      }

      const { data, error } = await supabase
        .from('content_assets')
        .insert(assetTemplates)
        .select('id');

      if (error) {
        console.error(`❌ Error creating assets for ${brand.brand_name}:`, error);
        console.error('Asset data that failed:', assetTemplates.slice(0, 2)); // Log first 2 for debugging
        throw new Error(`Failed to create assets: ${error.message}`);
      }

      const createdCount = data?.length || 0;
      console.log(` 📄 Created ${createdCount} assets for ${brand.brand_name}`);
      return createdCount;
    } catch (error) {
      console.error(`❌ Critical error in createContentAssetsForBrand for ${brand.brand_name}:`, error);
      throw error;
    }
  }

  static getAssetTemplatesByBrand(brand, projects, userId) {
    try {
      const assetTypes = ["mass-email", "digital-sales-aid", "patient-brochure", "digital-tool", "landing-page", "presentation", "video-script"];
      const audiences = ["HCP", "Patient"];
      const categories = ["education", "sales_support", "clinical_tool", "patient_support", "disease_awareness"];
      const assets = [];

      // Validate inputs
      if (!brand?.id || !userId || !projects || projects.length === 0) {
        throw new Error(`Invalid inputs for asset creation: brand.id=${brand?.id}, userId=${userId}, projects.length=${projects?.length}`);
      }

      // Create 15-20 assets per brand
      const assetCount = Math.floor(Math.random() * 6) + 15; // 15-20 assets
      console.log(` 🎯 Generating ${assetCount} assets for ${brand.brand_name}...`);

      for (let i = 0; i < assetCount; i++) {
        const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
        const audience = audiences[Math.floor(Math.random() * audiences.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const project = projects[Math.floor(Math.random() * projects.length)];

        // Validate project has valid ID
        if (!project?.id) {
          throw new Error(`Invalid project ID for asset creation: project=${JSON.stringify(project)}`);
        }

        const assetName = this.generateAssetName(brand, assetType, audience, i);
        const content = this.generateContentByType(brand, assetType, audience);

        assets.push({
          id: crypto.randomUUID(), // Ensure unique ID
          asset_name: assetName,
          asset_type: assetType,
          status: "approved", // Force approved status for discovery
          brand_id: brand.id,
          project_id: project.id,
          theme_id: null,
          target_audience: audience,
          content_category: category,
          primary_content: content,
          metadata: {
            therapeutic_area: brand.therapeutic_area,
            indication: this.getIndicationForBrand(brand),
            markets_approved: this.getMarketsForBrand(brand),
            reusability_score: Math.floor(Math.random() * 25) + 75, // 75-99
            brand_consistency_score: Math.floor(Math.random() * 20) + 80, // 80-99
            performance_prediction: {
              engagement_rate: (Math.random() * 0.3 + 0.2).toFixed(2), // 0.2-0.5
              click_through_rate: (Math.random() * 0.15 + 0.05).toFixed(2), // 0.05-0.2
              conversion_rate: (Math.random() * 0.1 + 0.03).toFixed(2) // 0.03-0.13
            },
            source_module: "content_studio",
            mlr_status: {
              "US": "approved",
              "EU": "approved",
              "Japan": Math.random() > 0.3 ? "approved" : "pending"
            }
          },
          channel_specifications: this.getChannelSpecs(assetType),
          ai_analysis: {
            tone_score: Math.floor(Math.random() * 20) + 80,
            compliance_score: Math.floor(Math.random() * 15) + 85,
            engagement_prediction: Math.floor(Math.random() * 20) + 75,
            market_suitability: {
              "US": Math.floor(Math.random() * 20) + 80,
              "EU": Math.floor(Math.random() * 25) + 75,
              "Japan": Math.floor(Math.random() * 30) + 70,
              "China": Math.floor(Math.random() * 35) + 65
            }
          },
          created_by: userId,
          updated_by: userId,
          completed_at: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString() // Random date in last 90 days
        });
      }

      return assets;
    } catch (error) {
      console.error(`❌ Error generating asset templates for ${brand.brand_name}:`, error);
      throw error;
    }
  }

  static generateAssetName(brand, assetType, audience, index) {
    const typeNames = {
      "mass-email": "Email Campaign",
      "digital-sales-aid": "Digital Sales Aid",
      "patient-brochure": "Patient Brochure",
      "digital-tool": "Interactive Tool",
      "landing-page": "Landing Page",
      "presentation": "Clinical Presentation",
      "video-script": "Video Content"
    };

    const contexts = [
      "Clinical Evidence", "Treatment Guidelines", "Patient Journey", "Disease Education",
      "Safety Profile", "Efficacy Data", "Real World Evidence", "Treatment Algorithm",
      "Patient Support", "HCP Training", "Market Access", "Outcomes Research"
    ];

    const typeName = typeNames[assetType] || "Asset";
    const context = contexts[Math.floor(Math.random() * contexts.length)];
    return `${brand.brand_name} ${context} - ${typeName} ${audience === "HCP" ? "for Healthcare Professionals" : "for Patients"}`;
  }

  static generateContentByType(brand, assetType, audience) {
    const baseContent = {
      title: `${brand.brand_name} ${audience === "HCP" ? "Clinical" : "Patient"} Information`,
      description: `Comprehensive ${audience === "HCP" ? "clinical data and treatment guidance" : "patient education and support resources"} for ${brand.brand_name}`,
    };

    switch (assetType) {
      case "mass-email":
        return {
          ...baseContent,
          subject: `Latest ${brand.brand_name} Clinical Updates - ${brand.therapeutic_area}`,
          headline: `Breakthrough Advances in ${brand.therapeutic_area} Treatment`,
          body_copy: `New clinical evidence demonstrates significant benefits with ${brand.brand_name} in ${audience === "HCP" ? "your practice" : "patient care"}.`,
          call_to_action: audience === "HCP" ? "Access Clinical Data" : "Learn More About Treatment",
          fair_balance: "Important Safety Information: Please see full prescribing information..."
        };
      case "digital-sales-aid":
        return {
          ...baseContent,
          sections: [
            { name: "Clinical Evidence", content: `${brand.brand_name} efficacy and safety data` },
            { name: "Treatment Algorithm", content: "Evidence-based treatment pathways" },
            { name: "Real World Evidence", content: "Real-world outcomes and patient experiences" }
          ],
          key_messages: ["Proven efficacy", "Established safety profile", "Improved patient outcomes"]
        };
      case "patient-brochure":
        return {
          ...baseContent,
          sections: [
            { name: "About Your Treatment", content: `Understanding ${brand.brand_name} therapy` },
            { name: "What to Expect", content: "Treatment journey and expectations" },
            { name: "Living Well", content: "Tips for managing your condition" }
          ],
          resources: ["Patient support services", "Educational materials", "Community resources"]
        };
      default:
        return baseContent;
    }
  }

  static getIndicationForBrand(brand) {
    const indications = {
      "Tagrisso": "nsclc_egfr_mutation",
      "Xarelto": "stroke_prevention_afib",
      "Jardiance": "type2_diabetes_cv_outcomes",
      "Pradaxa": "afib_stroke_prevention",
      "Ofev": "ipf_progressive_fibrosing",
      "Erbitux": "colorectal_cancer_egfr",
      "Entresto": "heart_failure_reduced_ejection"
    };

    return indications[brand.brand_name] || `${brand.therapeutic_area.toLowerCase()}_treatment`;
  }

  static getMarketsForBrand(brand) {
    const globalMarkets = ["US", "EU", "Japan", "Canada", "Australia"];
    const emergingMarkets = ["China", "Brazil", "Mexico", "South Korea"];
    // Major brands typically launch in global markets first
    const marketCount = Math.floor(Math.random() * 4) + 4; // 4-7 markets
    const allMarkets = [...globalMarkets, ...emergingMarkets];
    return allMarkets.slice(0, marketCount);
  }

  static getChannelSpecs(assetType) {
    const specs = {
      "mass-email": {
        email: {
          character_limits: { subject: 60, preview: 90 },
          personalization_tokens: ["doctor_name", "specialty", "location"]
        }
      },
      "digital-sales-aid": {
        digital_aid: {
          format: "interactive_pdf",
          device_compatibility: ["tablet", "laptop"],
          offline_capability: true
        }
      },
      "patient-brochure": {
        print: { format: "tri-fold", paper_size: "A4", color_requirements: "full_color" },
        digital: { format: "interactive_pdf", accessibility: "WCAG_2.1_AA" }
      },
      "digital-tool": {
        web_tool: {
          platform: "responsive_web",
          browser_support: ["Chrome", "Safari", "Firefox"],
          mobile_optimized: true
        }
      }
    };

    return specs[assetType] || { format: "standard" };
  }

  static async createLocalizationProjectsForBrand(brand, userId) {
    try {
      const localizationCount = Math.floor(Math.random() * 3) + 2; // 2-4 localization projects per brand
      const projects = [];

      for (let i = 0; i < localizationCount; i++) {
        const targetRegions = this.getRandomLocalizationRegions();
        projects.push({
          id: crypto.randomUUID(), // Ensure unique ID
          project_name: `${brand.brand_name} ${targetRegions.regionName} Localization`,
          description: `Multi-market localization of ${brand.brand_name} materials for ${targetRegions.regionName}`,
          brand_id: brand.id,
          source_content_type: ["content_studio", "pre_mlr", "design_studio"][Math.floor(Math.random() * 3)],
          target_languages: targetRegions.languages,
          target_markets: targetRegions.markets,
          status: ["completed", "active", "approved"][Math.floor(Math.random() * 3)],
          priority_level: ["high", "medium"][Math.floor(Math.random() * 2)],
          cultural_sensitivity_level: ["high", "medium"][Math.floor(Math.random() * 2)],
          regulatory_complexity: ["high", "standard"][Math.floor(Math.random() * 2)],
          estimated_timeline: Math.floor(Math.random() * 60) + 45, // 45-105 days
          actual_timeline: Math.floor(Math.random() * 50) + 40, // 40-90 days
          total_budget: Math.floor(Math.random() * 50000) + 25000, // $25K-75K
          content_readiness_score: Math.floor(Math.random() * 20) + 80, // 80-99
          business_impact_score: Math.floor(Math.random() * 25) + 75, // 75-99
          metadata: {
            therapeutic_area: brand.therapeutic_area,
            indication: this.getIndicationForBrand(brand),
            launch_success_rate: Math.floor(Math.random() * 20) + 80,
            market_penetration: this.generateMarketPenetration(targetRegions.markets),
            regulatory_approval_time: this.generateApprovalTimes(targetRegions.markets)
          },
          created_by: userId,
          updated_by: userId,
          completed_at: Math.random() > 0.5
            ? new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString()
            : null
        });
      }

      const { data, error } = await supabase
        .from('localization_projects')
        .insert(projects)
        .select('id');

      if (error) {
        console.error(`❌ Error creating localization projects for ${brand.brand_name}:`, error);
        throw new Error(`Failed to create localization projects: ${error.message}`);
      }

      const createdCount = data?.length || 0;
      console.log(` 🌍 Created ${createdCount} localization projects for ${brand.brand_name}`);
      return createdCount;
    } catch (error) {
      console.error(`❌ Critical error in createLocalizationProjectsForBrand for ${brand.brand_name}:`, error);
      throw error;
    }
  }

  static async createDefaultProject(brand, userId) {
    const defaultProject = {
      id: crypto.randomUUID(),
      project_name: `${brand.brand_name} Default Project`,
      description: `Default project for ${brand.brand_name} assets`,
      therapeutic_area: brand.therapeutic_area,
      market: ["US"],
      channels: ["Email"],
      status: "approved",
      project_type: "campaign",
      compliance_level: "standard",
      indication: this.getIndicationForBrand(brand),
      target_audience: { primary: "HCP" },
      project_metadata: {},
      brand_id: brand.id,
      created_by: userId,
      updated_by: userId
    };

    const { data, error } = await supabase
      .from('content_projects')
      .insert([defaultProject])
      .select();

    if (error) {
      console.error(`❌ Error creating default project for ${brand.brand_name}:`, error);
      throw new Error(`Failed to create default project: ${error.message}`);
    }

    return data || [defaultProject];
  }

  static async createFallbackAssets(brand, userId) {
    try {
      console.log(`🔧 Creating fallback assets for ${brand.brand_name}...`);

      // Create a default project first
      const defaultProjects = await this.createDefaultProject(brand, userId);

      // Create minimal assets
      const fallbackAssets = [
        {
          id: crypto.randomUUID(),
          asset_name: `${brand.brand_name} Clinical Overview`,
          asset_type: "digital-sales-aid",
          status: "approved",
          brand_id: brand.id,
          project_id: defaultProjects[0].id,
          target_audience: "HCP",
          content_category: "education",
          primary_content: {
            title: `${brand.brand_name} Clinical Information`,
            description: `Clinical overview for ${brand.brand_name}`
          },
          metadata: {
            therapeutic_area: brand.therapeutic_area,
            indication: this.getIndicationForBrand(brand),
            markets_approved: ["US"],
            reusability_score: 85,
            brand_consistency_score: 90,
            source_module: "content_studio"
          },
          created_by: userId,
          updated_by: userId,
          completed_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          asset_name: `${brand.brand_name} Patient Education`,
          asset_type: "patient-brochure",
          status: "approved",
          brand_id: brand.id,
          project_id: defaultProjects[0].id,
          target_audience: "Patient",
          content_category: "patient_support",
          primary_content: {
            title: `${brand.brand_name} Patient Information`,
            description: `Patient education materials for ${brand.brand_name}`
          },
          metadata: {
            therapeutic_area: brand.therapeutic_area,
            indication: this.getIndicationForBrand(brand),
            markets_approved: ["US"],
            reusability_score: 80,
            brand_consistency_score: 88,
            source_module: "content_studio"
          },
          created_by: userId,
          updated_by: userId,
          completed_at: new Date().toISOString()
        }
      ];

      const { data, error } = await supabase
        .from('content_assets')
        .insert(fallbackAssets)
        .select('id');

      if (!error) {
        console.log(` 🆗 Created ${data?.length || 0} fallback assets for ${brand.brand_name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create fallback assets for ${brand.brand_name}:`, error);
    }
  }

  static getRandomLocalizationRegions() {
    const regions = [
      {
        regionName: "Asia Pacific",
        languages: [
          { code: "ja", name: "Japanese", market: "Japan" },
          { code: "zh", name: "Chinese (Simplified)", market: "China" },
          { code: "ko", name: "Korean", market: "South Korea" }
        ],
        markets: [
          {
            market_name: "Japan",
            regulatory_requirements: ["PMDA compliance"],
            cultural_considerations: ["Hierarchical communication"],
            priority_level: "high"
          },
          {
            market_name: "China",
            regulatory_requirements: ["NMPA approval"],
            cultural_considerations: ["Traditional medicine integration"],
            priority_level: "high"
          }
        ]
      },
      {
        regionName: "Europe",
        languages: [
          { code: "de", name: "German", market: "Germany" },
          { code: "fr", name: "French", market: "France" },
          { code: "es", name: "Spanish", market: "Spain" },
          { code: "it", name: "Italian", market: "Italy" }
        ],
        markets: [
          {
            market_name: "Germany",
            regulatory_requirements: ["BfArM compliance"],
            cultural_considerations: ["Direct communication"],
            priority_level: "high"
          },
          {
            market_name: "France",
            regulatory_requirements: ["ANSM compliance"],
            cultural_considerations: ["Formal communication"],
            priority_level: "medium"
          }
        ]
      },
      {
        regionName: "Latin America",
        languages: [
          { code: "es", name: "Spanish", market: "Mexico" },
          { code: "pt", name: "Portuguese", market: "Brazil" }
        ],
        markets: [
          {
            market_name: "Mexico",
            regulatory_requirements: ["COFEPRIS compliance"],
            cultural_considerations: ["Family involvement"],
            priority_level: "medium"
          },
          {
            market_name: "Brazil",
            regulatory_requirements: ["ANVISA compliance"],
            cultural_considerations: ["Healthcare accessibility"],
            priority_level: "medium"
          }
        ]
      }
    ];

    return regions[Math.floor(Math.random() * regions.length)];
  }

  static generateMarketPenetration(markets) {
    const penetration = {};
    markets.forEach(market => {
      penetration[market.market_name] = Math.floor(Math.random() * 40) + 60; // 60-99%
    });
    return penetration;
  }

  static generateApprovalTimes(markets) {
    const times = {};
    markets.forEach(market => {
      const days = Math.floor(Math.random() * 60) + 30; // 30-90 days
      times[market.market_name] = `${days}_days`;
    });
    return times;
  }

  static async createMLRHistoryForBrand(brand, userId) {
    const historyCount = Math.floor(Math.random() * 8) + 12; // 12-19 MLR entries per brand
    const history = [];

    for (let i = 0; i < historyCount; i++) {
      const complianceScore = Math.floor(Math.random() * 25) + 75; // 75-99
      const hasIssues = Math.random() < 0.15; // 15% chance of issues
      history.push({
        content_type: "content_asset",
        content_id: `${brand.id}-asset-${i + 1}`,
        brand_compliance_score: complianceScore,
        campaign_compliance_score: null,
        asset_compliance_score: complianceScore,
        overall_compliance_score: hasIssues ? complianceScore - 5 : complianceScore,
        compliance_details: {
          regulatory_review: hasIssues ? "passed_with_conditions" : "passed",
          clinical_accuracy: "verified",
          fair_balance: "compliant",
          market_specific_requirements: this.generateMarketCompliance(brand)
        },
        suggestions: hasIssues ? [
          {
            category: "enhancement",
            message: `Consider market-specific messaging for ${brand.therapeutic_area}`,
            priority: "low"
          }
        ] : [],
        warnings: hasIssues ? [
          {
            category: "regulatory",
            message: "Minor regulatory language adjustment needed",
            priority: "medium"
          }
        ] : [],
        critical_issues: [],
        has_overrides: false,
        approved_by: userId,
        approval_timestamp: new Date(Date.now() - Math.floor(Math.random() * 120) * 24 * 60 * 60 * 1000).toISOString(),
        checked_by: userId,
        guardrails_version: `v2.${Math.floor(Math.random() * 5) + 1}.0`
      });
    }

    const { error } = await supabase
      .from('compliance_history')
      .insert(history);

    if (error) {
      console.error(`Error creating MLR history for ${brand.brand_name}:`, error);
    }
  }

  static generateMarketCompliance(brand) {
    const markets = this.getMarketsForBrand(brand);
    const compliance = {};
    markets.forEach(market => {
      const statuses = ["FDA compliant", "EMA aligned", "PMDA approved", "Health Canada approved", "TGA compliant"];
      compliance[market] = statuses[Math.floor(Math.random() * statuses.length)];
    });
    return compliance;
  }

  static async createPerformanceDataForBrand(brand, userId) {
    const performanceCount = Math.floor(Math.random() * 15) + 10; // 10-24 performance entries per brand
    const analytics = [];

    for (let i = 0; i < performanceCount; i++) {
      const metrics = this.generatePerformanceMetrics(brand);
      analytics.push({
        content_id: `${brand.id}-asset-${i + 1}`,
        brand_id: brand.id,
        content_type: "content_asset",
        metrics: metrics,
        performance_score: metrics.overall_score,
        benchmark_comparison: {
          industry_average: metrics.overall_score - Math.floor(Math.random() * 20) + 5, // Usually above average
          therapeutic_area_benchmark: metrics.overall_score - Math.floor(Math.random() * 15) + 3,
          company_baseline: metrics.overall_score - Math.floor(Math.random() * 10) + 2
        }
      });
    }

    const { error } = await supabase
      .from('content_analytics')
      .insert(analytics);

    if (error) {
      console.error(`Error creating performance data for ${brand.brand_name}:`, error);
    }
  }

  static generatePerformanceMetrics(brand) {
    const baseMetrics = {
      engagement_rate: Math.random() * 0.4 + 0.25, // 25-65%
      click_through_rate: Math.random() * 0.15 + 0.08, // 8-23%
      conversion_rate: Math.random() * 0.12 + 0.04, // 4-16%
      time_on_page: Math.floor(Math.random() * 180) + 120, // 2-5 minutes
      bounce_rate: Math.random() * 0.3 + 0.2, // 20-50%
    };

    // Therapeutic area specific adjustments
    const multipliers = {
      "Oncology": { engagement: 1.2, conversion: 1.1 }, // Higher engagement in oncology
      "Cardiovascular": { engagement: 1.0, conversion: 1.0 }, // Baseline
      "Respiratory": { engagement: 1.1, conversion: 0.95 } // Slightly lower conversion
    };

    const multiplier = multipliers[brand.therapeutic_area] || multipliers["Cardiovascular"];

    const adjustedMetrics = {
      ...baseMetrics,
      engagement_rate: Math.min(0.8, baseMetrics.engagement_rate * multiplier.engagement),
      conversion_rate: Math.min(0.25, baseMetrics.conversion_rate * multiplier.conversion),
      hcp_satisfaction: Math.random() * 0.25 + 0.75, // 75-100%
      patient_satisfaction: Math.random() * 0.2 + 0.8, // 80-100%
      brand_recall: Math.random() * 0.3 + 0.6, // 60-90%
      message_comprehension: Math.random() * 0.25 + 0.7, // 70-95%
      clinical_relevance_score: Math.random() * 0.2 + 0.8, // 80-100%
      competitive_advantage_score: Math.random() * 0.3 + 0.65, // 65-95%
      overall_score: 0 // Will be calculated below
    };

    // Calculate overall score
    const scores = [
      adjustedMetrics.engagement_rate,
      adjustedMetrics.conversion_rate,
      adjustedMetrics.hcp_satisfaction,
      adjustedMetrics.patient_satisfaction,
      adjustedMetrics.brand_recall,
      adjustedMetrics.message_comprehension,
      adjustedMetrics.clinical_relevance_score,
      adjustedMetrics.competitive_advantage_score
    ].filter(val => typeof val === 'number' && val <= 1);

    adjustedMetrics.overall_score = Math.floor((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);

    return adjustedMetrics;
  }
};
