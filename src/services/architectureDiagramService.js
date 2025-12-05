import { DiagramDefinition, DiagramType } from '@/types/diagram';

class ArchitectureDiagramService {
  static getAllDiagrams() {
    return [
      // Platform-wide diagrams
      this.getFullPlatformC4ContextDiagram(),
      this.getFullPlatformC4ContainerDiagram(),
      this.getFullPlatformDeploymentDiagram(),
      this.getModuleInteractionSequenceDiagram(),
      this.getFullPlatformERDiagram(),
      // Glocalization module-specific diagrams
      this.getC4ContextDiagram(),
      this.getC4ContainerDiagram(),
      this.getDeploymentDiagram(),
      this.getC4ComponentDiagram(),
      this.getERDiagram(),
      this.getSequenceTranslationDiagram(),
      this.getSequenceCulturalDiagram(),
      this.getDataFlowDiagram(),
    ];
  }

  static getDiagramById(id) | undefined {
    return this.getAllDiagrams().find(d => d.id === id);
  }

  static getHighLevelDiagrams() {
    return [
      this.getFullPlatformC4ContextDiagram(),
      this.getFullPlatformC4ContainerDiagram(),
      this.getFullPlatformDeploymentDiagram(),
      this.getModuleInteractionSequenceDiagram(),
      this.getFullPlatformERDiagram(),
    ];
  }

  static getDeepDiveDiagrams() {
    return [
      this.getC4ContextDiagram(),
      this.getC4ContainerDiagram(),
      this.getDeploymentDiagram(),
      this.getC4ComponentDiagram(),
      this.getERDiagram(),
      this.getSequenceTranslationDiagram(),
      this.getSequenceCulturalDiagram(),
      this.getDataFlowDiagram(),
    ];
  }

  private static getC4ContextDiagram() {
    return {
      id: 'c4-context',
      name: 'C4 Context Diagram (Level 1)',
      description: 'System context showing external actors and systems',
      category: 'high-level',
      audience: 'Executives, Product Managers, Business Stakeholders',
      purpose: 'Shows system boundaries, external users, and third-party integrations',
      keyInsight: 'Platform connects 6+ external data sources for comprehensive intelligence',
      mermaidSyntax: `
graph TB
    subgraph "External Actors"
        User1[Marketing TeamCreates localization projects]
        User2[MLR ReviewerApproves pharma content]
        User3[Market TeamsReview localized content]
        User4[System AdminManages configuration]
    end
    
    subgraph "Glocalization Module"
        System[Content Orchestrator PlatformAI-powered localization & cultural adaptation]
    end
    
    subgraph "External Systems"
        SSO[SSO / Auth0Authentication]
        OpenAI[OpenAI APIGPT-5 Translation]
        Gemini[Google GeminiAI Analysis]
        Email[Email ServiceNotifications]
        Analytics[Analytics PlatformUsage tracking]
    end
    
    User1 -->|Creates projectsHTTPS| System
    User2 -->|Reviews & approvesHTTPS| System
    User3 -->|Reviews translationsHTTPS| System
    User4 -->|Manages configHTTPS| System
    
    System -->|AuthenticatesOAuth 2.0| SSO
    System -->|Requests translationREST API| OpenAI
    System -->|Cultural analysisREST API| Gemini
    System -->|Sends notificationsSMTP| Email
    System -->|Tracks eventsREST API| Analytics
    
    classDef userClass fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width
    classDef systemClass fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width
    classDef externalClass fill:#10b981,stroke:#059669,color:#fff,stroke-width
    
    class User1,User2,User3,User4 userClass
    class System systemClass
    class SSO,OpenAI,Gemini,Email,Analytics externalClass
      `,
    };
  }

  private static getC4ContainerDiagram() {
    return {
      id: 'c4-container',
      name: 'C4 Container Diagram (Level 2)',
      description: 'Application containers and data stores',
      category: 'high-level',
      audience: 'Solution Architects, Technical Leads, Product Managers',
      purpose: 'High-level technology stack and component interactions',
      keyInsight: 'Microservices architecture enables independent scaling and deployment',
      mermaidSyntax: `
graph TB
    subgraph "Presentation Layer"
        Frontend[React SPATypeScript, VitePort 8080]
    end
    
    subgraph "Business Logic Layer"
        API[API GatewaySupabase Edge FunctionsDeno Runtime]
        
        subgraph "Microservices"
            Translation[Translation EngineAI Provider Integration]
            Cultural[Cultural AnalysisMarket Intelligence]
            Workflow[Workflow OrchestratorMLR Review Process]
            TM[Smart Translation MemoryLeveraging & Learning]
            Collab[Collaboration HubComments & Tasks]
            Regulatory[Regulatory ComplianceRule Engine]
        end
    end
    
    subgraph "Data Layer"
        PostgreSQL[(PostgreSQLSupabasePrimary Database)]
        Redis[(Redis CacheElastiCacheSession & TM)]
        S3[S3 StorageContent & Assets]
        EventBus[Event BusAsync Operations]
    end
    
    Frontend -->|HTTPSREST API| API
    API -->|Routes requests| Translation
    API -->|Routes requests| Cultural
    API -->|Routes requests| Workflow
    API -->|Routes requests| TM
    API -->|Routes requests| Collab
    API -->|Routes requests| Regulatory
    
    Translation -->|Reads/Writes| PostgreSQL
    Translation -->|Caches| Redis
    Cultural -->|Reads/Writes| PostgreSQL
    Workflow -->|Reads/Writes| PostgreSQL
    TM -->|Reads/Writes| Redis
    TM -->|Reads/Writes| PostgreSQL
    Collab -->|Reads/Writes| PostgreSQL
    Regulatory -->|Reads| PostgreSQL
    
    Translation -->|Stores content| S3
    Cultural -->|Stores reports| S3
    
    Translation -->|Publishes events| EventBus
    Workflow -->|Publishes events| EventBus
    EventBus -->|Triggers| Collab
    
    classDef presentationClass fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width
    classDef businessClass fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width
    classDef dataClass fill:#10b981,stroke:#059669,color:#fff,stroke-width
    
    class Frontend presentationClass
    class API,Translation,Cultural,Workflow,TM,Collab,Regulatory businessClass
    class PostgreSQL,Redis,S3,EventBus dataClass
      `,
    };
  }

