import { useNavigate, useLocation } from "react-router-dom";
import IntakeFlow from "@/components/intake/IntakeFlow";
import { IntelligenceProvider } from "@/contexts/IntelligenceContext";
import { useBrand } from "@/contexts/BrandContext";
import { mapOpportunityTypeToObjective, generateIntelligentCTA } from "@/utils/opportunityToIntakeMapper";
import { sanitizeString } from "@/lib/utils";

// Helper function to map broad channel names to specific asset types
const mapChannelsToAssetTypes = (channels) => {
  const channelMap = {
    'email': 'mass-email',
    'hcp email': 'mass-email',
    'patient email': 'patient-email',
    'caregiver email': 'caregiver-email',
    'social': 'social-media-post',
    'social media': 'social-media-post',
    'webinar': 'website-landing-page',
    'landing page': 'website-landing-page',
    'web': 'website-landing-page',
    'website': 'website-landing-page',
    'sales aid': 'digital-sales-aid',
    'digital sales aid': 'digital-sales-aid',
    'rep email': 'rep-triggered-email',
    'rep-enabled': 'rep-triggered-email',
    'rep triggered': 'rep-triggered-email',
    'blog': 'website-landing-page'
  };
  
  // Normalize channel name
  const normalizeChannel = (ch) => {
    return ch.toLowerCase().trim().replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
  };
  
  return channels
    .map(ch => {
      const normalized = normalizeChannel(ch);
      // Try exact match first
      let assetType = channelMap[normalized];
      // Try with hyphen/underscore variations
      if (!assetType) {
        assetType = channelMap[ch.toLowerCase().trim()];
      }
      // Try partial match for common patterns
      if (!assetType) {
        // Social platforms
        if (['twitter', 'x'].some(p => normalized.includes(p))) {
          assetType = 'social-media-post';
        } else if (normalized.includes('instagram')) {
          assetType = 'social-media-post';
        } else if (normalized.includes('facebook')) {
          assetType = 'social-media-post';
        } else if (normalized.includes('linkedin')) {
          assetType = 'social-media-post';
        } else if (normalized.includes('reddit')) {
          assetType = 'social-media-post';
        } else if (normalized.includes('social')) {
          assetType = 'social-media-post';
        }
        // Patient/forum content
        else if (normalized.includes('patient') && normalized.includes('forum')) {
          assetType = 'patient-email';
        } else if (normalized.includes('forum')) {
          assetType = 'website-landing-page';
        }
        // Email channels
        else if (normalized.includes('email') && normalized.includes('rep')) {
          assetType = 'rep-triggered-email';
        } else if (normalized.includes('email')) {
          assetType = 'mass-email';
        }
        // Web channels
        else if (normalized.includes('web') || normalized.includes('landing')) {
          assetType = 'website-landing-page';
        } else if (normalized.includes('sales') || normalized.includes('aid')) {
          assetType = 'digital-sales-aid';
        }
      }
      return assetType;
    })
    .filter(Boolean);
};

// Helper function to map opportunity audience to intake form audience type
const mapOpportunityAudience = (audience) => {
  if (!audience) return 'Physician-Specialist';
  const lower = audience.toLowerCase().trim();
  
  // Exact matches first
  if (lower === 'hcp') return 'Physician-Specialist';
  if (lower === 'patient' || lower === 'patients') return 'Patient';
  if (lower === 'caregiver' || lower === 'caregivers') return 'Caregiver-Family';
  
  // HCP variations
  if (lower.includes('hcp') || lower.includes('physician') || lower.includes('specialist') || 
      lower.includes('doctor') || lower.includes('prescriber') || lower.includes('healthcare professional')) {
    return 'Physician-Specialist';
  }
  
  // Patient variations
  if (lower.includes('patient') || lower.includes('consumer')) {
    return 'Patient';
  }
  
  // Caregiver variations
  if (lower.includes('caregiver') || lower.includes('family')) {
    return 'Caregiver-Family';
  }
  
  // Nurse variations
  if (lower.includes('nurse') || lower.includes('np') || lower.includes('pa')) {
    return 'Nurse-RN';
  }
  
  // Pharmacist variations
  if (lower.includes('pharmacist') || lower.includes('payer')) {
    return 'Pharmacist';
  }
  
  return 'Physician-Specialist'; // Default fallback
};

const IntakeFlowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBrand } = useBrand();
  
  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };
  
  if (!selectedBrand) {
    return <div>Please select a brand first</div>;
  }

  // Extract template or opportunity data from location state
  const template = location.state?.template;
  const opportunity = location.state?.opportunity;
  const templateUsed = !!template;
  
  // Get user-selected asset types from modal (if coming from opportunity)
  const userSelectedAssetTypes = location.state?.selectedAssetTypes;
  const userSelectedInitiativeType = location.state?.initiativeType;
  const startAtStep = location.state?.startAtStep;
  const prefilledFromOpportunity = location.state?.prefilledFromOpportunity;
  
  // Get pre-calculated values from modal (if available)
  const modalPrefilledObjective = location.state?.prefilledObjective;
  const modalPrefilledCTA = location.state?.prefilledCTA;
  const modalPrefilledKeyMessage = location.state?.prefilledKeyMessage;
  const modalPrefilledAudience = location.state?.prefilledAudience;
  
  // Convert opportunity data to pre-filled form data with correct field names
  // Sanitize all string values to remove corrupted Unicode characters (e.g., emoji corruption during React Router serialization)
  const opportunityPreFill = opportunity ? {
    // FIX APPLIED HERE: Added the closing bracket ]+ to the regex to properly close the character class
    projectName: sanitizeString(opportunity.title?.replace(/^[嶋悼識櫨笞ｸ従]+\s*/, '') || ''),
    
    // Use modal pre-filled objective if available, otherwise map from opportunity type with audience context
    primaryObjective: modalPrefilledObjective || mapOpportunityTypeToObjective(
      opportunity.opportunity_type || '',
      opportunity.target_audiences?.[0] || 'HCP'
    ),
    // ALWAYS apply mapping to ensure valid AudienceType
    primaryAudience: mapOpportunityAudience(modalPrefilledAudience || opportunity.target_audiences?.[0]),
    // Use user-selected asset types if available, otherwise map from channels
    selectedAssetTypes: userSelectedAssetTypes || mapChannelsToAssetTypes(opportunity.suggested_channels || []),
    // Use user-selected initiative type if available
    initiativeType: userSelectedInitiativeType || (
      (userSelectedAssetTypes?.length || mapChannelsToAssetTypes(opportunity.suggested_channels || []).length) > 1 
        ? 'campaign' 
        : 'single-asset'
    ),
    // Use modal pre-filled values if available - sanitize all string values
    keyMessage: sanitizeString(modalPrefilledKeyMessage || opportunity.recommended_actions?.map(a => a.action).join('. ') || ''),
    callToAction: sanitizeString(modalPrefilledCTA || generateIntelligentCTA(opportunity)),
    campaignContext: sanitizeString(`Opportunity: ${opportunity.opportunity_type?.replace(/_/g, ' ')}`),
    opportunityType: opportunity.opportunity_type,
    suggestedChannels: opportunity.suggested_channels,
    // Flag to indicate this came from an opportunity for UI highlighting
    _fromOpportunity: prefilledFromOpportunity,
    _opportunityTitle: sanitizeString(opportunity.title || '')
  } : undefined;
  
  const preFilledData = template?.preFilledData || opportunityPreFill;
  
  return (
    <IntelligenceProvider brandId={selectedBrand.id} autoLoad={true}>
      <IntakeFlow 
        onClose={handleClose} 
        templateUsed={templateUsed}
        templateData={template}
        preFilledData={preFilledData}
        startAtStep={startAtStep}
      />
    </IntelligenceProvider>
  );
};

export default IntakeFlowPage;