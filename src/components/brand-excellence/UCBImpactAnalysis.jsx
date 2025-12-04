import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, DollarSign, Shield, Target, Users } from "lucide-react";

const impactCategories = [
  {
    id: "operational",
    title: "Operational Excellence",
    icon: Zap,
    color: "blue",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
    iconClass: "text-blue-600",
    impacts: [
      {
        area: "Time-to-Market",
        quantitative: "75% reduction (12 weeks → 3 weeks)",
        qualitative: "Competitive advantage through faster campaign launches; ability to respond to market opportunities in real-time; increased agility in product launch coordination"
      },
      {
        area: "Content Throughput",
        quantitative: "102 localized assets/year (vs. 34 baseline)",
        qualitative: "3x capacity increase without headcount growth; ability to support multiple concurrent campaigns; scalability for portfolio expansion"
      },
      {
        area: "Process Efficiency",
        quantitative: "40% labor efficiency improvement",
        qualitative: "Elimination of manual, repetitive tasks; team focus shift from tactical execution to strategic planning; reduced burnout and improved job satisfaction"
      },
      {
        area: "Asset Reusability",
        quantitative: "60% modular content reuse rate",
        qualitative: "Consistent brand messaging across markets; accelerated campaign development; reduced duplication of effort"
      }
    ]
  },
  {
    id: "financial",
    title: "Financial Performance",
    icon: DollarSign,
    color: "green",
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
    iconClass: "text-green-600",
    impacts: [
      {
        area: "Total Annual Value",
        quantitative: "$3.2M+ per brand",
        qualitative: "Direct bottom-line impact; measurable ROI demonstrating platform value; executive-level justification for investment"
      },
      {
        area: "Translation Cost Savings",
        quantitative: "$320K (30% reduction)",
        qualitative: "Optimized TM leverage; AI-powered efficiency; reduced vendor dependency while maintaining quality"
      },
      {
        area: "MLR Rework Elimination",
        quantitative: "$480K saved (60% → 10% rejection)",
        qualitative: "Predictable budgets; reduced emergency agency spend; better cost forecasting and resource allocation"
      },
      {
        area: "Revenue Protection",
        quantitative: "$1.8M (3-month launch acceleration)",
        qualitative: "Preserved market opportunity; competitive positioning; maximized patent lifecycle value"
      },
      {
        area: "Opportunity Cost Recovery",
        quantitative: "$380K (freed capacity)",
        qualitative: "Ability to pursue additional revenue-generating campaigns; innovation capacity; strategic initiative bandwidth"
      },
      {
        area: "ROI Timeline",
        quantitative: "12-18 month payback",
        qualitative: "Fast value realization; low financial risk; board-level confidence in investment"
      }
    ]
  },
  {
    id: "compliance",
    title: "Compliance & Risk Mitigation",
    icon: Shield,
    color: "purple",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200",
    iconClass: "text-purple-600",
    impacts: [
      {
        area: "First-Pass MLR Approval",
        quantitative: "90% (vs. 40% baseline)",
        qualitative: "Reduced regulatory risk; brand reputation protection; streamlined approval workflows"
      },
      {
        area: "Regulatory Coverage",
        quantitative: "50+ markets validated",
        qualitative: "Global compliance confidence; scalable market entry; reduced legal review burden"
      },
      {
        area: "Pre-Submission Validation",
        quantitative: "100% content screened",
        qualitative: "Proactive risk identification; issue resolution before formal review; audit trail for compliance documentation"
      },
      {
        area: "Brand Consistency Score",
        quantitative: "85% adherence rate",
        qualitative: "Reduced off-brand messaging risk; protected brand equity; consistent patient/HCP experience"
      },
      {
        area: "Medical Accuracy",
        quantitative: "Pharmaceutical-specific AI training",
        qualitative: "Reduced medical/scientific errors; credibility with healthcare professionals; patient safety alignment"
      }
    ]
  },
  {
    id: "strategic",
    title: "Strategic Capability",
    icon: Target,
    color: "orange",
    bgClass: "bg-orange-50",
    borderClass: "border-orange-200",
    iconClass: "text-orange-600",
    impacts: [
      {
        area: "Competitive Intelligence",
        quantitative: "Real-time market analysis",
        qualitative: "Informed strategic positioning; proactive competitive response; white space opportunity identification"
      },
      {
        area: "Cultural Intelligence",
        quantitative: "50+ market frameworks (Hofstede)",
        qualitative: "Authentic local market resonance; avoided cultural missteps; enhanced brand perception globally"
      },
      {
        area: "AI-Powered Insights",
        quantitative: "Multi-tier AI (GPT-5, Gemini 2.5)",
        qualitative: "Advanced reasoning capabilities; continuous learning from outcomes; future-proof technology foundation"
      },
      {
        area: "Strategic Theme Library",
        quantitative: "Confidence-scored recommendations",
        qualitative: "Data-driven creative decisions; reduced subjective debate; alignment with market evidence"
      },
      {
        area: "Global-Local Balance",
        quantitative: '"Glocalization" optimization',
        qualitative: "Brand consistency + cultural relevance; efficient scaling without local sacrifice; unified global strategy"
      }
    ]
  },
  {
    id: "organizational",
    title: "Organizational Capacity",
    icon: Users,
    color: "indigo",
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-200",
    iconClass: "text-indigo-600",
    impacts: [
      {
        area: "Team Capacity Gain",
        quantitative: "6 FTE equivalent ($480K value)",
        qualitative: "Resource redeployment to high-value activities; innovation bandwidth; reduced hiring pressure"
      },
      {
        area: "Skills Evolution",
        quantitative: "Team upskilling from tactical → strategic",
        qualitative: "Enhanced employee value; career development; retention of top talent"
      },
      {
        area: "Cross-Functional Collaboration",
        quantitative: "Unified platform (replacing 6-8 tools)",
        qualitative: "Reduced tool fragmentation; improved visibility; streamlined stakeholder communication"
      },
      {
        area: "Knowledge Retention",
        quantitative: "MLR memory system",
        qualitative: "Institutional knowledge preservation; reduced dependency on individuals; faster onboarding for new team members"
      },
      {
        area: "Implementation Timeline",
        quantitative: "16-20 weeks to full deployment",
        qualitative: "Manageable change management; phased value realization; minimized disruption to ongoing operations"
      }
    ]
  }
];