  private static getDeploymentDiagram() {
    return {
      id: 'deployment',
      name: 'Deployment Architecture',
      description: 'Cloud infrastructure and deployment topology',
      category: 'high-level',
      audience: 'DevOps Engineers, Infrastructure Architects, CTO',
      purpose: 'Production deployment topology and infrastructure components',
      keyInsight: 'Cloud-native design supports global deployment and disaster recovery',
      mermaidSyntax: `
graph TB
    subgraph "Global"
        Users[End UsersGlobal Access]
        CDN[CloudFront CDNEdge Locations]
    end
    
    subgraph "AWS Cloud - us-east-1"
        subgraph "VPC - 10.0.0.0/16"
            subgraph "Public Subnet - 10.0.1.0/24"
                ALB[Application Load BalancerMulti-AZ]
                NAT[NAT GatewayOutbound Traffic]
            end
            
            subgraph "Private Subnet - ECS - 10.0.2.0/24"
                ECS[ECS Fargate Cluster]
                API[API Gateway ServiceContainer]
                Trans[Translation ServiceContainer]
                Cult[Cultural ServiceContainer]
                Work[Workflow ServiceContainer]
            end
            
            subgraph "Private Subnet - Data - 10.0.3.0/24"
                RDS[(RDS PostgreSQLMulti-AZdb.r6g.xlarge)]
                Redis[(ElastiCache RedisCluster Modecache.r6g.large)]
            end
            
            subgraph "Storage"
                S3[S3 BucketsContent StorageVersioned + Encrypted]
            end
        end
        
        subgraph "Security & Monitoring"
            WAF[AWS WAFDDoS Protection]
            SG[Security GroupsNetwork ACLs]
            CloudWatch[CloudWatchLogs & Metrics]
        end
    end
    
    Users -->|HTTPS| CDN
    CDN -->|HTTPS| WAF
    WAF -->|HTTPS| ALB
    ALB -->|HTTP| API
    
    API --> Trans
    API --> Cult
    API --> Work
    
    Trans -->|SQL| RDS
    Cult -->|SQL| RDS
    Work -->|SQL| RDS
    
    Trans -->|Cache| Redis
    
    Trans -->|S3 API| S3
    Cult -->|S3 API| S3
    
    Trans -.->|Egress| NAT
    Cult -.->|Egress| NAT
    
    SG -.->|Protects| API
    SG -.->|Protects| Trans
    SG -.->|Protects| RDS
    
    API -->|Logs| CloudWatch
    Trans -->|Logs| CloudWatch
    
    classDef globalClass fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width
    classDef computeClass fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width
    classDef dataClass fill:#10b981,stroke:#059669,color:#fff,stroke-width
    classDef securityClass fill:#ef4444,stroke:#dc2626,color:#fff,stroke-width
    
    class Users,CDN globalClass
    class ALB,ECS,API,Trans,Cult,Work,NAT computeClass
    class RDS,Redis,S3 dataClass
    class WAF,SG,CloudWatch securityClass
      `,
    };
  }

