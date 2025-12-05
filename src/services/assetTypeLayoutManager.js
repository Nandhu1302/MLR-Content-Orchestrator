import { assetConfigurations } from '@/data/assetConfigurations';




export class AssetTypeLayoutManager {
  // Asset type normalization mapping
  static assetTypeMapping<string, string> = {
    'mass-email': 'mass-email',
    'rep-triggered-email': 'rep-triggered-email',
    'patient-email': 'email',
    'caregiver-email': 'email',
    'social-media-post': 'social',
    'website-landing-page': 'web',
    'digital-sales-aid': 'dsa',
    'blog': 'web',
    // Direct mappings
    'email': 'email',
    'print': 'print', 
    'social': 'social',
    'web': 'web',
    'dsa': 'dsa'
  };

  static layouts<string, AssetLayout> = {
    'email': {
      sections: [
        {
          id: 'email-header',
          name: 'Email Header',
          description: 'Subject line and preheader for email clients',
          fields: [
            {
              id: 'subject',
              name: 'Subject Line',
              type: 'input',
              required,
              placeholder: 'Enter compelling subject line...',
              maxLength,
              aiEnabled,
              description: 'Appears in inbox, keep under 50 characters'
            },
            {
              id: 'preheader',
              name: 'Preheader Text',
              type: 'input',
              required,
              placeholder: 'Supporting text that appears after subject...',
              maxLength,
              aiEnabled,
              description: 'Preview text shown in email clients'
            }
          ]
        },
        {
          id: 'email-content',
          name: 'Email Content',
          description: 'Main body content and messaging',
          fields: [
            {
              id: 'headline',
              name: 'Email Headline',
              type: 'input',
              required,
              placeholder: 'Main headline within email...',
              aiEnabled
            },
            {
              id: 'body',
              name: 'Email Body',
              type: 'richtext',
              required,
              placeholder: 'Craft your professional email content...',
              aiEnabled,
              description: 'Main email content with clinical messaging'
            },
            {
              id: 'keyMessage',
              name: 'Key Clinical Message',
              type: 'textarea',
              required,
              placeholder: 'Core clinical or product message...',
              aiEnabled
            }
          ]
        },
        {
          id: 'email-action',
          name: 'Call-to-Action & Footer',
          description: 'CTA buttons and legal requirements',
          fields: [
            {
              id: 'cta',
              name: 'Primary CTA',
              type: 'input',
              required,
              placeholder: 'Learn More | Download | Contact Rep',
              aiEnabled
            },
            {
              id: 'unsubscribe',
              name: 'Unsubscribe Text',
              type: 'input',
              required,
              placeholder: 'Unsubscribe link text...'
            },
            {
              id: 'disclaimer',
              name: 'Legal Footer',
              type: 'textarea',
              required,
              placeholder: 'Regulatory disclaimers and legal text...'
            }
          ]
        }
      ],
      previewType: 'email',
      estimatedTime,
      channels: ['Email Marketing Platform', 'Veeva CRM']
    },

    'mass-email': {
      sections: [
        {
          id: 'email-header',
          name: 'Email Header',
          description: 'Subject line and preheader for mass email campaigns',
          fields: [
            {
              id: 'subject',
              name: 'Subject Line',
              type: 'input',
              required,
              placeholder: 'Enter compelling subject line for mass email...',
              maxLength,
              aiEnabled,
              description: 'Appears in inbox, keep under 50 characters'
            },
            {
              id: 'preheader',
              name: 'Preheader Text',
              type: 'input',
              required,
              placeholder: 'Supporting text that appears after subject...',
              maxLength,
              aiEnabled,
              description: 'Preview text shown in email clients'
            }
          ]
        },
        {
          id: 'email-content',
          name: 'Email Content',
          description: 'Main body content for mass distribution',
          fields: [
            {
              id: 'headline',
              name: 'Email Headline',
              type: 'input',
              required,
              placeholder: 'Main headline for mass email...',
              aiEnabled
            },
            {
              id: 'body',
              name: 'Email Body',
              type: 'richtext',
              required,
              placeholder: 'Craft your mass email content for HCPs...',
              aiEnabled,
              description: 'Main email content with clinical messaging'
            },
            {
              id: 'keyMessage',
              name: 'Key Clinical Message',
              type: 'textarea',
              required,
              placeholder: 'Core clinical or product message...',
              aiEnabled
            }
          ]
        },
        {
          id: 'email-action',
          name: 'Call-to-Action & Footer',
          description: 'CTA buttons and compliance requirements',
          fields: [
            {
              id: 'cta',
              name: 'Primary CTA',
              type: 'input',
              required,
              placeholder: 'Learn More | Download Resources | Contact Us',
              aiEnabled
            },
            {
              id: 'unsubscribe',
              name: 'Unsubscribe Text',
              type: 'input',
              required,
              placeholder: 'Unsubscribe preferences...'
            },
            {
              id: 'disclaimer',
              name: 'Legal Footer',
              type: 'textarea',
              required,
              placeholder: 'Regulatory disclaimers and legal text...'
            }
          ]
        }
      ],
      previewType: 'email',
      estimatedTime,
      channels: ['Email Marketing Platform', 'SFMC', 'Mailchimp']
    },

    'rep-triggered-email': {
      sections: [
        {
          id: 'personal-header',
          name: 'Personal Header',
          description: 'Personalized greeting and subject for rep-triggered email',
          fields: [
            {
              id: 'subject',
              name: 'Subject Line',
              type: 'input',
              required,
              placeholder: 'Following up on our discussion about...',
              aiEnabled
            },
            {
              id: 'personalGreeting',
              name: 'Personal Greeting',
              type: 'textarea',
              required,
              placeholder: 'Dear Dr. [LASTNAME], Thank you for...',
              aiEnabled
            }
          ]
        },
        {
          id: 'meeting-content',
          name: 'Follow-up Content',
          description: 'Personalized content and resources',
          fields: [
            {
              id: 'body',
              name: 'Email Body',
              type: 'richtext',
              required,
              placeholder: 'Personalized follow-up content...',
              aiEnabled
            },
            {
              id: 'resources',
              name: 'Additional Resources',
              type: 'textarea',
              required,
              placeholder: 'Attached clinical data or resources...',
              aiEnabled
            },
            {
              id: 'nextSteps',
              name: 'Next Steps',
              type: 'textarea',
              required,
              placeholder: 'Proposed next actions or follow-up...',
              aiEnabled
            }
          ]
        },
        {
          id: 'rep-signature',
          name: 'Rep Contact Info',
          fields: [
            {
              id: 'cta',
              name: 'Call-to-Action',
              type: 'input',
              required,
              placeholder: 'Schedule Meeting | Call Me | Reply',
              aiEnabled
            },
            {
              id: 'repSignature',
              name: 'Rep Signature',
              type: 'textarea',
              required,
              placeholder: 'Best regards,\n[REP_NAME]\n[TITLE]\n[COMPANY]'
            },
            {
              id: 'disclaimer',
              name: 'Legal Footer',
              type: 'textarea',
              required,
              placeholder: 'Regulatory disclaimers and legal text...'
            }
          ]
        }
      ],
      previewType: 'email',
      estimatedTime,
      channels: ['Veeva CRM', 'Salesforce', 'Rep Portal']
    },

    'print': {
      sections: [
        {
          id: 'personal-header',
          name: 'Personal Header',
          description: 'Personalized greeting and subject',
          fields: [
            {
              id: 'subject',
              name: 'Subject Line',
              type: 'input',
              required,
              placeholder: 'Following up on our discussion about...',
              aiEnabled
            },
            {
              id: 'personalGreeting',
              name: 'Personal Greeting',
              type: 'textarea',
              required,
              placeholder: 'Dear Dr. [LASTNAME], Thank you for...',
              aiEnabled
            }
          ]
        },
        {
          id: 'meeting-content',
          name: 'Meeting Follow-up',
          description: 'Recap and additional resources',
          fields: [
            {
              id: 'meetingRecap',
              name: 'Meeting Recap',
              type: 'textarea',
              required,
              placeholder: 'During our meeting, we discussed...',
              aiEnabled
            },
            {
              id: 'resources',
              name: 'Additional Resources',
              type: 'textarea',
              required,
              placeholder: 'I\'ve attached the clinical data we mentioned...',
              aiEnabled
            },
            {
              id: 'nextSteps',
              name: 'Next Steps',
              type: 'textarea',
              required,
              placeholder: 'I\'ll follow up in two weeks to...',
              aiEnabled
            }
          ]
        },
        {
          id: 'rep-signature',
          name: 'Rep Contact Info',
          fields: [
            {
              id: 'repSignature',
              name: 'Rep Signature',
              type: 'textarea',
              required,
              placeholder: 'Best regards,\n[REP_NAME]\n[TITLE]\n[COMPANY]'
            },
            {
              id: 'contactInfo',
              name: 'Contact Information',
              type: 'textarea',
              required,
              placeholder: 'Phone: [PHONE]\nEmail: [EMAIL]'
            }
          ]
        }
      ],
      previewType: 'email',
      estimatedTime,
      channels: ['Veeva CRM', 'Sales Enablement']
    },

    'social': {
      sections: [
        {
          id: 'social-content',
          name: 'Social Media Content',
          description: 'Post content optimized for social platforms',
          fields: [
            {
              id: 'headline',
              name: 'Post Headline',
              type: 'input',
              required,
              placeholder: 'Engaging headline for social media...',
              maxLength,
              aiEnabled
            },
            {
              id: 'bodyText',
              name: 'Post Content',
              type: 'textarea',
              required,
              placeholder: 'Educational content about condition or treatment...',
              maxLength,
              aiEnabled,
              description: 'Keep educational and compliant'
            },
            {
              id: 'hashtags',
              name: 'Hashtags',
              type: 'input',
              required,
              placeholder: '#IPF #LungHealth #OfevInfo',
              description: 'Include brand and condition hashtags'
            }
          ]
        },
        {
          id: 'social-specs',
          name: 'Platform Specifications',
          fields: [
            {
              id: 'platform',
              name: 'Target Platform',
              type: 'select',
              required,
              options: ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'],
              description: 'Primary social platform for this content'
            },
            {
              id: 'imageSpecs',
              name: 'Image Requirements',
              type: 'textarea',
              required,
              placeholder: 'Image dimensions, style guidelines...'
            },
            {
              id: 'disclaimer',
              name: 'Social Disclaimer',
              type: 'textarea',
              required,
              placeholder: 'Educational content. Consult your healthcare provider...'
            }
          ]
        }
      ],
      previewType: 'social',
      estimatedTime,
      channels: ['LinkedIn', 'Twitter', 'Facebook']
    },

    'web': {
      sections: [
        {
          id: 'hero-section',
          name: 'Hero Section',
          description: 'Above-the-fold content - primary page messaging',
          fields: [
            {
              id: 'heroHeadline',
              name: 'Hero Headline',
              type: 'input',
              required,
              placeholder: 'Powerful headline for landing page...',
              aiEnabled
            },
            {
              id: 'heroSubheadline',
              name: 'Hero Subheadline',
              type: 'textarea',
              required,
              placeholder: 'Supporting headline with key value proposition...',
              aiEnabled
            },
            {
              id: 'heroCta',
              name: 'Hero CTA',
              type: 'input',
              required,
              placeholder: 'Get Started | Learn More | Contact Us',
              aiEnabled
            }
          ]
        },
        {
          id: 'content-blocks',
          name: 'Page Content',
          description: 'Main content sections',
          fields: [
            {
              id: 'diseaseOverview',
              name: 'Disease Overview',
              type: 'richtext',
              required,
              placeholder: 'Educational content about the condition...',
              aiEnabled
            },
            {
              id: 'treatmentApproach',
              name: 'Treatment Approach',
              type: 'richtext',
              required,
              placeholder: 'Information about treatment options...',
              aiEnabled
            },
            {
              id: 'clinicalEvidence',
              name: 'Clinical Evidence',
              type: 'richtext',
              required,
              placeholder: 'Clinical trial data and efficacy information...',
              aiEnabled
            }
          ]
        },
        {
          id: 'page-footer',
          name: 'Footer & Legal',
          fields: [
            {
              id: 'safetyInformation',
              name: 'Safety Information',
              type: 'richtext',
              required,
              placeholder: 'Important safety information and warnings...'
            },
            {
              id: 'disclaimer',
              name: 'Legal Footer',
              type: 'textarea',
              required,
              placeholder: 'Copyright, terms of use, privacy policy links...'
            }
          ]
        },
        {
          id: 'seo-metadata',
          name: 'SEO & Metadata',
          description: 'Search engine and page metadata - completed after content',
          fields: [
            {
              id: 'pageTitle',
              name: 'Page Title',
              type: 'input',
              required,
              placeholder: 'Understanding IPF Treatment Options | Brand Name',
              maxLength,
              aiEnabled,
              description: 'Shows in search results and browser tab'
            },
            {
              id: 'metaDescription',
              name: 'Meta Description',
              type: 'textarea',
              required,
              placeholder: 'Learn about treatment options for IPF...',
              maxLength,
              aiEnabled,
              description: 'Appears in search engine results'
            }
          ]
        }
      ],
      previewType: 'web',
      estimatedTime,
      channels: ['Corporate Website', 'Campaign Microsites']
    },

    'dsa': {
      sections: [
        {
          id: 'presentation-structure',
          name: 'Presentation Structure',
          description: 'Slide organization and flow',
          fields: [
            {
              id: 'titleSlide',
              name: 'Title Slide',
              type: 'input',
              required,
              placeholder: 'Presentation title and key theme...',
              aiEnabled
            },
            {
              id: 'agenda',
              name: 'Agenda',
              type: 'textarea',
              required,
              placeholder: 'Key topics to be covered in presentation...',
              aiEnabled
            }
          ]
        },
        {
          id: 'clinical-content',
          name: 'Clinical Data',
          description: 'Efficacy and clinical evidence slides',
          fields: [
            {
              id: 'clinicalData',
              name: 'Clinical Data Slides',
              type: 'richtext',
              required,
              placeholder: 'Clinical trial results, efficacy data...',
              aiEnabled
            },
            {
              id: 'efficacySlides',
              name: 'Efficacy Highlights',
              type: 'richtext',
              required,
              placeholder: 'Key efficacy messages and data points...',
              aiEnabled
            },
            {
              id: 'patientCases',
              name: 'Patient Case Studies',
              type: 'richtext',
              required,
              placeholder: 'Representative patient scenarios...',
              aiEnabled
            }
          ]
        },
        {
          id: 'safety-profile',
          name: 'Safety Profile',
          description: 'Safety information and risk communication',
          fields: [
            {
              id: 'safetyProfile',
              name: 'Safety Overview',
              type: 'richtext',
              required,
              placeholder: 'Comprehensive safety profile information...'
            },
            {
              id: 'adverseEvents',
              name: 'Adverse Events',
              type: 'richtext',
              required,
              placeholder: 'Common and serious adverse events...'
            }
          ]
        },
        {
          id: 'discussion-tools',
          name: 'Discussion Tools',
          description: 'Interactive elements and conversation starters',
          fields: [
            {
              id: 'discussionGuides',
              name: 'Discussion Guides',
              type: 'textarea',
              required,
              placeholder: 'Questions to facilitate HCP discussion...',
              aiEnabled
            },
            {
              id: 'interactiveElements',
              name: 'Interactive Features',
              type: 'textarea',
              required,
              placeholder: 'Tap-to-reveal, animations, videos...'
            }
          ]
        }
      ],
      previewType: 'slide',
      estimatedTime,
      channels: ['Veeva CLM', 'iPad App', 'Sales Portal']
    }
  };