export const UCBImpactAnalysis = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-3xl">UCB Impact Analysis: Quantitative & Qualitative Value</CardTitle>
        <CardDescription className="text-base">
          Comprehensive assessment of platform impact across operational, financial, compliance, strategic, and organizational dimensions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {impactCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id} className={`border ${category.borderClass} ${category.bgClass} rounded-lg p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg bg-white border ${category.borderClass}`}>
                  <Icon className={`w-6 h-6 ${category.iconClass}`} />
                </div>
                <h3 className="text-2xl font-semibold">{category.title}</h3>
              </div>
              
              <div className="bg-white rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/5 font-semibold">Impact Area</TableHead>
                      <TableHead className="w-1/3 font-semibold">Quantitative Metric</TableHead>
                      <TableHead className="w-2/5 font-semibold">Qualitative Impact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.impacts.map((impact, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{impact.area}</TableCell>
                        <TableCell className="font-semibold text-primary">{impact.quantitative}</TableCell>
                        <TableCell className="text-muted-foreground">{impact.qualitative}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        })}

        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20">
          <h4 className="text-xl font-semibold mb-3">Impact Analysis Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-3xl font-bold text-primary">$3.2M+</div>
              <div className="text-sm text-muted-foreground">Total Annual Value per Brand</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-3xl font-bold text-primary">75%</div>
              <div className="text-sm text-muted-foreground">Time-to-Market Reduction</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-3xl font-bold text-primary">90%</div>
              <div className="text-sm text-muted-foreground">First-Pass MLR Approval Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};