  private static getC4ComponentDiagram() {
    return {
      id: 'c4-component',
      name: 'C4 Component Diagram - AI Translation Engine',
      description: 'Internal components of Translation Engine microservice',
      category: 'deep-dive',
      audience: 'Developers, QA Engineers, Technical Architects',
      purpose: 'Internal component structure of the glocalization module',
      keyInsight: 'AI-powered translation with TM leverage achieves 30% cost reduction',
      mermaidSyntax: `
graph TB
    subgraph "AI Translation Engine Service"
        subgraph "Request Layer"
            Router[Request RouterLoad Balancing]
            Validator[Input ValidatorContent Validation]
        end
        
        subgraph "Provider Layer"
            ProviderMgr[Provider ManagerStrategy Pattern]
            OpenAIAdapter[OpenAI AdapterGPT-5 Integration]
            GeminiAdapter[Gemini AdapterGoogle AI]
            AzureAdapter[Azure AdapterBackup Provider]
        end
        
        subgraph "Intelligence Layer"
            ContextMgr[Context ManagerBrand & Terminology]
            QualityChecker[Quality ValidatorScoring & Metrics]
            TermChecker[Terminology CheckerConsistency Engine]
        end
        
        subgraph "Cache Layer"
            TMCache[TM Cache ServiceRedis Integration]
            Matcher[Fuzzy MatcherSimilarity Algorithm]
            CacheWriter[Cache WriterAsync Updates]
        end
        
        subgraph "Monitoring"
            Logger[Event LoggerAudit Trail]
            Metrics[Metrics CollectorPerformance Stats]
        end
    end
    
    Router -->|Routes| Validator
    Validator -->|Validated| ProviderMgr
    
    ProviderMgr -->|Delegates| OpenAIAdapter
    ProviderMgr -->|Delegates| GeminiAdapter
    ProviderMgr -->|Delegates| AzureAdapter
    
    ProviderMgr -->|Gets context| ContextMgr
    
    OpenAIAdapter -->|Returns| QualityChecker
    GeminiAdapter -->|Returns| QualityChecker
    AzureAdapter -->|Returns| QualityChecker
    
    QualityChecker -->|Checks terms| TermChecker
    TermChecker -->|Approved| CacheWriter
    
    Validator -->|Checks cache| TMCache
    TMCache -->|Fuzzy match| Matcher
    Matcher -->|Cache hit| Router
    
    CacheWriter -->|Updates| TMCache
    
    Router -->|Logs| Logger
    QualityChecker -->|Records| Metrics
    
    classDef requestClass fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width
    classDef providerClass fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width
    classDef intelligenceClass fill:#10b981,stroke:#059669,color:#fff,stroke-width
    classDef cacheClass fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width
    classDef monitorClass fill:#6b7280,stroke:#4b5563,color:#fff,stroke-width
    
    class Router,Validator requestClass
    class ProviderMgr,OpenAIAdapter,GeminiAdapter,AzureAdapter providerClass
    class ContextMgr,QualityChecker,TermChecker intelligenceClass
    class TMCache,Matcher,CacheWriter cacheClass
    class Logger,Metrics monitorClass
      `,
    };
  }

  private static getERDiagram() {
    return {
      id: 'erd',
      name: 'Entity-Relationship Diagram (ERD)',
      description: 'Complete database schema with relationships',
      category: 'deep-dive',
      audience: 'Database Architects, Backend Developers, Data Engineers',
      purpose: 'Database schema design and table relationships',
      keyInsight: 'Normalized schema design supports multi-tenant SaaS deployment',
      mermaidSyntax: `
erDiagram
    BRANDS ||--o{ PROJECTS : "owns"
    BRANDS ||--o{ BRAND_RULES : "defines"
    BRANDS ||--o{ COMPLIANCE_TEMPLATES : "has"
    
    PROJECTS ||--o{ CONTENT_ASSETS : "contains"
    PROJECTS ||--o{ WORKFLOWS : "manages"
    PROJECTS ||--o{ PROJECT_MEMBERS : "includes"
    
    CONTENT_ASSETS ||--o{ CONTENT_VERSIONS : "has"
    CONTENT_ASSETS ||--o{ TRANSLATIONS : "generates"
    CONTENT_ASSETS ||--o{ CULTURAL_ADAPTATIONS : "analyzes"
    
    TRANSLATIONS ||--o{ TRANSLATION_SEGMENTS : "splits_into"
    TRANSLATIONS ||--o{ QUALITY_SCORES : "evaluated_by"
    
    TRANSLATION_MEMORY ||--o{ TM_ENTRIES : "stores"
    TERMINOLOGY_GLOSSARY ||--o{ TERM_ENTRIES : "contains"
    
    WORKFLOWS ||--o{ WORKFLOW_TASKS : "includes"
    WORKFLOWS ||--o{ MLR_REVIEWS : "requires"
    
    WORKFLOW_TASKS ||--o{ TASK_COMMENTS : "has"
    WORKFLOW_TASKS ||--o{ TASK_APPROVALS : "requires"
    
    USERS ||--o{ PROJECT_MEMBERS : "participates"
    USERS ||--o{ TASK_COMMENTS : "creates"
    USERS ||--o{ AUDIT_LOGS : "generates"
    
    BRANDS {
        uuid id PK
        string name
        string industry
        jsonb compliance_rules
        timestamp created_at
    }
    
    PROJECTS {
        uuid id PK
        uuid brand_id FK
        string name
        string source_language
        array target_languages
        enum status
        timestamp deadline
    }
    
    CONTENT_ASSETS {
        uuid id PK
        uuid project_id FK
        string asset_type
        text source_content
        jsonb metadata
        timestamp created_at
    }
    
    TRANSLATIONS {
        uuid id PK
        uuid content_id FK
        string target_language
        text translated_content
        string provider
        float quality_score
        enum status
    }
    
    CULTURAL_ADAPTATIONS {
        uuid id PK
        uuid content_id FK
        string market
        jsonb insights
        jsonb recommendations
        timestamp analyzed_at
    }
    
    TRANSLATION_MEMORY {
        uuid id PK
        uuid brand_id FK
        string source_lang
        string target_lang
        int segment_count
    }
    
    TM_ENTRIES {
        uuid id PK
        uuid tm_id FK
        text source_text
        text target_text
        float match_score
        timestamp last_used
    }
    
    TERMINOLOGY_GLOSSARY {
        uuid id PK
        uuid brand_id FK
        string language
        int term_count
    }
    
    TERM_ENTRIES {
        uuid id PK
        uuid glossary_id FK
        string term
        string definition
        array synonyms
        boolean approved
    }
    
    WORKFLOWS {
        uuid id PK
        uuid project_id FK
        string workflow_type
        enum status
        timestamp started_at
    }
    
    WORKFLOW_TASKS {
        uuid id PK
        uuid workflow_id FK
        string task_type
        string assignee_id FK
        enum status
        timestamp due_date
    }
    
    MLR_REVIEWS {
        uuid id PK
        uuid workflow_id FK
        string reviewer_id FK
        enum decision
        text comments
        timestamp reviewed_at
    }
    
    TASK_COMMENTS {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        text comment
        timestamp created_at
    }
    
    TASK_APPROVALS {
        uuid id PK
        uuid task_id FK
        uuid approver_id FK
        enum status
        timestamp approved_at
    }
    
    USERS {
        uuid id PK
        string email UK
        string full_name
        array roles
        timestamp last_login
    }
    
    PROJECT_MEMBERS {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        string role
        timestamp joined_at
    }
    
    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string entity_type
        uuid entity_id
        jsonb changes
        timestamp created_at
    }
      `,
    };
  }