  /**
   * Normalize asset type from intake flow to editor layout type
   */
  static normalizeAssetType(assetType): string {
    return this.assetTypeMapping[assetType] || assetType;
  }

  /**
   * Get layout configuration for specific asset type
   */
  static getLayout(assetType): AssetLayout | null {
    const normalizedType = this.normalizeAssetType(assetType);
    return this.layouts[normalizedType] || null;
  }

  /**
   * Get preview type for asset type (handles normalization)
   */
  static getPreviewType(assetType): 'email' | 'web' | 'slide' | 'social' {
    const layout = this.getLayout(assetType);
    return layout.previewType || 'web';
  }

  /**
   * Get all available asset types with their basic info
   */
  static getAvailableAssetTypes(): Array<{ type; name; description; estimatedHours }> {
    return assetConfigurations.map(config => ({
      type.type,
      name.name,
      description.description,
      estimatedHours.estimatedHours
    }));
  }

  /**
   * Get required fields for asset type
   */
  static getRequiredFields(assetType): string[] {
    const layout = this.getLayout(assetType);
    if (!layout) return [];

    return layout.sections
      .flatMap(section => section.fields)
      .filter(field => field.required)
      .map(field => field.id);
  }

  /**
   * Get AI-enabled fields for asset type
   */
  static getAIEnabledFields(assetType): string[] {
    const layout = this.getLayout(assetType);
    if (!layout) return [];

    return layout.sections
      .flatMap(section => section.fields)
      .filter(field => field.aiEnabled)
      .map(field => field.id);
  }