  private static getSequenceTranslationDiagram() {
    return {
      id: 'sequence-translation',
      name: 'Sequence Diagram - Translation Workflow',
      description: 'End-to-end translation request flow',
      category: 'deep-dive',
      audience: 'Developers, QA Testers, Business Analysts',
      purpose: 'Step-by-step interaction flow for translation requests',
      keyInsight: 'Asynchronous processing enables parallel translation across 50+ markets',
      mermaidSyntax: `
sequenceDiagram
    actor User as Marketing Team
    participant FE as Frontend SPA
    participant API as API Gateway
    participant Trans as Translation Service
    participant TM as TM Cache (Redis)
    participant AI as AI Provider (GPT-5)
    participant QV as Quality Validator
    participant DB as PostgreSQL
    
    User->>FE translation request
    FE->>FE content format
    FE->>API /translations {content, source, target}
    
    API->>API user (JWT)
    API->>Trans translation request
    
    Trans->>TM for cached matches
    TM-->>Trans match results (0-100%)
    
    alt Cache hit (>95% match)
        Trans->>DB cache hit
        Trans-->>API cached translation
        API-->>FE result
        FE-->>User translation
    else Cache miss or low match
        Trans->>Trans AI context (brand, terminology)
        Trans->>AI translation with context
        
        AI-->>Trans response
        
        Trans->>QV quality
        QV->>QV terminology consistency
        QV->>QV quality score
        
        alt Quality passed (score >80%)
            QV-->>Trans with score
            Trans->>DB translation + metadata
            Trans->>TM cache (async)
            Trans-->>API result + score
            API-->>FE response
            FE-->>User translation
        else Quality failed
            QV-->>Trans with issues
            Trans->>AI with enhanced prompt
            AI-->>Trans translation
            Trans->>QV-validate
            QV-->>Trans result
            Trans->>DB with flags
            Trans-->>API + warnings
            API-->>FE with warnings
            FE-->>User with review needed
        end
    end
    
    Note over Trans,DB TM, log metrics, trigger notifications
      `,
    };
  }

  private static getSequenceCulturalDiagram() {
    return {
      id: 'sequence-cultural',
      name: 'Sequence Diagram - Cultural Analysis',
      description: 'Cultural adaptation and regulatory compliance flow',
      category: 'deep-dive',
      audience: 'UX Designers, Product Managers, Localization Specialists',
      purpose: 'Cultural intelligence workflow and decision-making process',
      keyInsight: 'Hofstede framework analysis prevents cultural misalignment',
      mermaidSyntax: `
sequenceDiagram
    actor CM as Content Manager
    participant FE as Frontend
    participant API as API Gateway
    participant Cult as Cultural Service
    participant MI as Market Intelligence
    participant Reg as Regulatory Engine
    participant AI as AI Analysis (Gemini)
    participant Collab as Collaboration Hub
    participant DB as Database
    
    CM->>FE content for cultural analysis
    FE->>API /cultural-analysis {content, markets}
    API->>Cult analysis workflow
    
    par Parallel Analysis
        Cult->>MI market context
        MI->>DB market data
        DB-->>MI norms, preferences
        MI-->>Cult intelligence
    and
        Cult->>Reg compliance requirements
        Reg->>DB regulatory rules
        DB-->>Reg-specific regulations
        Reg-->>Cult requirements
    end
    
    Cult->>Cult analysis context
    Cult->>AI cultural sensitivity
    AI-->>Cult insights + recommendations
    
    Cult->>DB analysis results
    
    loop For each target market
        Cult->>Cult adaptation recommendations
        Cult->>DB market-specific recommendations
    end
    
    Cult->>Collab review tasks
    Collab->>DB tasks for stakeholders
    
    Cult-->>API complete + task IDs
    API-->>FE response
    FE-->>CM analysis results
    
    Note over Collab review async
    
    par Stakeholder Reviews
        actor S1 as Local Reviewer 1
        actor S2 as Local Reviewer 2
        S1->>FE recommendations
        S1->>Collab with comments
        Collab->>DB task status
    and
        S2->>FE recommendations
        S2->>Collab changes
        Collab->>DB task status
    end
    
    Collab->>Cult reviews complete
    Cult->>DB adaptation
    Cult->>FE content manager
    FE->>CM approved
      `,
    };
  }

  private static getDataFlowDiagram() {
    return {
      id: 'data-flow',
      name: 'Data Flow Diagram',
      description: 'End-to-end data flow from ingestion to output',
      category: 'deep-dive',
      audience: 'Data Engineers, Integration Specialists, Security Teams',
      purpose: 'End-to-end data processing and transformation pipeline',
      keyInsight: 'Event-driven architecture ensures real-time data consistency',
      mermaidSyntax: `
graph LR
    subgraph "Input Sources"
        Email[Email ContentHTML/Text]
        DSA[DSA MaterialsPDF/Word]
        Website[Website ContentHTML/JSON]
    end
    
    subgraph "Ingestion & Parsing"
        Parser[Content ParserMulti-format]
        Extractor[Metadata ExtractorNLP Analysis]
        Validator1[Format ValidatorSchema Check]
    end
    
    subgraph "Processing Pipeline"
        Segmenter[Content SegmenterSentence Split]
        TMCheck[TM LookupFuzzy Match]
        Translator[AI TranslationGPT-5/Gemini]
        CulturalAnalyzer[Cultural AnalysisMarket Intelligence]
    end
    
    subgraph "Quality Assurance"
        TermChecker[Terminology CheckGlossary Match]
        QualityScorer[Quality ScorerMetrics Calculation]
        Validator2[Compliance CheckRegulatory Rules]
    end
    
    subgraph "Review & Approval"
        MLRQueue[MLR Review QueueWorkflow Manager]
        ReviewerUI[Reviewer InterfaceAnnotation Tools]
        ApprovalEngine[Approval EngineMulti-level]
    end
    
    subgraph "Storage Layers"
        RawStorage[(S3 Raw ContentOriginal Files)]
        CacheLayer[(Redis CacheTM & Sessions)]
        Database[(PostgreSQLStructured Data)]
    end
    
    subgraph "Output Generation"
        Assembler[Content AssemblerFormat Reconstruction]
        Packager[Package GeneratorMulti-format Export]
        Distributor[Distribution ServiceDelivery]
    end
    
    subgraph "Analytics"
        MetricsCollector[Metrics CollectorUsage Stats]
        Reporter[Report GeneratorDashboards]
    end
    
    Email --> Parser
    DSA --> Parser
    Website --> Parser
    
    Parser --> Extractor
    Extractor --> Validator1
    Validator1 -->|Valid| Segmenter
    Validator1 -->|Invalid| Parser
    
    Segmenter --> TMCheck
    TMCheck -->|Cache Hit| TermChecker
    TMCheck -->|Cache Miss| Translator
    
    Translator --> CulturalAnalyzer
    CulturalAnalyzer --> TermChecker
    
    TermChecker --> QualityScorer
    QualityScorer --> Validator2
    
    Validator2 -->|Pass| MLRQueue
    Validator2 -->|Fail| Translator
    
    MLRQueue --> ReviewerUI
    ReviewerUI --> ApprovalEngine
    ApprovalEngine -->|Approved| Assembler
    ApprovalEngine -->|Rejected| Translator
    
    Parser --> RawStorage
    TMCheck --> CacheLayer
    Translator --> CacheLayer
    Extractor --> Database
    QualityScorer --> Database
    ApprovalEngine --> Database
    
    Assembler --> Packager
    Packager --> Distributor
    Distributor --> RawStorage
    
    QualityScorer --> MetricsCollector
    ApprovalEngine --> MetricsCollector
    MetricsCollector --> Reporter
    Reporter --> Database
    
    classDef inputClass fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width
    classDef processClass fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width
    classDef qualityClass fill:#10b981,stroke:#059669,color:#fff,stroke-width
    classDef storageClass fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width
    classDef outputClass fill:#ef4444,stroke:#dc2626,color:#fff,stroke-width
    
    class Email,DSA,Website inputClass
    class Parser,Extractor,Validator1,Segmenter,TMCheck,Translator,CulturalAnalyzer processClass
    class TermChecker,QualityScorer,Validator2,MLRQueue,ReviewerUI,ApprovalEngine qualityClass
    class RawStorage,CacheLayer,Database storageClass
    class Assembler,Packager,Distributor,MetricsCollector,Reporter outputClass
      `,
    };
  }

  // ============= PLATFORM-WIDE ARCHITECTURE DIAGRAMS =============