  /**
   * Validate content against asset type requirements
   */
  static validateContent(assetType, content<string, any>): {
    isValid;
    missingRequired;
    validationErrors<{ field; error }>;
  } {
    const layout = this.getLayout(assetType);
    if (!layout) {
      return { isValid, missingRequired: [], validationErrors: [{ field: 'assetType', error: 'Unknown asset type' }] };
    }

    const missingRequired = [];
    const validationErrors<{ field; error }> = [];

    layout.sections.forEach(section => {
      section.fields.forEach(field => {
        const value = content[field.id];

        // Check required fields
        if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
          missingRequired.push(field.id);
        }

        // Check length constraints
        if (value && typeof value === 'string') {
          if (field.maxLength && value.length > field.maxLength) {
            validationErrors.push({
              field.id,
              error: `Content exceeds maximum length of ${field.maxLength} characters`
            });
          }
          if (field.minLength && value.length < field.minLength) {
            validationErrors.push({
              field.id,
              error: `Content must be at least ${field.minLength} characters`
            });
          }
        }
      });
    });

    return {
      isValid.length === 0 && validationErrors.length === 0,
      missingRequired,
      validationErrors
    };
  }

  /**
   * Convert generic content to asset-type specific structure
   */
  static adaptContentToAssetType(genericContent<string, any>, assetType): Record<string, any> {
    const layout = this.getLayout(assetType);
    if (!layout) return genericContent;

    const adaptedContent<string, any> = {};
    
    // Map generic fields to asset-specific fields
    const fieldMappings<string, string> = {
      'subject': 'subject',
      'headline': 'headline',
      'body': 'body',
      'keyMessage': 'keyMessage',
      'cta': 'cta',
      'disclaimer': 'disclaimer'
    };

    // First, map existing generic content
    Object.entries(fieldMappings).forEach(([genericField, assetField]) => {
      if (genericContent[genericField]) {
        adaptedContent[assetField] = genericContent[genericField];
      }
    });

    // Then, initialize asset-specific fields with empty values
    layout.sections.forEach(section => {
      section.fields.forEach(field => {
        if (!(field.id in adaptedContent)) {
          adaptedContent[field.id] = '';
        }
      });
    });

    return adaptedContent;
  }
}