  private static getFullPlatformC4ContextDiagram() {
    return {
      id: 'c4-context',
      name: 'Full Platform C4 Context Diagram',
      description: 'Complete system context showing all platform modules and external integrations',
      category: 'high-level',
      audience: 'Executives, Product Managers, Business Stakeholders, Investors',
      purpose: 'Shows complete platform boundaries, all user types, and third-party integrations',
      keyInsight: 'Integrated platform serves 7 core modules with shared authentication and data layer',
      mermaidSyntax: `
graph TB
    subgraph "External Actors"
        User1[Marketing TeamContent creation & strategy]
        User2[MLR ReviewerCompliance review]
        User3[Market TeamsLocal market validation]
        User4[DesignerVisual content creation]
        User5[System AdminPlatform configuration]
        User6[ExecutiveAnalytics & reporting]
    end
    
    subgraph "Brand Excellence Platform"
        Intake[Intake & HubProject management]
        Strategy[StrategyBrand planning]
        Theme[Theme IntelligenceMarket insights]
        Content[Content StudioContent authoring]
        Design[Design StudioVisual design]
        Gloc[GlocalizationMulti-market adaptation]
        PreMLR[Pre-MLRCompliance preparation]
    end
    
    subgraph "External Systems"
        SSO[SSO / Identity ProviderAuthentication]
        OpenAI[OpenAI APIAI generation]
        Gemini[Google GeminiAI analysis]
        Email[Email ServiceNotifications]
        Analytics[Analytics PlatformTracking & metrics]
        Storage[Cloud StorageFile management]
    end
    
    User1 -->|Creates content| Intake
    User1 -->|Defines strategy| Strategy
    User1 -->|Authors content| Content
    User2 -->|Reviews compliance| PreMLR
    User3 -->|Validates localization| Gloc
    User4 -->|Creates designs| Design
    User5 -->|Configures| Intake
    User6 -->|Views analytics| Theme
    
    Intake -->|Authenticates| SSO
    Strategy -->|AI insights| Gemini
    Theme -->|Market analysis| Gemini
    Content -->|AI generation| OpenAI
    Design -->|AI assets| OpenAI
    Gloc -->|Translation| OpenAI
    PreMLR -->|Compliance check| Gemini
    
    Intake -->|Sends notifications| Email
    Strategy -->|Tracks usage| Analytics
    Design -->|Stores files| Storage
    Gloc -->|Stores assets| Storage
    
    classDef userClass fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width
    classDef moduleClass fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width
    classDef externalClass fill:#10b981,stroke:#059669,color:#fff,stroke-width
    
    class User1,User2,User3,User4,User5,User6 userClass
    class Intake,Strategy,Theme,Content,Design,Gloc,PreMLR moduleClass
    class SSO,OpenAI,Gemini,Email,Analytics,Storage externalClass
      `,
    };
  }

  private static getFullPlatformC4ContainerDiagram() {
    return {
      id: 'c4-container',
      name: 'Full Platform C4 Container Diagram',
      description: 'Complete application architecture with all module containers and shared services',
      category: 'high-level',
      audience: 'Solution Architects, Technical Leads, Engineering Managers',
      purpose: 'Shows technology stack, microservices architecture, and data flow patterns',
      keyInsight: 'Event-driven architecture enables loose coupling and independent module scaling',
      mermaidSyntax: `
graph TB
    subgraph "Presentation Layer"
        Frontend[React SPATypeScript + ViteTailwind CSS]
    end
    
    subgraph "API Gateway"
        Gateway[Supabase Edge FunctionsDeno RuntimeREST + GraphQL]
    end
    
    subgraph "Module Services"
        IntakeSvc[Intake ServiceProject orchestration]
        StrategySvc[Strategy ServicePlanning & roadmap]
        ThemeSvc[Theme IntelligenceMarket analysis]
        ContentSvc[Content StudioAuthoring engine]
        DesignSvc[Design StudioAsset management]
        GlocSvc[Glocalization ServiceTranslation pipeline]
        PreMLRSvc[Pre-MLR ServiceCompliance validation]
    end
    
    subgraph "Shared Services"
        Auth[AuthenticationSupabase Auth]
        EventBus[Event BusReal-time sync]
        AIRouter[AI RouterMulti-provider]
        FileService[File ServiceStorage management]
    end
    
    subgraph "Data Layer"
        PostgreSQL[(PostgreSQLSupabase DB)]
        Redis[(RedisCache layer)]
        S3[(Object StorageFiles & assets)]
    end
    
    Frontend -->|HTTPS/WSS| Gateway
    
    Gateway --> IntakeSvc
    Gateway --> StrategySvc
    Gateway --> ThemeSvc
    Gateway --> ContentSvc
    Gateway --> DesignSvc
    Gateway --> GlocSvc
    Gateway --> PreMLRSvc
    
    IntakeSvc --> Auth
    StrategySvc --> AIRouter
    ThemeSvc --> AIRouter
    ContentSvc --> AIRouter
    DesignSvc --> AIRouter
    GlocSvc --> AIRouter
    PreMLRSvc --> AIRouter
    
    IntakeSvc --> EventBus
    StrategySvc --> EventBus
    ContentSvc --> EventBus
    GlocSvc --> EventBus
    
    DesignSvc --> FileService
    GlocSvc --> FileService
    
    IntakeSvc --> PostgreSQL
    StrategySvc --> PostgreSQL
    ThemeSvc --> PostgreSQL
    ContentSvc --> PostgreSQL
    DesignSvc --> PostgreSQL
    GlocSvc --> PostgreSQL
    PreMLRSvc --> PostgreSQL
    
    AIRouter --> Redis
    FileService --> S3
    
    classDef frontendClass fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width
    classDef serviceClass fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width
    classDef sharedClass fill:#10b981,stroke:#059669,color:#fff,stroke-width
    classDef dataClass fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width
    
    class Frontend frontendClass
    class Gateway,IntakeSvc,StrategySvc,ThemeSvc,ContentSvc,DesignSvc,GlocSvc,PreMLRSvc serviceClass
    class Auth,EventBus,AIRouter,FileService sharedClass
    class PostgreSQL,Redis,S3 dataClass
      `,
    };
  }

  private static getFullPlatformDeploymentDiagram() {
    return {
      id: 'deployment',
      name: 'Full Platform Deployment Architecture',
      description: 'Production deployment topology across cloud infrastructure',
      category: 'high-level',
      audience: 'DevOps Engineers, Infrastructure Architects, CTO, Security Team',
      purpose: 'Shows cloud infrastructure, deployment zones, and operational components',
      keyInsight: 'Multi-region deployment with auto-scaling ensures 99.9% uptime SLA',
      mermaidSyntax: `
graph TB
    subgraph "CDN Layer"
        CloudFront[CloudFront CDNGlobal edge locationsStatic assets]
    end
    
    subgraph "Load Balancing"
        ALB[Application Load BalancerSSL terminationHealth checks]
    end
    
    subgraph "Web Tier - Auto Scaling Group"
        Web1[Web Server 1React SPANginx]
        Web2[Web Server 2React SPANginx]
        Web3[Web Server NReact SPANginx]
    end
    
    subgraph "API Tier - Supabase Cloud"
        API1[Edge Function Node 1Deno runtime]
        API2[Edge Function Node 2Deno runtime]
        API3[Edge Function Node NDeno runtime]
    end
    
    subgraph "Application Services - Kubernetes Cluster"
        Pod1[Module Services Pod 1Intake, Strategy, Theme]
        Pod2[Module Services Pod 2Content, Design, Gloc]
        Pod3[Module Services Pod 3Pre-MLR, Shared Services]
    end
    
    subgraph "Data Tier - Multi-AZ"
        PrimaryDB[(Primary DBPostgreSQLAZ-1)]
        ReplicaDB[(Read ReplicaPostgreSQLAZ-2)]
        RedisCluster[(Redis Cluster3-node HA)]
    end
    
    subgraph "Storage Tier"
        S3Primary[S3 Primary BucketUS-East-1Versioning enabled]
        S3Replica[S3 Replica BucketEU-West-1Cross-region replication]
    end
    
    subgraph "External Services"
        OpenAI[OpenAI API]
        Gemini[Google Gemini API]
        SendGrid[SendGrid Email]
    end
    
    CloudFront --> ALB
    ALB --> Web1
    ALB --> Web2
    ALB --> Web3
    
    Web1 --> API1
    Web2 --> API2
    Web3 --> API3
    
    API1 --> Pod1
    API2 --> Pod2
    API3 --> Pod3
    
    Pod1 --> PrimaryDB
    Pod2 --> PrimaryDB
    Pod3 --> PrimaryDB
    
    PrimaryDB -.->|Replication| ReplicaDB
    
    Pod1 --> RedisCluster
    Pod2 --> RedisCluster
    Pod3 --> RedisCluster
    
    Pod2 --> S3Primary
    Pod3 --> S3Primary
    S3Primary -.->|Cross-region| S3Replica
    
    Pod1 --> Gemini
    Pod2 --> OpenAI
    Pod3 --> SendGrid
    
    classDef cdnClass fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width
    classDef webClass fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width
    classDef appClass fill:#10b981,stroke:#059669,color:#fff,stroke-width
    classDef dataClass fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width
    classDef externalClass fill:#ef4444,stroke:#dc2626,color:#fff,stroke-width
    
    class CloudFront cdnClass
    class ALB,Web1,Web2,Web3 webClass
    class API1,API2,API3,Pod1,Pod2,Pod3 appClass
    class PrimaryDB,ReplicaDB,RedisCluster,S3Primary,S3Replica dataClass
    class OpenAI,Gemini,SendGrid externalClass
      `,
    };
  }

  private static getModuleInteractionSequenceDiagram() {
    return {
      id: 'sequence-translation',
      name: 'Cross-Module Workflow Sequence',
      description: 'End-to-end workflow showing how modules interact in a typical content lifecycle',
      category: 'high-level',
      audience: 'Product Managers, Business Analysts, Solution Architects',
      purpose: 'Demonstrates data flow and handoffs between modules from intake to compliance',
      keyInsight: 'Asynchronous event-driven handoffs enable parallel processing and reduce bottlenecks',
      mermaidSyntax: `
sequenceDiagram
    participant User as Marketing Team
    participant Intake as Intake & Hub
    participant Strategy as Strategy Module
    participant Content as Content Studio
    participant Gloc as Glocalization
    participant PreMLR as Pre-MLR
    participant MLR as MLR Reviewer
    
    User->>Intake new brand project
    activate Intake
    Intake->>Intake project workspace
    Intake-->>User created
    deactivate Intake
    
    User->>Strategy brand strategy
    activate Strategy
    Strategy->>Strategy market positioning
    Strategy->>Strategy recommendations
    Strategy-->>User approved
    Strategy->>Intake strategy event
    deactivate Strategy
    
    User->>Content master content
    activate Content
    Content->>Content content variants
    Content->>Content content generation
    Content-->>User ready
    Content->>Intake content event
    deactivate Content
    
    User->>Gloc localization (50 markets)
    activate Gloc
    Gloc->>Gloc translation (parallel)
    Gloc->>Gloc adaptation
    Gloc->>Gloc validation
    Gloc-->>User markets localized
    Gloc->>Intake localization event
    deactivate Gloc
    
    User->>PreMLR for compliance check
    activate PreMLR
    PreMLR->>PreMLR compliance scan
    PreMLR->>PreMLR compliance report
    PreMLR-->>User-MLR complete
    PreMLR->>MLR to MLR queue
    deactivate PreMLR
    
    MLR->>PreMLR flagged items
    activate PreMLR
    PreMLR-->>MLR report
    deactivate PreMLR
    
    MLR->>Intake project
    activate Intake
    Intake->>Intake project complete
    Intake-->>User approved & deployed
    deactivate Intake
      `,
    };
  }

  private static getFullPlatformERDiagram() {
    return {
      id: 'erd',
      name: 'Full Platform Entity-Relationship Diagram',
      description: 'Complete database schema showing all platform tables and relationships',
      category: 'high-level',
      audience: 'Database Architects, Backend Developers, Data Engineers',
      purpose: 'Shows normalized database design, table relationships, and multi-tenant architecture',
      keyInsight: 'Shared data model with tenant isolation enables SaaS multi-tenancy and data analytics',
      mermaidSyntax: `
erDiagram
    USERS ||--o{ PROJECTS 
    USERS ||--o{ BRANDS 
    USERS {
        uuid id PK
        string email UK
        string role
        timestamp created_at
        uuid tenant_id FK
    }
    
    TENANTS ||--o{ USERS 
    TENANTS ||--o{ PROJECTS 
    TENANTS {
        uuid id PK
        string name
        string subscription_tier
        json settings
        timestamp created_at
    }
    
    PROJECTS ||--o{ STRATEGIES 
    PROJECTS ||--o{ CONTENT_ITEMS 
    PROJECTS ||--o{ GLOCALIZATION_JOBS 
    PROJECTS ||--o{ DESIGN_ASSETS 
    PROJECTS {
        uuid id PK
        uuid tenant_id FK
        uuid brand_id FK
        string name
        string status
        timestamp created_at
        uuid created_by FK
    }
    
    BRANDS ||--o{ PROJECTS 
    BRANDS ||--o{ THEME_INSIGHTS 
    BRANDS {
        uuid id PK
        uuid tenant_id FK
        string name
        json brand_guidelines
        json tone_of_voice
        timestamp created_at
    }
    
    STRATEGIES ||--o{ CONTENT_ITEMS 
    STRATEGIES {
        uuid id PK
        uuid project_id FK
        json positioning
        json target_markets
        json key_messages
        timestamp created_at
    }
    
    THEME_INSIGHTS ||--o{ STRATEGIES 
    THEME_INSIGHTS {
        uuid id PK
        uuid brand_id FK
        string market
        json cultural_insights
        json competitive_analysis
        timestamp analyzed_at
    }
    
    CONTENT_ITEMS ||--o{ TRANSLATIONS 
    CONTENT_ITEMS ||--o{ DESIGN_ASSETS 
    CONTENT_ITEMS {
        uuid id PK
        uuid project_id FK
        string content_type
        text master_content
        json metadata
        timestamp created_at
    }
    
    GLOCALIZATION_JOBS ||--o{ TRANSLATIONS 
    GLOCALIZATION_JOBS {
        uuid id PK
        uuid project_id FK
        uuid content_id FK
        string status
        json target_markets
        timestamp started_at
    }
    
    TRANSLATIONS ||--o{ MLR_REVIEWS 
    TRANSLATIONS {
        uuid id PK
        uuid glocalization_job_id FK
        uuid content_id FK
        string target_market
        text translated_content
        json cultural_adaptations
        float quality_score
        timestamp created_at
    }
    
    DESIGN_ASSETS ||--o{ ASSET_VERSIONS 
    DESIGN_ASSETS {
        uuid id PK
        uuid project_id FK
        uuid content_id FK
        string asset_type
        string file_url
        json metadata
        timestamp created_at
    }
    
    ASSET_VERSIONS {
        uuid id PK
        uuid asset_id FK
        int version_number
        string file_url
        uuid created_by FK
        timestamp created_at
    }
    
    MLR_REVIEWS ||--o{ COMPLIANCE_ISSUES 
    MLR_REVIEWS {
        uuid id PK
        uuid translation_id FK
        uuid reviewer_id FK
        string status
        text comments
        timestamp reviewed_at
    }
    
    COMPLIANCE_ISSUES {
        uuid id PK
        uuid review_id FK
        string issue_type
        string severity
        text description
        string resolution_status
        timestamp created_at
    }
      `,
    };
  }
}


export default ArchitectureDiagramService;